from django.urls import path
from .views import register_api, profile_detail_api, edit_profile_api, change_password, delete_account

urlpatterns = [
    path("api/register/", register_api),
    path("api/profile/", profile_detail_api),
    path("api/profile/edit/", edit_profile_api),
    path("api/change-password/", change_password),
    path("api/delete-account/", delete_account),
]
