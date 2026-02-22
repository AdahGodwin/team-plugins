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
PREREQUISITE_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'drf_spectacular',
    'whitenoise.runserver_nostatic', # Recommended for Whitenoise
]

INSTALLED_APPS = PREREQUISITE_APPS + CUSTOM_APPS
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
ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'
if RENDER:
    DEBUG = False
    ALLOWED_HOSTS = [os.environ.get('RENDER_EXTERNAL_HOSTNAME')]
else:
    DEBUG = True
    ALLOWED_HOSTS = []
