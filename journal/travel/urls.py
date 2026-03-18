from django.urls import path
from .views import journals, toggle_like, add_comment, delete_comment, get_profile, toggle_follow, get_user_profile, delete_journal, update_journal, get_user_connections

urlpatterns = [
    path('journals/', journals),
    path('like/<int:journal_id>/', toggle_like),
    path('comment/<int:journal_id>/', add_comment),
    path('comment/delete/<int:comment_id>/', delete_comment),

    # Logged-in user's own profile
    path('profile/', get_profile),

    # Other user's profile
    path('profile/<str:username>/', get_user_profile),

    path('follow/<str:username>/', toggle_follow),

    path('journals/<int:journal_id>/delete/', delete_journal),

    path('journals/<int:journal_id>/update/', update_journal),

    path('profile/<str:username>/connections/', get_user_connections),
]