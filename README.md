# Task Management API 🚀

This API allows users to manage their tasks efficiently. Users can create, update, fetch, and delete tasks with ease. The API is built using Node.js, Express, and MongoDB.

## Table of Contents 📑

- [Project Description](#project-description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Postman Collection](#postman-collection)
- [Contributing](#contributing)
- [License](#license)

## Project Description 📋

The Task Management API is a RESTful API that allows users to manage their tasks. Each user can perform CRUD (Create, Read, Update, Delete) operations on their tasks. The API is secured using JWT (JSON Web Tokens) for authentication.

## Features ✨

- User authentication (register and login)
- Create, update, fetch, and delete tasks
- Secure endpoints with JWT authentication
- Input validation using express-validator
- Error handling middleware

## Installation 🛠️

### Prerequisites

- Node.js and npm installed on your machine
- MongoDB instance running locally or on a cloud service

### Steps

1. **Clone the repository**:

   ```sh
   git clone https://github.com/aaronowusu/Task-Mangement-API.git
   cd Task-Mangement-API
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Create a `.env` file** in the root directory based on the `.env.example` file provided:

   ```sh
   cp .env.example .env
   ```

4. **Update the `.env` file** with your environment variables:

   ```plaintext
   # .env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

5. **Start the server**:

   ```sh
   nodemon app.js or npm start
   ```

   The server should now be running on `http://localhost:3000`.

## Usage 📚

### Register a User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123"
}
```

### Login a User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

### Create a Task

```http
POST /task
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
"title": "Complete project",
"description": "Finish the task management project by the end of the month.",
"dueDate": "2024-12-31T00:00:00.000Z"
}
```

### Get all Tasks

```http

markdown
Copy code
## Create a Task

POST /task
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
"title": "Complete project",
"description": "Finish the task management project by the end of the month.",
"status": "inProgress",
"dueDate": "2024-12-31T00:00:00.000Z"
}
```

### Fetch User's Tasks

```http
GET /task
Authorization: Bearer <your_jwt_token>
```

### Update a Task

```http
PATCH /task/:id
Content-Type: application/json
Authorization : Bearer <your_jwt_token>

{
"title": "Complete project",
"description": "Finish the task management project by the end of the month.",
"status": "Completed",
}
```

### Delete a Task

```http
DELETE /task/:id
Authorization: Bearer <your_jwt_token>
```

## Environment Variables 🌍

Make sure to configure the following environment variables in your `.env` file:

- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your secret key for JWT authentication
- `PORT`: The port on which the server will run (default is 3000)

## API Endpoints 🔗

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login a user and get a JWT token
- `POST /task`: Create a new task
- `GET /task`: Fetch all tasks for the authenticated user
- `PATCH /task/:id`: Update a task
- `DELETE /task/:id`: Delete a task

## Postman Collection 📬

A Postman collection is available to help you test the API endpoints. You can import the collection into Postman and use it to quickly test the API.

## Swagger Documentation 📖

The API documentation is available in Swagger format. You can access the documentation by running the server and visiting `http://localhost:3000/api-docs`.
