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

## 4. Achievements (Public)
No authentication required.

### 4.1 Get All Achievements
-   **Endpoint**: `GET http://localhost:5000/api/achievements`
-   **Query Params (Optional)**:
    -   `page`: `1`
    -   `limit`: `10`
    -   `title`: `juara` (Search by title)
    -   `award`: `emas` (Filter by award)

### 4.2 Get Single Achievement
-   **Endpoint**: `GET http://localhost:5000/api/achievements/:id`

## 5. Announcements (Admin Only)
Requires `Authorization: Bearer <TOKEN>` in the request headers.

### 5.1 Create Announcement
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

### 5.2 Update Announcement
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

### 5.3 Delete Announcement
-   **Endpoint**: `DELETE http://localhost:5000/api/announcements/admin/:id`
-   **Headers**:
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

## 6. Achievements (Admin Only)
Requires `Authorization: Bearer <TOKEN>` in the request headers.

### 6.1 Create Achievement
-   **Endpoint**: `POST http://localhost:5000/api/achievements/admin`
-   **Headers**:
    -   `Content-Type`: `application/json`
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`
-   **Body**:
    ```json
    {
        "title": "Juara 1 Kompetisi Startup Nasional",
        "description": "Tim mahasiswa Bisnis Digital meraih juara pertama dalam kompetisi startup tingkat nasional.",
        "image": "https://images.unsplash.com/photo-1552664730-d307ca884978",
        "award": "Juara 1 Nasional",
        "date": "2026-03-01"
    }
    ```

### 6.2 Update Achievement
-   **Endpoint**: `PUT http://localhost:5000/api/achievements/admin/:id`
-   **Headers**:
    -   `Content-Type`: `application/json`
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`
-   **Body**:
    ```json
    {
        "title": "Updated Achievement Title",
        "award": "Medali Perak"
    }
    ```

### 6.3 Delete Achievement
-   **Endpoint**: `DELETE http://localhost:5000/api/achievements/admin/:id`
-   **Headers**:
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

## 7. Error Responses

### 7.1 Unauthorized Access
-   Accessing admin endpoints without a token: `401 Unauthorized`
    ```json
    { "message": "Not authorized, no token" }
    ```

### 7.2 Invalid Credentials
-   Login with wrong email or password: `401 Unauthorized`
    ```json
    { "message": "Invalid credentials" }
    ```

### 7.3 Duplicate Admin
-   Registering with an existing email: `400 Bad Request`
    ```json
    { "message": "Admin with this email already exists" }
    ```
