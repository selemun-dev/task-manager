# Task Manager — Full-Stack CRUD

A full-stack task management application built with **Express.js** (backend) and **React + Vite** (frontend), containerized with Docker.

---

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── app.js                   # Express entry point
│   │   ├── routes/task.routes.js    # Route definitions
│   │   ├── controllers/task.controller.js
│   │   ├── services/task.service.js
│   │   ├── repositories/task.repository.js  # In-memory store
│   │   ├── dto/task.dto.js          # Validation & response shaping
│   │   └── middleware/errorHandler.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/tasks.js             # Axios API client
│   │   ├── hooks/useTasks.js        # Data-fetching hook
│   │   ├── components/              # TaskCard, TaskForm, Modal, etc.
│   │   ├── App.jsx                  # Root component
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ and **npm** 9+
- **Docker** (for the backend container)

---

## Running the Backend

### Option A — Docker (recommended)

```bash
cd backend
docker build -t task-manager-api .
docker run -p 8080:8080 task-manager-api
```

API will be available at: `http://localhost:8080/api/tasks`

### Option B — Node directly

```bash
cd backend
npm install
npm start
```

---

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

> Make sure the backend is running on port 8080 before starting the frontend.
> To use a different API address, copy `frontend/.env.example` to `frontend/.env` and edit `VITE_API_URL`.

### Quick API check

```bash
curl -i http://localhost:8080/api/tasks
curl -i -X POST http://localhost:8080/api/tasks -H "Content-Type: application/json" \
  -d '{"title":"Prepare report","description":"Draft weekly report","status":"TODO"}'
```

> Data is stored in memory and resets whenever the server/container restarts.

---

## API Reference

| Method | Endpoint           | Description                   | Status Codes          |
|--------|--------------------|-------------------------------|-----------------------|
| GET    | /api/tasks         | Return all tasks              | 200                   |
| GET    | /api/tasks/:id     | Return a single task          | 200, 404              |
| POST   | /api/tasks         | Create a new task             | 201, 400              |
| PUT    | /api/tasks/:id     | Update an existing task       | 200, 400, 404         |
| DELETE | /api/tasks/:id     | Delete a task                 | 204, 404              |
| GET    | /health            | Health check                  | 200                   |

### Task Schema

```json
{
  "id": "uuid",
  "title": "string (3–100 chars, required)",
  "description": "string (max 500 chars, optional)",
  "status": "TODO | IN_PROGRESS | DONE (default: TODO)",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

### Error Response

```json
{ "status": 400, "message": "title must be at least 3 characters" }
```

---

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Backend   | Node.js + Express 4.22  |
| Frontend  | React 18 + Vite 6       |
| HTTP      | Axios                   |
| Storage   | In-memory (Map)         |
| Container | Docker (node:20-alpine) |

---

## Features

- ✅ Full CRUD for tasks (Create, Read, Update, Delete)  
- ✅ Status filtering (All / To Do / In Progress / Done)  
- ✅ Stats bar with live counts  
- ✅ Form validation with inline error messages  
- ✅ Delete confirmation dialog  
- ✅ Toast notifications for every action  
- ✅ Loading and error states  
- ✅ Responsive layout  
- ✅ Accessible (ARIA roles, keyboard navigation)  
- ✅ Clean separation: routes → controllers → services → repository  
