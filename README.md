# Job Portal Application

A modern, full-stack Job Portal built with **Django REST Framework** and **Angular**.

## Features

- **Authentication System**: Secure login and registration for Seekers and Employers using JWT.
- **Public Job Listings**: Browse available positions without needing an account.
- **Premium Landing Page**: A beautifully designed home page with hero, features, and CTA sections.
- **Job Applications**: Authenticated Seekers can apply for jobs with custom cover letters.
- **Role-based Access**: Custom permissions for employers and seekers.

## Tech Stack

- **Backend**: Python 3.12+, Django 6.0, Django REST Framework, PostgreSQL.
- **Frontend**: Angular 21, Tailwind CSS, Signals-based state management.
- **Security**: JWT Authentication, SSR-safe guards.

## Getting Started

### Backend Setup

1.  Navigate to the `backend/` directory.
2.  Create and activate a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure your `.env` file (see `settings.py` for required variables).
5.  Run migrations:
    ```bash
    python manage.py migrate
    ```
6.  Start the development server:
    ```bash
    python manage.py runserver
    ```

### Frontend Setup

1.  Navigate to the `frontend/` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Angular development server:
    ```bash
    npm start
    ```
4.  The application will be available at `http://localhost:4200`.

## Project Structure

- `backend/`: Django core, apps (`users`, `jobs`), and API configuration.
## Docker Setup

### Local Development (with Docker Compose)

1.  Ensure you have Docker and Docker Compose installed.
2.  Run the following command in the root directory:
    ```bash
    docker-compose up --build
    ```
3.  The database, backend, and frontend will start:
    -   Frontend: `http://localhost:4200`
    -   Backend: `http://localhost:8000/api/v1`
    -   Postgres: `localhost:5432`

### Production Deployment (with Docker Compose)

1.  Prepare your production `.env` file in `backend/`.
2.  Run the following command:
    ```bash
    docker-compose -f docker-compose.prod.yml up --build -d
    ```
3.  The frontend will be served at port `80`.
