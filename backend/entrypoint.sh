#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Wait for database to be ready
echo "Waiting for database..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.1
done
echo "Database started"

# Run migrations and collect static files
echo "Running migrations..."
python manage.py migrate
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Gunicorn with increased header limits
echo "Starting Gunicorn..."
exec gunicorn --bind 0.0.0.0:8000 \
              --limit-request-line 8190 \
              --limit-request-field_size 16380 \
              jobportal.wsgi:application
