# Polbis Admin Dashboard

A modern, clean, and minimalist Admin Dashboard for Polbis University built with React.js and Vite.

## Tech Stack

- **React.js + Vite**: Fast development and building.
- **Tailwind CSS**: Utility-first CSS for modern UI.
- **Zustand**: Lightweight state management for authentication.
- **Axios**: API service with interceptors for JWT.
- **React Hook Form + Zod**: Robust form handling and validation.
- **Lucide React**: Beautiful icons.
- **Framer Motion**: Smooth transitions and animations.
- **Browser Image Compression**: Client-side image optimization.

## Features

- [x] **Authentication**: Secure login with JWT stored in localStorage.
- [x] **Protected Routes**: Dashboard access only for authenticated admins.
- [x] **Modern UI**: SaaS-like design with dark mode support.
- [x] **CRUD Announcements**: Full implementation with search, filter, and pagination.
- [x] **Image Upload**: Reusable component with auto-compression.
- [x] **Responsive**: Fully optimized for mobile and desktop.

## Getting Started

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## API Configuration

The frontend is configured to proxy `/api` requests to `http://localhost:5000` (the backend server). You can change this in `vite.config.js`.

## Project Structure

```text
/src
  /components  # Reusable UI components
  /layouts     # Dashboard layout with sidebar/topbar
  /pages       # Page components (Login, Dashboard, etc.)
  /services    # API service and Axios instance
  /store       # Zustand state management
  /utils       # Utility functions (Image compression)
  /hooks       # Custom React hooks
```
