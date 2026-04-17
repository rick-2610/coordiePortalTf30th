from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import PlayerScore, Coordinators
from .serializers import *
from rest_framework import status


# List top 10
@api_view(['GET'])
def top_scores_list(request):
    # Get the top 10 players by score
    top = PlayerScore.objects.all().order_by('-score')[:10]
    serializer = PlayerScoreSerializer(top, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_score(request):
    serializer = PlayerScoreSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# Live update endpoint, client sends current score periodically while playing.
@api_view(['POST'])
def live_update(request):
    """
    Accepts {'name': ..., 'score': ...}
    Creates a PlayerScore for new players or updates the stored score only
    if the incoming score is strictly higher than the stored score.
    Returns the current top-10 list.
    """
    name = request.data.get('name')
    score = request.data.get('score')
    if name is None or score is None:
        return Response({'detail': 'name and score required'}, status=400)
    try:
        score = int(score)
    except (ValueError, TypeError):
        return Response({'detail': 'score must be an integer'}, status=400)


    obj, created = PlayerScore.objects.get_or_create(name=name, defaults={'score': score})
    if not created and score > obj.score:
        obj.score = score
        obj.save()

    top = PlayerScore.objects.all().order_by('-score', 'updated_at')[:10]
    top_serialized = PlayerScoreSerializer(top, many=True)
    return Response({'top': top_serialized.data})

@api_view(['POST'])
def create_player(request):
    name = request.data.get('name')
    
    if not name:
        return Response({'error': 'Name is required'}, status=status.HTTP_400_BAD_REQUEST)

    player, created = PlayerScore.objects.get_or_create(
        name=name, 
        defaults={'score': 0}
    )
    
    serializer = PlayerScoreSerializer(player)
    
    status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
    
    return Response(serializer.data, status=status_code)

@api_view(['PATCH'])
def update_player_score(request, pk):
    try:
        player = PlayerScore.objects.get(pk=pk)
    except PlayerScore.DoesNotExist:
        return Response({'error': 'Player not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = PlayerScoreUpdateSerializer(data=request.data)
    if serializer.is_valid():
        new_score = serializer.validated_data['score']

        if new_score > player.score:
            player.score = new_score
            player.save()
        
        response_serializer = PlayerScoreSerializer(player)
        return Response(response_serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_player(request, pk):
    try:
        player = PlayerScore.objects.get(pk=pk)
    except PlayerScore.DoesNotExist:
        return Response({'error': 'Player not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = PlayerScoreSerializer(player)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def global_top_score(request):
    top_player = PlayerScore.objects.all().order_by('-score').first()
    top_score_value = top_player.score if top_player else 0
    return Response({'top_score': top_score_value}, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_coordinator(request):
    data = request.data

    try:
        coordinator = Coordinators.objects.create(
            name=data.get('name'),
            roll_no=data.get('roll_no'),
            contact_no=data.get('contact_no'),
            verticals=data.get('verticals', [])
        )
        return Response({"message": "Coordinator created"}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)