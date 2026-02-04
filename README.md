# The Beauty Stats API

A secure API REST for managing beauty salons: user registration, authentification, profile management and monthly revenue tracking.

Built with **Express.js**, **PostgreSQL**, **Knex**, **JWT** and **Docker**.
Email sending is simulated via **Mailtrap**.

---

## Features

- User registration with password validation and welcome email (`/register`)
- Login with JWT (`/login`)
- JWT authentification middleware
- Salon profile view and edit (`GET`& `PATCH /profile`)
- Server-side validation of sensitive fields
- Revenue history retrieval (`GET /revenue`)
- Monthly revenue entry for the previous month only (`POST /revenue`)
- Automatic CRON job to send monthly email reminders to user without revenue entry
- Market statistics (France, region, department) automatically updates
- Seed script to generate fake users and revenue entries

---

## Tech Stack

- **Backend** : Node.js, Express.js
- **Database** : PostgreSQL (via Docker)
- **ORM** : Knex.js
- **Authentification** : JWT
- **Email service** : Mailtrap
- **Testing** : Thunder Client
- **Dev tools** : dotenv, nodemon

---

## Project Setup

1. Clone the repository and install dependencies

```bash
git clone https://github.com/AnonFr/api-startup.git
cd api-startup
npm install
cp .env.example .env
```

2. Launch the PostgreSQL database with Docker

```bash
docker-compose up -d
```

3. Start the dev server

```bash
npm run dev
```

4. Run migrations

```bash
npx knex migrate:latest
```

---

## Authentification

All protected routes require a valid JWT token in the Authorization header:
Authorization: Bearer <your-token>

---

## Usage Examples

# Register a new user (POST /api/register)

`POST /api/register`

Content-type: application/json

{
"email": "jeanne@salon.fr",
"password": "Test123!",
"salon_name": "Salon Jeanne",
"salon_address": "12 Rue des Coiffeurs",
"opening_date": "2020-01-01",
"full_time_employees_count": 4,
"manager_first_name": "Jeanne",
"manager_last_name": "Martin"
}

Response:
{
"message": "Utilisateur enregistré avec succès. Un email de confirmation vous a été envoyé."
}

# Login (POST /api/login)

`POST /api/login`
Content-Type: application/json

{
"email": "jeanne@salon.fr",
"password": "Test123!"
}

Response:
{
"token": "eyJhbGciOiJIUzI1NiIsInR..."
}

# View Profile (GET /api/profile)

Header:
Authorization: Bearer <token>

Response:

{
"profile": {
"id": 1,
"email": "jeanne@salon.fr",
"salon_name": "Salon Jeanne",
"salon_address": "12 Rue des Coiffeurs",
"opening_date": "2020-01-01",
"full_time_employees_count": 4,
"manager_first_name": "Jeanne",
"manager_last_name": "Martin"
}
}

# Edit Profile (PATCH /api/profile)

Header:
Authorization: Bearer <token>

`PATCH /api/profile`
Content-type: application/json

{
"salon_name": "Salon Jeanne Beauté",
"salon_address": "15 Rue des Coiffeurs",
"opening_date": "2020-01-01",
"full_time_employees_count": 5,
"manager_first_name": "Jeanne",
"manager_last_name": "M."
}

Response:
{
"message": "Profil modifié avec succès."
}

# Get revenue history (GET /revenue)

`GET /revenue`
Authorization: Bearer <token>

Response:
[
{ "year": 2025, "month": 12, "amount": "10500.00" },
{ "year": 2025, "month": 11, "amount": "9800.00" }
]

# Submit monthly revenue (POST /revenue)

`POST /revenue`
Authorization: Bearer <token>
Content-type: application/json
{
"amount": 12450.75
}

Response:
{
"message": "Revenus enregistrés avec succès."
}

Revenue is always recorded for the previous calendar month.
Duplicate entries are blocked.

---

## CRON Reminder System

A CRON task runs every day at 0 AM from the 5th to the 31st of each month.

- It checks which users have not submitted their revenue for the previous month
- It sends a personalized reminder email via Mailtrap
- The month is displayed in full (janvier 2025, février 2026, etc.)

---

## Market Statistics

Each time a revenue is submitted, the system recalculated:

- France-wide average
- Region average (from user's department)
- Department average

The statistics are only updated if there are at least 2 users in the given scope.

---

## Fake Data Generator

To simulate a real-world use case, run:

```bash
node seeds/seed/fake-users.js
```

This will:

- Create 3 users per department (for those in the scipt)
- Each user has 1 to 3 revenue entries
- Password is always "Test1234!"

## Project Structure

/api-startup
├── app.js
├── .env
├── docker-compose.yml
├── knexfile.js
├── /controllers
│ ├── authController.js
│ ├── profileController.js
│ └── revenueController.js
├── /middlewares
│ └── authMiddleware.js
├── /routes
│ ├── auth.js
│ └── protected.js
├── /utils
│ ├── passwordValidator.js
│ ├── profileValidator.js
│ ├── mailer.js
│ └── statisticsService.js
├── /cron
│ └── sendRevenueReminder.js
├── /db
│ └── connection.js
├── /migrations
│ ├── create_users_table.js
│ ├── create_revenus_table.js
│ ├── create_departments_table.js
│ ├── create_regions_table.js
│ └── create_statistics_table.js
├── /seeds
│ ├── seed-fake-users.js
│ └── seed-regions-departments.js
