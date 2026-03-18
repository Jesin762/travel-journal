from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Journal, Like, Comment
from .serializers import JournalSerializer, CommentSerializer


# =====================================================
# JOURNALS (GET PUBLIC + POST AUTHENTICATED)
# =====================================================
@api_view(['GET', 'POST'])
def journals(request):

    # ---------- GET ALL JOURNALS ----------
    if request.method == 'GET':
        journals = Journal.objects.all().order_by('-created_at')[:6]

        serializer = JournalSerializer(
            journals,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

    # ---------- CREATE JOURNAL ----------
    if request.method == 'POST':

        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = JournalSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =====================================================
# TOGGLE LIKE
# =====================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, journal_id):

    journal = get_object_or_404(Journal, id=journal_id)

    like, created = Like.objects.get_or_create(
        user=request.user,
        journal=journal
    )

    if not created:
        like.delete()

    return Response({
        "likes": journal.likes.count()
    })


# =====================================================
# ADD COMMENT
# =====================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request, journal_id):

    journal = get_object_or_404(Journal, id=journal_id)
    text = request.data.get("text")

    if not text:
        return Response(
            {"error": "Comment text required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    comment = Comment.objects.create(
        user=request.user,
        journal=journal,
        text=text
    )

    serializer = CommentSerializer(comment)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# =====================================================
# DELETE COMMENT
# =====================================================
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comment(request, comment_id):

    comment = get_object_or_404(Comment, id=comment_id)

    if comment.user != request.user:
        return Response(
            {"error": "Not allowed"},
            status=status.HTTP_403_FORBIDDEN
        )

    comment.delete()
    return Response(
        {"message": "Deleted"},
        status=status.HTTP_204_NO_CONTENT
    )


# =====================================================
# GET LOGGED-IN USER PROFILE
# URL: /api/profile/
# =====================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):

    user = request.user
    profile = user.profile
    journals = Journal.objects.filter(user=user)

    serializer = JournalSerializer(
        journals,
        many=True,
        context={'request': request}
    )

    return Response({
        "username": user.username,
        "bio": profile.bio,
        "image": profile.image.url if profile.image else None,

        "journal_count": journals.count(),
        "journals": serializer.data,

        "followers_count": profile.followers.count(),
        "following_count": profile.following.count(),

        "followers": [
            p.user.username for p in profile.followers.all()
        ],
        "following": [
            p.user.username for p in profile.following.all()
        ],
    })


# =====================================================
# TOGGLE FOLLOW
# URL: /api/follow/<username>/
# =====================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_follow(request, username):

    if request.user.username == username:
        return Response(
            {"error": "You cannot follow yourself"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user_to_follow = get_object_or_404(User, username=username)

    target_profile = user_to_follow.profile
    current_profile = request.user.profile

    if current_profile in target_profile.followers.all():
        target_profile.followers.remove(current_profile)
        return Response({
            "message": "Unfollowed",
            "followers_count": target_profile.followers.count()
        })

    target_profile.followers.add(current_profile)
    return Response({
        "message": "Followed",
        "followers_count": target_profile.followers.count()
    })

@api_view(['GET'])
def get_user_profile(request, username):

    user = get_object_or_404(User, username=username)
    profile = user.profile
    journals = Journal.objects.filter(user=user)
    serializer = JournalSerializer(
        journals,
        many=True,
        context={'request': request}
    )

    is_following = False
    if request.user.is_authenticated:
        is_following = request.user.profile in profile.followers.all()

    return Response({
        "username": user.username,
        "bio": profile.bio if profile.bio else None,
        "image": profile.image.url if profile.image else None,

        "journal_count": journals.count(),
        "journals": serializer.data,

        "followers_count": profile.followers.count(),
        "following_count": profile.following.count(),

        # ✅ ADD THESE TWO LINES
        "followers": [
            p.user.username for p in profile.followers.all()
        ],
        "following": [
            p.user.username for p in profile.following.all()
        ],

        "is_following": is_following
    })

# =====================================================
# DELETE JOURNAL
# URL: /api/journals/<id>/delete/
# =====================================================
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_journal(request, journal_id):

    journal = get_object_or_404(Journal, id=journal_id)

    # Only owner can delete
    if journal.user != request.user:
        return Response(
            {"error": "You are not allowed to delete this journal"},
            status=status.HTTP_403_FORBIDDEN
        )

    journal.delete()

    return Response(
        {"message": "Journal deleted successfully"},
        status=status.HTTP_204_NO_CONTENT
    )    

# =====================================================
# UPDATE JOURNAL
# URL: /api/journals/<id>/update/
# =====================================================
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_journal(request, journal_id):

    journal = get_object_or_404(Journal, id=journal_id)

    # Only owner can edit
    if journal.user != request.user:
        return Response(
            {"error": "Not allowed"},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = JournalSerializer(
        journal,
        data=request.data,
        partial=True,  # allows updating only some fields
        context={'request': request}
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# =====================================================
# GET FOLLOWERS & FOLLOWING LIST
# URL: /api/profile/<username>/connections/
# =====================================================
@api_view(['GET'])
def get_user_connections(request, username):

    user = get_object_or_404(User, username=username)
    profile = user.profile

    return Response({
        "username": user.username,

        "followers": [
            {
                "username": p.user.username,
                "bio": p.bio if p.bio else "",
                "image": p.image.url if p.image else None
            }
            for p in profile.followers.all()
        ],

        "following": [
            {
                "username": p.user.username,
                "bio": p.bio if p.bio else "",
                "image": p.image.url if p.image else None
            }
            for p in profile.following.all()
        ],
    })