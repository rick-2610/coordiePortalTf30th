from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import PlayerScore2, Coordinators
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
    top = PlayerScore2.objects.all().order_by('-score')[:10]
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


    obj, created = PlayerScore2.objects.get_or_create(name=name, defaults={'score': score})
    if not created and score > obj.score:
        obj.score = score
        obj.save()

    top = PlayerScore2.objects.all().order_by('-score', 'updated_at')[:10]
    top_serialized = PlayerScoreSerializer(top, many=True)
    return Response({'top': top_serialized.data})

@api_view(['POST'])
def create_player(request):
    name = request.data.get('name')
    
    if not name:
        return Response({'error': 'Name is required'}, status=status.HTTP_400_BAD_REQUEST)

    player, created = PlayerScore2.objects.get_or_create(
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
        player = PlayerScore2.objects.get(pk=pk)
        player.last_game_start = time.time() # Records exact server time
        player.save()
        return Response({"message": "Server stopwatch started."})
    except PlayerScore2.DoesNotExist:
        return Response({"error": "Player not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
def update_player_score(request, pk):
    try:
        player = PlayerScore2.objects.get(pk=pk)
    except PlayerScore2.DoesNotExist:
        return Response({"error": "Player not found."}, status=status.HTTP_404_NOT_FOUND)

    # 1. Payload Extraction
    new_score = int(request.data.get('score', 0))
    client_sig = request.data.get('signature', '')
    jump_history = request.data.get('jump_history', []) 
    is_mobile = request.data.get('is_mobile', False) # Passed from client to know pipe spawn rate
    
    SECRET_SALT = "TechFest_30th_machaxxx"
    
    # 2. Signature Validation (Integrity Check)
    data_string = f"{new_score}{SECRET_SALT}"
    expected_sig = hashlib.sha256(data_string.encode()).hexdigest()
    
    if client_sig != expected_sig:
        return Response({"error": "Signature mismatch. Nice try!"}, status=403)
    
    # 3. Session Check
    # A fresh start will be a massive Unix timestamp (e.g., 1700000000+). 
    # If it's a small number, it's just the 'time alive' from a previous completed game.
    # if not player.last_game_start or player.last_game_start < 1000000000:
    #     return Response({"error": "No active session found. Did you start the game?"}, status=403)

    # Calculate exact time alive
    if player.last_game_start:
        time_alive_seconds = time.time() - player.last_game_start
    
    # # 4. Math & Bot Validation
    # if new_score > 5:
    #     # A) Maximum Possible Score Check
    #     # TIME constant from frontend: Desktop = 900ms (0.9s), Mobile = 2000ms (2s)
    #     time_between_pipes = 2.0 if is_mobile else 0.9
        
    #     # Max score = (time alive / spawn rate) + 2 (buffer for pipes on screen at start)
    #     max_possible_score = math.floor(time_alive_seconds / time_between_pipes) + 2
        
    #     if new_score > max_possible_score:
    #         player.last_game_start = time_alive_seconds # Save duration before rejecting
    #         player.save()
    #         return Response({"error": "Mathematically impossible score for time played."}, status=403)

    #     # B) Jump History Check
    #     if not jump_history or len(jump_history) < (new_score * 0.5):
    #         player.last_game_start = time_alive_seconds
    #         player.save()
    #         return Response({"error": "Impossible jump-to-score ratio."}, status=403)

    #     # C) Bot Detection: Jump Cadence Variance (Standard Deviation)
    #     # Real humans have jitter. Bots click with exact intervals.
    #     timestamps = [j.get('t', 0) for j in jump_history]
    #     if len(timestamps) > 5:
    #         intervals = [timestamps[i] - timestamps[i-1] for i in range(1, len(timestamps))]
            
    #         # Calculate standard deviation
    #         mean_interval = sum(intervals) / len(intervals)
    #         variance = sum((x - mean_interval) ** 2 for x in intervals) / len(intervals)
    #         std_dev = math.sqrt(variance)
            
    #         # If standard deviation is less than 10ms, a machine is generating the clicks
    #         if std_dev < 10:
    #             player.last_game_start = time_alive_seconds
    #             player.save()
    #             return Response({"error": "Inhuman precision detected."}, status=403)

    # 5. High Score Update
    if new_score > player.score:
        player.score = new_score
        player.high_score_time = time_alive_seconds
        
    player.save()
    
    return Response(PlayerScoreSerializer(player).data)


    

@api_view(['GET'])
def get_player(request, pk):
    try:
        player = PlayerScore2.objects.get(pk=pk)
    except PlayerScore2.DoesNotExist:
        return Response({'error': 'Player not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = PlayerScoreSerializer(player)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def global_top_score(request):
    top_player = PlayerScore2.objects.all().order_by('-score').first()
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