from django import forms
from .models import journal

class JournalForm(forms.ModelForm):
    class Meta:
        model = journal
        fields = ["title", "location", "blog", "image"]
