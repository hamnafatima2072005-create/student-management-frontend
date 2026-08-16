
# Student Management System

A full-stack Student Management System built with React and integrated with a FastAPI REST API.

## 🚀 Features

- User Login with JWT Authentication
- Secure Bearer Token Authentication
- View Students
- Add Students
- Update Students
- Delete Students
- React frontend connected with FastAPI backend
- REST API integration
- PostgreSQL database integration
- CORS configuration

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- Fetch API

### Backend
- FastAPI
- Python
- SQLAlchemy
- JWT Authentication
- PostgreSQL

## 🔄 CRUD Operations

| Operation | HTTP Method | Endpoint |
|-----------|-------------|----------|
| Create Student | POST | `/students` |
| Get Students | GET | `/students` |
| Update Student | PUT | `/students/{id}` |
| Delete Student | DELETE | `/students/{id}` |
| Login | POST | `/auth/login` |

## 🔐 Authentication

The application uses JWT (JSON Web Token) authentication.

After login, the backend returns an access token. The React frontend stores the token and sends it with protected API requests using the Bearer authentication scheme.

```text
Login
   ↓
JWT Token
   ↓
React Frontend
   ↓
Authorization: Bearer TOKEN
   ↓
FastAPI
   ↓
Database
