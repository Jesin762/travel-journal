from django import forms
from .models import Profile

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ["image", "bio"]
        widgets = {
            "bio": forms.Textarea(attrs={
                "rows": 4,
                "class": "form-control",
                "placeholder": "Tell something about yourself..."
            }),
        }
