from django.db import models
import uuid


class PlayerScore(models.Model):
    name = models.CharField(max_length=50, unique=True)
    score = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now_add=True)
    
    # THE SERVER STOPWATCH: Stores exact start time in seconds
    last_game_start = models.FloatField(null=True, blank=True)

    class Meta:
        ordering = ['-score', 'updated_at']

    def __str__(self):
        return f"{self.name} - {self.score}"


class PlayerScore2(models.Model):
    name = models.CharField(max_length=50, unique=True)
    score = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now_add=True)
    
    # THE SERVER STOPWATCH: Stores exact start time in seconds
    last_game_start = models.FloatField(null=True, blank=True)
    high_score_time = models.FloatField(null=True, blank=True, default=0)

    class Meta:
        ordering = ['-score', 'updated_at']

    def __str__(self):
        return f"{self.name} - {self.score}"


class Coordinators(models.Model):
    VERTICAL_CHOICES = [
        ("Competitions", "Competitions"),
        ("Exhibitions", "Exhibitions"),
        ("Ozone", "Ozone"),
        ("Technoholix", "Technoholix"),
        ("Lectures", "Lectures"),
        ("Robowars", "Robowars"),
        ("Infrastructure", "Infrastructure"),
        ("Marketing", "Marketing"),
        ("Hospitality", "Hospitality"),
        ("Foods n Beverages", "Foods n Beverages"),
        ("Web", "Web"),
        ("Creative", "Creative"),
        ("Media n Publicity", "Media n Publicity"),
    ]

    name = models.CharField(max_length=255)
    roll_no = models.CharField(max_length=50, unique=True)
    contact_no = models.CharField(max_length=15)
    
    verticals = models.JSONField()

    def __str__(self):
        return f"{self.name} ({self.roll_no})"



import random
import string

from django.contrib.auth.models import User
from django.db import models


def generate_code():
    """6-char join code, e.g. 'K3F9QZ'."""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


class PlayerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    wins = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)
    games_played = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.user.username


class Lobby(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('playing', 'Playing'),
        ('finished', 'Finished'),
    ]
    code = models.CharField(max_length=8, unique=True, default=generate_code)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_lobbies')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='waiting')
    max_players = models.PositiveSmallIntegerField(default=4)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Lobby {self.code} ({self.status})'


class LobbySeat(models.Model):
    """Which user sits in which of the 4 seats (0=South/bottom .. going clockwise)."""
    lobby = models.ForeignKey(Lobby, on_delete=models.CASCADE, related_name='seats')
    seat_index = models.PositiveSmallIntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lobby_seats')
    ready = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('lobby', 'seat_index'), ('lobby', 'user')]

    def __str__(self):
        return f'{self.lobby.code}: seat {self.seat_index} = {self.user.username}'


class Match(models.Model):
    lobby = models.ForeignKey(Lobby, on_delete=models.SET_NULL, null=True, related_name='matches')
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='match_wins')
    duration_seconds = models.FloatField(default=0)


class MatchPlayer(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='players')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    seat_index = models.PositiveSmallIntegerField()
    placement = models.PositiveSmallIntegerField(null=True, blank=True)  # 1 = winner, 2, 3, 4