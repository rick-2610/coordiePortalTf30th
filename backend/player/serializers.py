from rest_framework import serializers
from .models import PlayerScore


class PlayerScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerScore
        fields = ['id', 'name', 'score', 'updated_at']

class PlayerScoreUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerScore
        fields = ['score']