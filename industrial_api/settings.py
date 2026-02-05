import os
import dj_database_url
from pathlib import Path
from dotenv import load_dotenv

# 1. BASE DIRECTORY & ENV LOADING
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, '.env'))

# 2. SECURITY SETTINGS
# On Render, set DEBUG to False in Environment Variables. Defaulting to False for safety.
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-default-key-change-this')
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Allow local testing and any subdomain on Render
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '.onrender.com'] 

# 3. APPLICATION DEFINITION
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Required for the new backend architecture
    'rest_framework',
    'corsheaders',
    'analytics',
]

# 4. MIDDLEWARE
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Priority 1
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # REQUIRED FOR RENDER STATIC FILES
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'industrial_api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'industrial_api.wsgi.application'

# 5. DATABASE CONFIGURATION (Neon PostgreSQL)
DATABASE_URL = os.getenv('DATABASE_URL')

DATABASES = {
    'default': dj_database_url.config(
        default=DATABASE_URL,
        conn_max_age=600,
    )
}

# Force SSL for Neon/PostgreSQL production
if not DEBUG:
    DATABASES['default'].setdefault('OPTIONS', {})
    DATABASES['default']['OPTIONS']['sslmode'] = 'require'

# 6. PASSWORD VALIDATORS
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# 7. INTERNATIONALIZATION
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# 8. STATIC & MEDIA FILES
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Efficient storage for production (compresses files)
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# 9. CORS & SECURITY SETTINGS
CORS_ALLOW_ALL_ORIGINS = True # Set to False and use CORS_ALLOWED_ORIGINS for higher security later
CORS_ALLOW_CREDENTIALS = True 

# CSRF Settings for React-Django communication
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://*.onrender.com" # Allows your deployed frontend to talk to backend
]

CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_HTTPONLY = False 

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ]
}