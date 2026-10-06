# 📱 Social Media Mini App

[![API Docs](https://img.shields.io/badge/API%20Docs-Postman-orange?style=for-the-badge&logo=postman)](https://documenter.getpostman.com/view/34546371/2sBYHPygyn)

A full-stack social media web application. The platform enables users to register, create posts with image uploads, interact through comments and likes, manage their profile, and more — all within a clean, modern interface.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Social Media Mini App is a full-stack project with a **Node.js/Express REST API** backend and a **React (Vite)** frontend. It demonstrates real-world patterns including JWT-based authentication, OTP email verification, Cloudinary image uploads, and a modular feature-based architecture.

---

## Features

### 🔐 Authentication & Authorization
- User registration with **email verification via OTP**
- Secure login with **JWT tokens** (7-day expiry)
- Forgot password flow with **OTP-based password reset**
- Resend OTP support
- Protected routes on both frontend and backend

### 📝 Posts
- Create, read, update, and delete posts
- Upload up to **5 images per post** (stored on Cloudinary)
- Paginated feed of all posts
- View your own posts via a personal feed

### 💬 Comments
- Add comments to any post
- View all comments associated with a post
- Comment count tracked per post

### ❤️ Likes
- Like and unlike posts
- Like count tracked per post

### 👤 User Profiles
- View and update your profile
- Display name, username (auto-generated), bio, avatar, and gender
- Avatar uploads via Cloudinary

### 📧 Transactional Email
- OTP emails sent via **Resend** for verification and password reset
- Welcome emails on successful registration

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express 5** | HTTP server & routing |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM & schema management |
| **JSON Web Tokens (JWT)** | Stateless authentication |
| **bcryptjs** | Password & OTP hashing |
| **Cloudinary** | Image storage & CDN |
| **Multer** | Multipart file upload handling |
| **Resend** | Transactional email delivery |
| **Joi** | Request body validation |
| **dotenv** | Environment variable management |
| **CORS** | Cross-origin resource sharing |
| **Nodemon** | Development auto-restart |

### Frontend

| Technology | Purpose |
|---|---|
| **React 19** | UI component library |
| **Vite** | Build tool & dev server |
| **React Router v7** | Client-side routing |
| **Tailwind CSS v4** | Utility-first styling |
| **Zustand** | Lightweight global state management |
| **Axios** | HTTP client |
| **React Hook Form** | Form state management |
| **Zod** | Schema-based form validation |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |
| **Day.js** | Date formatting |

---

## Project Structure

```
social-media-miniapp/
├── backend/
│   ├── config/               # DB connection, OTP generator, username generator
│   ├── database/             # Database utilities
│   ├── middlewares/
│   │   ├── auth.middleware.js     # JWT authentication guard
│   │   ├── upload.middleware.js   # Multer + Cloudinary upload
│   │   └── validation.js         # Joi validation middleware
│   ├── modules/
│   │   ├── auth/             # Registration, login, OTP, password reset
│   │   ├── users/            # User profiles
│   │   ├── posts/            # Post CRUD + image upload
│   │   ├── comments/         # Post comments
│   │   └── likes/            # Post likes
│   ├── .env.example          # Required environment variable template
│   ├── index.js              # App entry point
│   └── package.json
│
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── api/              # Axios instance configuration
│   │   ├── components/       # Reusable UI components (Header, Feed, etc.)
│   │   ├── context/          # React context providers
│   │   ├── pages/            # Route-level page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── VerifyOTP.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Posts.jsx
│   │   │   ├── Post.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/         # API call abstractions
│   │   ├── utils/            # Helper utilities
│   │   ├── App.jsx           # Root component & router
│   │   └── main.jsx          # React entry point
│   ├── vercel.json           # Vercel SPA routing config
│   └── package.json
│
├── CONTRIBUTING.md           # Team workflow & Git conventions
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/) v9 or later
- A running [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account
- A [Resend](https://resend.com/) account and API key

---

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create your environment file:**

   ```bash
   cp .env.example .env
   ```

4. **Fill in the required environment variables** (see [Environment Variables](#environment-variables) below).

5. **Start the development server:**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`.

---

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create your environment file and set the API base URL:**

   ```bash
   # frontend/.env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the `backend/` directory based on the provided `.env.example`:

```env
# MongoDB connection string
MONGODB_URL=mongodb://localhost:27017/social-media-miniapp

# Resend — transactional email
RESEND_PUBLIC_KEY=your_resend_api_key

# Cloudinary — image storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# JWT
JWT_SECRET=your_jwt_secret_key
```

> **Never commit your `.env` file.** It is listed in `.gitignore` by default.

---

## API Overview

All endpoints are prefixed with `/api`. Protected routes require a valid JWT passed as a `Bearer` token in the `Authorization` header.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | Public | Register a new user |
| `POST` | `/login` | Public | Login with email & password |
| `POST` | `/verify-otp` | Public | Verify email with OTP |
| `POST` | `/resend-otp` | Public | Resend OTP to email |
| `POST` | `/reset-password` | Public | Reset password using OTP |
| `GET` | `/me` | 🔒 Protected | Get the authenticated user's profile |

### Posts — `/api/posts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | 🔒 Protected | Create a new post (supports up to 5 image uploads) |
| `GET` | `/` | 🔒 Protected | Get all posts (feed) |
| `GET` | `/me` | 🔒 Protected | Get the current user's posts |
| `GET` | `/:id` | 🔒 Protected | Get a single post by ID |
| `PATCH` | `/:id` | 🔒 Protected | Update a post |
| `DELETE` | `/:id` | 🔒 Protected | Delete a post |

### Comments — `/api/comments`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | 🔒 Protected | Add a comment to a post |
| `GET` | `/:postId` | 🔒 Protected | Get all comments for a post |
| `DELETE` | `/:id` | 🔒 Protected | Delete a comment |

### Likes — `/api/likes`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/:postId` | 🔒 Protected | Toggle like on a post |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/:id` | 🔒 Protected | Get a user profile by ID |
| `PATCH` | `/me` | 🔒 Protected | Update the authenticated user's profile |

### Standard API Response Format

**Success:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Post not found",
  "error": {
    "code": "POST_NOT_FOUND"
  }
}
```

---

## Contributing

This is a team project. Please read [CONTRIBUTING.md](./backend/CONTRIBUTING.md) before making any changes.

Key conventions:
- Work on **feature branches**, never push directly to `main`
- Use **conventional commit messages** (`feat:`, `fix:`, `docs:`, etc.)
- All changes must go through a **Pull Request** with at least one review
- Keep modules self-contained and avoid touching unrelated files
- Never commit secrets or `.env` files

---

## License

This project is licensed under the **ISC License**.
