#!/usr/bin/env bash
set -o errexit

# Install dependencies via your compiled requirements.txt
pip install -r requirements.txt

# Gather CSS/JS for WhiteNoise to serve
python manage.py collectstatic --no-input

# Apply migrations to the Render Postgres DB
python manage.py migrate