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

## 5. Events (Public)
No authentication required.

### 5.1 Get All Events
-   **Endpoint**: `GET http://localhost:5000/api/events`
-   **Query Params (Optional)**:
    -   `page`: `1`
    -   `limit`: `10`
    -   `title`: `workshop`
    -   `category`: `Workshop`

### 5.2 Get Single Event
-   **Endpoint**: `GET http://localhost:5000/api/events/:id`

## 6. Programs (Public)
No authentication required.

### 6.1 Get All Programs
-   **Endpoint**: `GET http://localhost:5000/api/programs`
-   **Query Params (Optional)**:
    -   `page`: `1`
    -   `limit`: `10`
    -   `title`: `bisnis`
    -   `career`: `manager`

### 6.2 Get Single Program
-   **Endpoint**: `GET http://localhost:5000/api/programs/:id`

## 7. Announcements (Admin Only)
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

### 7.3 Delete Announcement
-   **Endpoint**: `DELETE http://localhost:5000/api/announcements/admin/:id`
-   **Headers**:
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

## 8. Achievements (Admin Only)
Requires `Authorization: Bearer <TOKEN>` in the request headers.

### 8.1 Create Achievement
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

### 8.2 Update Achievement
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

### 8.3 Delete Achievement
-   **Endpoint**: `DELETE http://localhost:5000/api/achievements/admin/:id`
-   **Headers**:
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

## 9. Events (Admin Only)
Requires `Authorization: Bearer <TOKEN>` in the request headers.

### 9.1 Create Event
-   **Endpoint**: `POST http://localhost:5000/api/events/admin`
-   **Headers**:
    -   `Content-Type`: `application/json`
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`
-   **Body**:
    ```json
    {
        "title": "Workshop Digital Marketing Strategy",
        "description": "Pelatihan intensif tentang strategi pemasaran digital.",
        "date": "15 Maret 2026",
        "category": "Workshop",
        "image": "https://images.unsplash.com/photo-1552664730-d307ca884978"
    }
    ```

### 9.2 Update Event
-   **Endpoint**: `PUT http://localhost:5000/api/events/admin/:id`
-   **Headers**:
    -   `Content-Type`: `application/json`
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

### 9.3 Delete Event
-   **Endpoint**: `DELETE http://localhost:5000/api/events/admin/:id`
-   **Headers**:
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

## 10. Programs (Admin Only)
Requires `Authorization: Bearer <TOKEN>` in the request headers.

### 10.1 Create Program
-   **Endpoint**: `POST http://localhost:5000/api/programs/admin`
-   **Headers**:
    -   `Content-Type`: `application/json`
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`
-   **Body**:
    ```json
    {
        "id": "bisnis-digital-new",
        "title": "Bisnis Digital New",
        "description": "Program studi baru.",
        "highlights": ["Marketing", "Analytics"],
        "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        "link": "/hubungi",
        "curriculum": ["Fundamental", "SEO"],
        "careers": ["Manager", "Analyst"]
    }
    ```

### 10.2 Update Program
-   **Endpoint**: `PUT http://localhost:5000/api/programs/admin/:id`
-   **Headers**:
    -   `Content-Type`: `application/json`
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

### 10.3 Delete Program
-   **Endpoint**: `DELETE http://localhost:5000/api/programs/admin/:id`
-   **Headers**:
    -   `Authorization`: `Bearer <ADMIN_JWT_TOKEN>`

## 11. Error Responses

### 11.1 Unauthorized Access
-   Accessing admin endpoints without a token: `401 Unauthorized`
    ```json
    { "message": "Not authorized, no token" }
    ```

### 11.2 Invalid Credentials
-   Login with wrong email or password: `401 Unauthorized`
    ```json
    { "message": "Invalid credentials" }
    ```

### 11.3 Duplicate Admin
-   Registering with an existing email: `400 Bad Request`
    ```json
    { "message": "Admin with this email already exists" }
    ```
