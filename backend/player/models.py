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