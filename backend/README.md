# PaySlip Pro - Backend

A professional backend API for the PaySlip Pro application built with Express.js, MongoDB, and modern authentication systems.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Routes](#api-routes)
- [Dependencies Overview](#dependencies-overview)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

- ✅ **Google OAuth 2.0** - Secure authentication with Google
- ✅ **Email/Password Authentication** - Local authentication with bcrypt hashing
- ✅ **JWT Tokens** - Token-based authorization
- ✅ **MongoDB Integration** - NoSQL database with Mongoose ODM
- ✅ **File Upload** - Cloudinary integration for image/file storage
- ✅ **User Profiles** - Complete user management system
- ✅ **Payslip Management** - Create, read, update payslip records
- ✅ **Templates** - Reusable payslip templates
- ✅ **Schedules** - Automated payslip scheduling
- ✅ **CORS Enabled** - Cross-origin request support
- ✅ **Session Management** - Express session handling
- ✅ **Middleware Security** - Authentication and authorization middleware

---

## 🛠 Tech Stack

| Technology      | Version | Purpose                   |
| --------------- | ------- | ------------------------- |
| **Node.js**     | 14+     | JavaScript runtime        |
| **Express.js**  | ^4.18.2 | Web framework             |
| **MongoDB**     | Latest  | NoSQL database            |
| **Mongoose**    | ^7.5.0  | MongoDB ODM               |
| **Passport.js** | ^0.7.0  | Authentication middleware |
| **JWT**         | ^9.0.0  | Token-based auth          |
| **bcryptjs**    | ^2.4.3  | Password hashing          |
| **Cloudinary**  | ^1.41.3 | Cloud storage             |
| **Multer**      | ^2.1.1  | File upload handling      |
| **CORS**        | ^2.8.5  | Cross-origin support      |
| **dotenv**      | ^16.0.3 | Environment variables     |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB Atlas Account** - [Create Account](https://www.mongodb.com/cloud/atlas)
- **Google OAuth Credentials** - [Get Credentials](https://console.cloud.google.com/)
- **Cloudinary Account** - [Sign Up](https://cloudinary.com/)

### Verify Installation:

```bash
node --version
npm --version
```

---

## 📥 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/dhirendrasaithwar/payslip-pro.git
cd payslip-pro/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages from `package.json`:

**Core Dependencies:**

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT tokens
- `passport` & `passport-google-oauth20` - Authentication
- `bcryptjs` - Password hashing
- `cloudinary` & `multer-storage-cloudinary` - File uploads
- `cors` - CORS support
- `express-session` - Session management
- `dotenv` - Environment variables
- `googleapis` - Google API integration

**Development Dependencies:**

- `nodemon` - Auto-restart during development

---

## 🔐 Environment Setup

### Step 1: Create `.env` File

Create a `.env` file in the backend root directory:

```bash
touch .env
```

### Step 2: Add Environment Variables

Copy and update the following template:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.tf2gjuw.mongodb.net/?appName=Cluster0

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google API Configuration (for Google Sheets integration)
GOOGLE_SERVICE_ACCOUNT_KEY=your_google_service_account_json

# Frontend URL
CLIENT_URL=http://localhost:5173

# Callback URLs
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### Step 3: Get Your Credentials

#### **MongoDB Atlas**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Go to "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `username`, `password` with your database credentials
6. Add database name: `Payslip_Pro`

#### **Google OAuth**

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Go to "Credentials" → Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:3000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

#### **Cloudinary**

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret to `.env`

---

## 💾 Database Setup

### MongoDB Collections

The backend automatically creates these collections:

1. **users** - User accounts and profiles
2. **payslips** - Payslip records
3. **templates** - Payslip templates
4. **schedules** - Scheduled payslip generation

### Initial Data Setup

Connect to MongoDB and run the schema initialization:

```bash
# The backend will auto-create schemas on first connection
npm run dev
```

### MongoDB Connection Troubleshooting

If you face connection issues:

1. **Check MongoDB Atlas Whitelist**
   - Go to Network Access
   - Add your IP address or `0.0.0.0/0` for development

2. **Verify Connection String**

   ```
   mongodb+srv://username:password@cluster0.mongodb.net/Payslip_Pro?retryWrites=true&w=majority
   ```

3. **Test Connection**
   ```bash
   npm run dev
   # Look for: "MongoDB connected !! DB HOST: cluster0.mongodb.net"
   ```

---

## 🚀 Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

The server will start on `http://localhost:5000`

**Output:**

```
Server running on port 5000
MongoDB connected !! DB HOST: cluster0.mongodb.net
```

### Production Mode

```bash
npm start
```

---

## 🔗 API Routes

### Authentication Routes (`/api/auth`)

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| POST   | `/signup`          | Register new user         |
| POST   | `/login`           | Login with email/password |
| GET    | `/google`          | Google OAuth login        |
| GET    | `/google/callback` | Google OAuth callback     |
| POST   | `/logout`          | Logout user               |
| GET    | `/profile`         | Get user profile          |
| PUT    | `/profile`         | Update user profile       |

### Payslip Routes (`/api/payslips`)

| Method | Endpoint  | Description        |
| ------ | --------- | ------------------ |
| POST   | `/create` | Create new payslip |
| GET    | `/`       | Get all payslips   |
| GET    | `/:id`    | Get single payslip |
| PUT    | `/:id`    | Update payslip     |
| DELETE | `/:id`    | Delete payslip     |

### Template Routes (`/api/templates`)

| Method | Endpoint  | Description         |
| ------ | --------- | ------------------- |
| POST   | `/create` | Create template     |
| GET    | `/`       | Get all templates   |
| GET    | `/:id`    | Get single template |
| PUT    | `/:id`    | Update template     |
| DELETE | `/:id`    | Delete template     |

### Schedule Routes (`/api/schedules`)

| Method | Endpoint  | Description         |
| ------ | --------- | ------------------- |
| POST   | `/create` | Create schedule     |
| GET    | `/`       | Get all schedules   |
| GET    | `/:id`    | Get single schedule |
| PUT    | `/:id`    | Update schedule     |
| DELETE | `/:id`    | Delete schedule     |

---

## 📚 Dependencies Overview

### Authentication & Security

```
passport@^0.7.0
├── passport-google-oauth20@^2.0.0 (Google OAuth strategy)
jsonwebtoken@^9.0.0 (JWT token generation)
bcryptjs@^2.4.3 (Password hashing)
express-session@^1.19.0 (Session management)
```

### Database

```
mongoose@^7.5.0 (MongoDB ODM)
dns@^0.2.2 (DNS resolution)
```

### File Management

```
multer@^2.1.1 (File upload middleware)
multer-storage-cloudinary@^4.0.0 (Cloudinary storage)
cloudinary@^1.41.3 (Cloud storage API)
```

### Server & Utilities

```
express@^4.18.2 (Web framework)
cors@^2.8.5 (CORS support)
dotenv@^16.0.3 (Environment variables)
googleapis@^171.4.0 (Google APIs)
```

### Development

```
nodemon@^3.0.1 (Auto-restart during development)
```

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── index.js               # Server entry point
│   ├── constant.js            # Application constants
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   ├── passport.js        # Passport configuration
│   │   └── cloudinary.js      # Cloudinary configuration
│   ├── controller/
│   │   └── auth.controller.js # Auth logic
│   ├── middleware/
│   │   ├── auth.middleware.js # Authentication middleware
│   │   ├── requireAuth.js     # Auth verification
│   │   └── upload.js          # File upload middleware
│   ├── model/
│   │   ├── user.model.js      # User schema
│   │   ├── payslip.model.js   # Payslip schema
│   │   ├── template.model.js  # Template schema
│   │   └── schedule.model.js  # Schedule schema
│   └── route/
│       ├── auth.route.js      # Auth routes
│       ├── payslips.route.js  # Payslip routes
│       ├── templates.route.js # Template routes
│       └── sehedules.route.js # Schedule routes
├── package.json               # Dependencies
├── .env                       # Environment variables (create this)
└── README.md                  # This file
```

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**

- Ensure MongoDB Atlas connection string is correct
- Check MongoDB Atlas whitelist for your IP
- Verify credentials in `.env`

### Issue: Google OAuth Not Working

**Error:** `invalid_client: The OAuth client was not found`

**Solution:**

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Check callback URL in Google Cloud Console matches `GOOGLE_CALLBACK_URL`
- Ensure Google+ API is enabled

### Issue: Cloudinary Upload Fails

**Error:** `Error: Invalid credentials provided`

**Solution:**

- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Check Cloudinary dashboard for correct credentials
- Ensure API key is not expired

### Issue: Port Already in Use

**Error:** `listen EADDRINUSE: address already in use :::5000`

**Solution:**

```bash
# Change PORT in .env or
PORT=5001 npm run dev
```

### Issue: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**

```bash
npm install
```

---

## 📝 Additional Commands

```bash
# Install specific package
npm install package-name

# Remove package
npm uninstall package-name

# Update packages
npm update

# Check for security vulnerabilities
npm audit

# Fix security vulnerabilities
npm audit fix
```

---

## 🔐 Security Notes

1. **Never commit `.env`** - Add to `.gitignore`
2. **Use strong JWT_SECRET** - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. **Enable HTTPS** in production
4. **Use environment-specific configs**
5. **Implement rate limiting** for API endpoints
6. **Regularly update dependencies** - `npm audit`

---

## 📞 Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review `.env` configuration
3. Check MongoDB Atlas connection
4. Review Google OAuth setup
5. Check Cloudinary credentials

---

## 📄 License

This project is licensed under the ISC License.

---

**Last Updated:** May 2024  
**Version:** 1.0.0  
**Author:** Arun Chaudhary / Dhirendra Saithwar
