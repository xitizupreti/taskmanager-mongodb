# Task Management API

A full-stack task management application with a RESTful API backend built with Node.js, Express, and MongoDB, and a React/Next.js frontend.

## Features

### Backend

- **User Authentication**: Register, login, and logout functionality with JWT
- **Task Management**: Create, read, update, and delete tasks
- **Advanced Filtering**: Filter tasks by status, search by title/description
- **Pagination**: Limit results and navigate through pages
- **Sorting**: Sort tasks by various fields (createdAt, title)
- **Data Validation**: Input validation using Joi
- **Security**: Protected routes with authentication middleware

### Frontend

- **Responsive UI**: Modern interface built with React and Tailwind CSS
- **Authentication**: Login/register forms with validation
- **Task Dashboard**: View, create, edit, and delete tasks
- **Task Filtering**: Search, filter by status, and sort tasks
- **Pagination**: Navigate through pages of tasks
- **Status Management**: Easily update task status

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Joi for validation
- Cookie-parser for handling cookies

### Frontend

- React
- Next.js
- Tailwind CSS
- Axios for API requests
- Lucide React for icons

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. Clone the repository

   ```bash
   git clone https://github.com/xitizupreti/taskmanager-mongodb.git
   cd taskmanager-mongodb/server
   ```

2. Install dependencies
   npm install

3. Create a `.env` file in the server directory with the following variables:
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development

4. Start the server
   npm start

### Frontend Setup

1. Navigate to the client directory
   cd ../client

2. Install dependencies
   npm install

3. Create a `.env` file in the client directory with the following variable:
   NEXT_PUBLIC_API_URL=http://localhost:5000

4. Start the development server
   npm run dev

5. Open your browser and navigate to `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### Register a new user

- **URL**: `/register`
- **Method**: `POST`
- **Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **Response**:

```json
{
  "msg": "User created"
}
```

#### Login

- **URL**: `/login`
- **Method**: `POST`
- **Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **Response**:

```json
{
  "msg": "Logged in",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

#### Logout

- **URL**: `/logout`
- **Method**: `POST`
- **Response**:

```json
{
  "msg": "Logged out"
}
```

#### Check Authentication

- **URL**: `/check-auth`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer token`
- **Response**:

```json
{
  "authenticated": true
}
```

### Task Endpoints

#### Get all tasks

- **URL**: `/tasks`
- **Method**: `GET`
- **Query Parameters**:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Field to sort by (format: field:order, e.g., createdAt:desc)
- `status`: Filter by status (pending, in-progress, completed)
- `search`: Search in title and description

- **Headers**: `Authorization: Bearer token`
- **Response**:

```json
{
  "tasks": [
    {
      "id": "task_id",
      "title": "Task title",
      "description": "Task description",
      "status": "pending",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 20,
    "page": 1,
    "limit": 10,
    "pages": 2
  }
}
```

#### Get a specific task

- **URL**: `/tasks/:id`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer token`
- **Response**:

```json
{
  "id": "task_id",
  "title": "Task title",
  "description": "Task description",
  "status": "pending",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### Create a task

- **URL**: `/tasks`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer token`
- **Body**:

```json
{
  "title": "Task title",
  "description": "Task description"
}
```

- **Response**:

```json
{
  "id": "task_id",
  "title": "Task title",
  "description": "Task description",
  "status": "pending",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### Update a task

- **URL**: `/tasks/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer token`
- **Body**:

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in-progress"
}
```

- **Response**:

```json
{
  "id": "task_id",
  "title": "Updated title",
  "description": "Updated description",
  "status": "in-progress",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### Update task status

- **URL**: `/tasks/:id/status`
- **Method**: `PATCH`
- **Headers**: `Authorization: Bearer token`
- **Body**:

```json
{
  "status": "completed"
}
```

- **Response**:

```json
{
  "id": "task_id",
  "title": "Task title",
  "description": "Task description",
  "status": "completed",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### Delete a task

- **URL**: `/tasks/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer token`
- **Response**:

```json
{
  "success": true
}
```

## Usage

1. Register a new account or login with existing credentials
2. Create new tasks using the form at the top of the dashboard
3. View your tasks in the list below
4. Click on a task's status icon to cycle through statuses
5. Use the edit button to modify task details
6. Use the delete button to remove tasks
7. Use the filter panel to search, sort, and filter tasks
8. Navigate through pages using the pagination controls
