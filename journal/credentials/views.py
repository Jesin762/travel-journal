from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Profile
from django.contrib.auth import update_session_auth_hash


# -----------------------------
# REGISTER API (Public)
# -----------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register_api(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not email or not password:
        return Response(
            {"error": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response(
        {"message": "User registered successfully"},
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_detail_api(request):
    user = request.user
    profile = Profile.objects.get(user=user)

    return Response({
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "bio": profile.bio,
        "image": profile.image.url if profile.image else None,
    })

# -----------------------------
# EDIT PROFILE (Protected)
# -----------------------------
@api_view(['PUT','PATCH'])
@permission_classes([IsAuthenticated])
def edit_profile_api(request):
    user = request.user
    profile = Profile.objects.get(user=user)

    user.first_name = request.data.get("first_name", user.first_name)
    user.last_name = request.data.get("last_name", user.last_name)
    user.email = request.data.get("email", user.email)

    profile.bio = request.data.get("bio", profile.bio)

    if request.FILES.get("image"):
        profile.image = request.FILES.get("image")

    user.save()
    profile.save()

    return Response({"message": "Profile updated successfully"})


from django.contrib.auth import update_session_auth_hash

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):

    username = request.data.get("username")
    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    user = request.user

    # check username
    if user.username != username:
        return Response(
            {"error": "Username incorrect"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # check current password
    if not user.check_password(current_password):
        return Response(
            {"error": "Current password incorrect"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # check new passwords
    if new_password != confirm_password:
        return Response(
            {"error": "Passwords do not match"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()

    update_session_auth_hash(request, user)

    return Response({
        "message": "Password changed successfully"
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_account(request):

    username = request.data.get("username")
    password = request.data.get("password")

    user = request.user

    if user.username != username:
        return Response(
            {"error": "Username incorrect"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(password):
        return Response(
            {"error": "Password incorrect"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.delete()

    return Response({
        "message": "Account deleted successfully"
    })