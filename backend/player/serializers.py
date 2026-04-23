from rest_framework import serializers
from .models import PlayerScore2


class PlayerScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerScore2
        fields = ['id', 'name', 'score', 'updated_at']

class PlayerScoreUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerScore2
        fields = ['score']