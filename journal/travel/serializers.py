from rest_framework import serializers
from .models import Journal, Comment


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "username", "text", "created_at"]


class JournalSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    user_image = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = Journal
        fields = [
            "id",
            "title",
            "blog",
            "image",      # ✅ normal image field
            "location",
            "created_at",
            "username",
            "user_image",
            "likes",
            "comments",
            "is_following",
        ]

    def get_user_image(self, obj):
        try:
            if obj.user.profile.image:
                return obj.user.profile.image.url
            return None
        except:
            return None    

    def get_likes(self, obj):
        return obj.likes.count()

    def get_is_following(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return request.user.profile in obj.user.profile.followers.all()
        return False