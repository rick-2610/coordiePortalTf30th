from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import PlayerScore, Coordinators
from .serializers import *
from rest_framework import status

import csv
from django.http import HttpResponse

import hashlib
import time


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


# NEW ENDPOINT: Starts the un-hackable server clock
@api_view(['POST'])
def start_game(request, pk):
    try:
        player = PlayerScore.objects.get(pk=pk)
        player.last_game_start = time.time() # Records exact server time
        player.save()
        return Response({"message": "Server stopwatch started."})
    except PlayerScore.DoesNotExist:
        return Response({"error": "Player not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
def update_player_score(request, pk):
    try:
        player = PlayerScore.objects.get(pk=pk)
    except PlayerScore.DoesNotExist:
        return Response({"error": "Player not found."}, status=status.HTTP_404_NOT_FOUND)

    # 1. Payload Extraction
    new_score = int(request.data.get('score', 0))
    client_sig = request.data.get('signature', '')
    jump_history = request.data.get('jump_history', []) # The new bot-detection array
    
    SECRET_SALT = "TechFest_30th_machaxxx"
    
    # 2. Signature Validation (Integrity Check)
    data_string = f"{new_score}{SECRET_SALT}"
    expected_sig = hashlib.sha256(data_string.encode()).hexdigest()
    
    if client_sig != expected_sig:
        return Response({"error": "Signature mismatch. Nice try!"}, status=403)
    
    # 3. Session Check
    if not player.last_game_start:
        return Response({"error": "No active session found. Did you start the game?"}, status=403)

    # Reset clock immediately to prevent multi-submission from one start
    player.last_game_start = None
    
    # (Physics/Time limit violation check temporarily removed for genuine gameplay bugs)

    # 4. Jump History Analysis (Bot Detection)
    if new_score > 5: # Only run for meaningful scores
        if not jump_history or len(jump_history) < (new_score * 0.5):
            player.save()
            return Response({"error": "Impossible jump-to-score ratio."}, status=403)

        # Bot Check: Interval Variance
        # Real humans have "jitter." Bots click at exact intervals (e.g., every 100ms).
        timestamps = [j['t'] for j in jump_history]
        if len(timestamps) > 5:
            intervals = [timestamps[i] - timestamps[i-1] for i in range(1, len(timestamps))]
            unique_intervals = len(set(intervals))
            
            # If they jumped 20 times and only had 1 or 2 different interval gaps, it's a bot.
            if unique_intervals < 3:
                player.save()
                return Response({"error": "Inhuman precision detected."}, status=403)

    # 5. High Score Update
    if new_score > player.score:
        player.score = new_score
        
    player.save()
    return Response(PlayerScoreSerializer(player).data)


    

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

def export_coordinators_csv(request):
    # Create the HttpResponse object with CSV headers
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="techfest_coordinators.csv"'

    writer = csv.writer(response)
    
    # Write the Header Row
    writer.writerow(['Name', 'Roll Number', 'Contact Number', 'Verticals'])

    # Fetch all coordinator records
    coordinators = Coordinators.objects.all()

    for coord in coordinators:
        # Since verticals is a JSONField (a list), we join them with commas for the CSV
        verticals_list = ", ".join(coord.verticals) if isinstance(coord.verticals, list) else coord.verticals
        
        writer.writerow([
            coord.name, 
            coord.roll_no, 
            coord.contact_no, 
            verticals_list
        ])

    return response