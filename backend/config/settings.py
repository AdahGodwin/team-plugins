import dj_database_url
import os
from pathlib import Path

# Use Path for modern Django 6.0 standards
BASE_DIR = Path(__file__).resolve().parent.parent

# --- SECURITY ---
# Fetch from environment, fallback to a dummy key only for local dev
SECRET_KEY = os.environ.get('SECRET_KEY', 'local-dev-key-123')

# Debug should be False in production
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# Allow Render domain and local hosts
ALLOWED_HOSTS = ['*'] if DEBUG else ['.onrender.com', '127.0.0.1', 'localhost']

# --- DATABASE CONFIG ---
# This logic switches between SQLite (local) and Postgres (Render) automatically
DATABASES = {
    'default': dj_database_url.config(
        default=f'sqlite:///{BASE_DIR / "db.sqlite3"}',
        conn_max_age=600,
        ssl_require=not DEBUG  # Force SSL on Render, disable for local SQLite
    )
}

# --- STATIC FILES (WhiteNoise) ---
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
# Using the updated WhiteNoise storage for Django 5.0+
STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# --- API KEYS ---
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

RENDER = os.environ.get('RENDER') 

if RENDER:
    DEBUG = False
    ALLOWED_HOSTS = [os.environ.get('RENDER_EXTERNAL_HOSTNAME')]
else:
    DEBUG = True
    ALLOWED_HOSTS = []



INSTALLED_APPS = [
    # Django contrib apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third‑party
    'drf_spectacular',

    # Local apps
    'apps.patients',
    'apps.medical',
]
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Internationalisation
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


