from django.db import models
import uuid


class PlayerScore(models.Model):
    name = models.CharField(max_length=50, unique=True)
    score = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        ordering = ['-score', 'updated_at']


    def __str__(self):
        return f"{self.name} - {self.score}"