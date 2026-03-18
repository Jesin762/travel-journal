from django.contrib import admin
from .models import Journal, Like, Comment

admin.site.register(Journal)
admin.site.register(Like)
admin.site.register(Comment)
