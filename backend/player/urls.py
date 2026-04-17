from django.urls import path
from .views import *


urlpatterns = [
    path('top/', top_scores_list, name='top-scores'),
    path('live/', live_update, name='live-update'),
    path('create/', create_player, name='create-player'),
    path('<int:pk>/update_score/', update_player_score, name='update-player-score'),
    path('player/<int:pk>/', get_player, name='player-score-show'),
    path('scores/global-top/', global_top_score, name='global-top-score'),

    path('create_coordi/', create_coordinator, name='create_coordinator'),
]