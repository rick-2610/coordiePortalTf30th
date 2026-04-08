from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import PlayerScore
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
    # Creates a new player with a given name and a default score of 0.
    serializer = PlayerScoreSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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