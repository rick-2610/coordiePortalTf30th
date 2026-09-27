from rest_framework import serializers
from .models import PlayerScore2


class PlayerScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerScore2
        fields = ['id', 'name', 'score', 'updated_at']

class PlayerScoreUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerScore2
        fields = ['score', 'high_score_time']

from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Lobby, LobbySeat, PlayerProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'password']

    def validate_username(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Username cannot be blank.')
        # Django's unique=True on User.username is case-SENSITIVE, so "Alex"
        # and "alex" would otherwise be treated as different accounts and one
        # person could effectively squat on someone else's identity. Block that.
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('That username is already taken.')
        return value

    def create(self, validated_data):
        user = User(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        PlayerProfile.objects.get_or_create(user=user)
        return user


class LobbySeatSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = LobbySeat
        fields = ['seat_index', 'username', 'ready']


class LobbySerializer(serializers.ModelSerializer):
    seats = LobbySeatSerializer(many=True, read_only=True)

    class Meta:
        model = Lobby
        fields = ['id', 'code', 'status', 'max_players', 'created_at', 'seats']