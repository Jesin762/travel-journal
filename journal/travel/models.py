from django.db import models
from django.contrib.auth.models import User


class Journal(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="journals"  # user.journals will give all journals by that user
    )
    title = models.CharField(max_length=200)
    blog = models.TextField()
    image = models.ImageField(upload_to="travel_photos/", blank=True, null=True)
    location = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.user.username}"


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="liked_journals")
    journal = models.ForeignKey(
        Journal,
        on_delete=models.CASCADE,
        related_name="likes"
    )

    class Meta:
        unique_together = ('user', 'journal')
        ordering = ['-id']  # optional: newest likes first

    def __str__(self):
        return f"{self.user.username} liked '{self.journal.title}'"


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    journal = models.ForeignKey(
        Journal,
        on_delete=models.CASCADE,
        related_name="comments"
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']  # optional: oldest comments first

    def __str__(self):
        return f"{self.user.username} commented on '{self.journal.title}'"
