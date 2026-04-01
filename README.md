# Booking App

A full-stack booking application.

## Folder Structure

- **`client/`**: The frontend portion of the application, built with React (Vite).
- **`server/`**: The backend API, built with Node.js, Express, and Prisma.

## Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd booking_app
```

### 2. Install Dependencies
You need to install dependencies for both the frontend and backend separately:

**Frontend (Client)**
```bash
cd client
npm install
```

**Backend (Server)**
```bash
cd ../server
npm install
```

## Making & Saving Changes (Version Control)

Always manage your Git version control (commits, pushes) from the **root directory** (`booking_app/`), **not** from inside the `client` or `server` folders.

When you make changes to either the frontend or backend, stage and commit them from the root:
```bash
# Make sure you are in the booking_app folder
git add .
git commit -m "Your commit message" 
git push
```
