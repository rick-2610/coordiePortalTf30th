from django.urls import path
from .views import *
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('top/', top_scores_list, name='top-scores'),
    path('live/', live_update, name='live-update'),
    path('create/', create_player, name='create-player'),
    path('<int:pk>/start_game/', start_game, name='start-game'),
    path('<int:pk>/update_score/', update_player_score, name='update-player-score'),
    path('player/<int:pk>/', get_player, name='player-score-show'),
    path('scores/global-top/', global_top_score, name='global-top-score'),
    path('export/coordinators/csv/', export_coordinators_csv, name='export_coordinators_csv'),

    path('create_coordi/', create_coordinator, name='create_coordinator'),

    path('auth/register/', views.RegisterView.as_view()),
    path('auth/token/', TokenObtainPairView.as_view()),
    path('auth/token/refresh/', TokenRefreshView.as_view()),
    path('lobby/create/', views.create_lobby),
    path('lobby/join/', views.join_lobby),
    path('lobby/<str:code>/', views.lobby_detail),
]