from pathlib import Path
import os
from datetime import timedelta


BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-REPLACE-THIS-IN-PRODUCTION'

DEBUG = False

ALLOWED_HOSTS = ['*']

# ----------------------------
# INSTALLED APPS
# ----------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party
    'corsheaders',
    'rest_framework',

    # Your apps
    'credentials.apps.CredentialsConfig',
    'travel',
]


# ----------------------------
# MIDDLEWARE
# ----------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # MUST be at top
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'journal.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'journal.wsgi.application'



# ----------------------------
# DATABASE (MySQL)
# ----------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ----------------------------
# PASSWORD VALIDATION
# ----------------------------
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# ----------------------------
# INTERNATIONALIZATION
# ----------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# ----------------------------
# STATIC FILES
# ----------------------------
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / "static"
]

# ----------------------------
# MEDIA FILES
# ----------------------------
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, "media")


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ======================================================
# 🔥 REACT + DJANGO SESSION AUTH CONFIGURATION
# ======================================================

# Allow React frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://travel-journal-zeta-ten.vercel.app",
]

# Allow cookies to be sent
CORS_ALLOW_CREDENTIALS = True

# Trust React for CSRF
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "https://travel-journal-zeta-ten.vercel.app",
]

# Allow JS to read CSRF token
CSRF_COOKIE_HTTPONLY = False


# ----------------------------
# DJANGO REST FRAMEWORK + JWT
# ----------------------------

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
} 

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "AUTH_HEADER_TYPES": ("Bearer",),
}
