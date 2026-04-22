# Postman Instructions for Polbis Backend (Admin Only)

This guide provides instructions on how to test the Polbis Backend API, focusing on Admin Authentication and Announcement management.

## 1. Setup

### 1.1 Start the Backend Server
1.  **Install Dependencies**: `npm install`
2.  **Configure Environment**: Create a `.env` file with `JWT_SECRET` and `JWT_EXPIRE`.
3.  **Start Server**: `npm run dev`

## 2. Admin Authentication

### 2.1 Register Admin
-   **Endpoint**: `POST http://localhost:5000/api/admin/register`
-   **Headers**: `Content-Type: application/json`
-   **Body**:
    ```json
    {
        "name": "Admin User",
        "email": "admin@example.com",
        "password": "password123"
    }
    ```
-   **Expected Response**: `201 Created` with a JWT token.
    ```json
    {
        "message": "Admin registered successfully",
        "data": {
            "_id": "...",
            "name": "Admin User",
            "email": "admin@example.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
    }
    ```

### 2.2 Login Admin
-   **Endpoint**: `POST http://localhost:5000/api/admin/login`
-   **Headers**: `Content-Type: application/json`
-   **Body**:
    ```json
    {
        "email": "admin@example.com",
        "password": "password123"
    }
    ```
-   **Expected Response**: `200 OK` with a JWT token.
    ```json
    {
        "message": "Admin logged in successfully",
        "data": {
            "_id": "...",
            "name": "Admin User",
            "email": "admin@example.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
    }
    ```

### 2.3 Logout Admin
-   **Endpoint**: `POST http://localhost:5000/api/admin/logout`
-   **Expected Response**: `200 OK` with a message.
    ```json
    { "message": "Logged out successfully. Please clear your token on the client side." }
    ```

## 3. Announcements (Public)
No authentication required.

### 3.1 Get All Announcements
-   **Endpoint**: `GET http://localhost:5000/api/announcements`
-   **Query Params (Optional)**:
    -   `page`: `1` (default)
    -   `limit`: `10` (default)
    -   `priority`: `high`, `normal`, `low`

### 3.2 Get Single Announcement
-   **Endpoint**: `GET http://localhost:5000/api/announcements/:id`

## 4. Announcements (Admin Only)
These endpoints require `Authorization: Bearer <TOKEN>` in the request headers.

### 4.1 Create Announcement
-   **Endpoint**: `POST http://localhost:5000/api/announcements/admin`
-   **Headers**:
    -   `Content-Type`: `application/json`
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`
-   **Body**:
    ```json
    {
        "title": "New Announcement",
        "content": "Announcement content here",
        "date": "2026-04-25",
        "priority": "high"
    }
    ```

### 4.2 Update Announcement
-   **Endpoint**: `PUT http://localhost:5000/api/announcements/admin/:id`
-   **Headers**:
    -   `Content-Type`: `application/json`
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`
-   **Body**:
    ```json
    {
        "title": "Updated Announcement Title",
        "priority": "normal"
    }
    ```

### 4.3 Delete Announcement
-   **Endpoint**: `DELETE http://localhost:5000/api/announcements/admin/:id`
-   **Headers**:
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

## 5. Error Responses

### 5.1 Unauthorized Access
-   Accessing admin endpoints without a token: `401 Unauthorized`
    ```json
    { "message": "Not authorized, no token" }
    ```

### 5.2 Invalid Credentials
-   Login with wrong email or password: `401 Unauthorized`
    ```json
    { "message": "Invalid credentials" }
    ```

### 5.3 Duplicate Admin
-   Registering with an existing email: `400 Bad Request`
    ```json
    { "message": "Admin with this email already exists" }
    ```
