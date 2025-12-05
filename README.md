# SDE Assignment - Voice-Enabled Task Tracker

A full-stack task management application that transforms voice input into organized tasks using AI-powered natural language processing.

---

## 1. Project Setup

### a. Prerequisites

| Requirement | Version/Details | Link |
|:---:|:---|:---|
| **Node.js** | v20+ (v22 recommended) | [Download](https://nodejs.org/) |
| **Docker** | Docker Desktop with Docker Compose | [Get Docker](https://www.docker.com/) |
| **PostgreSQL** | v14+ (included in Docker setup) | [Download](https://www.postgresql.org/) |
| **Deepgram API Key** | Free tier available | [Get Free Key](https://console.deepgram.com) |
| **Google Gemini API Key** | Free tier available | [Get Free Key](https://ai.google.dev) |

### b. Install Steps

#### Option 1: Docker Setup (Recommended - One Command)

**For Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**For Windows (PowerShell):**
```powershell
.\setup.ps1
```

If you get an execution policy error on Windows:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# OR
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

**Or manually:**
```bash
docker compose up --build
```

The setup script will:
- Check Docker installation
- Create `.env` file from template if missing
- Prompt for API keys
- Build and start all containers (Frontend, Backend, Database, Adminer)
- Run database migrations automatically

#### Option 2: Manual Setup

**Backend:**
```bash
cd backend
npm install
cp .env.example .env  # Edit with your API keys
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env  # Optional: Set VITE_API_URL
npm run dev
```

### c. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=vett
POSTGRES_PORT=5432

# API Keys (Required)
DEEPGRAM_API_KEY=your_deepgram_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
NODE_ENV=production
BACKEND_PORT=3000
FRONTEND_PORT=5173

# Frontend Configuration
VITE_API_URL=http://localhost:3000/api
```

### d. How to Run Everything Locally

**Using Docker (Recommended):**
```bash
docker compose up --build
```

Access the application:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Adminer (DB Admin)**: http://localhost:8080

**Manual Setup:**
1. Start PostgreSQL database
2. Run backend: `cd backend && npm run dev`
3. Run frontend: `cd frontend && npm run dev`

### e. Seed Data / Initial Scripts

No seed data is required. The database schema is automatically created via Prisma migrations when using Docker setup.

**Useful Docker Commands:**
```bash
# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild after code changes
docker compose up --build -d

# Check service status
docker compose ps
```

---

## 2. Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool & dev server
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Component library
- **@dnd-kit** - Drag-and-drop functionality
- **Axios** - HTTP client
- **react-datepicker** - Date selection component

### Backend
- **Node.js v22** - Runtime environment
- **Express v5** - Web framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database
- **Prisma ORM** - Database toolkit & migrations
- **Zod** - Schema validation

### AI Provider
- **Deepgram API** - Speech-to-text conversion
- **Google Gemini API** - Natural language processing for task parsing

### Key Libraries
- **@deepgram/sdk** - Deepgram integration
- **@google/genai** - Google Gemini integration
- **@prisma/client** - Database client
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing

---

## 3. API Documentation

### Base URL
```
http://localhost:3000/api
```

### Tasks Endpoints

#### GET `/api/tasks`
Get all tasks with optional filtering.

**Query Parameters:**
- `search` (string, optional): Search tasks by title/description
- `status` (enum, optional): Filter by status (`TODO`, `IN_PROGRESS`, `DONE`)
- `priority` (enum, optional): Filter by priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
- `dueDateFrom` (ISO string, optional): Filter tasks with due date from
- `dueDateTo` (ISO string, optional): Filter tasks with due date to

**Example Request:**
```bash
GET /api/tasks?status=TODO&priority=HIGH
```

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "Review pull request",
    "description": "Review the authentication PR",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2024-12-25T18:00:00.000Z",
    "createdAt": "2024-12-20T10:00:00.000Z",
    "updatedAt": "2024-12-20T10:00:00.000Z"
  }
]
```

**Error Response (400):**
```json
{
  "error": "Invalid status filter. Must be one of: TODO, IN_PROGRESS, DONE"
}
```

---

#### GET `/api/tasks/:id`
Get a task by ID.

**Path Parameters:**
- `id` (string, required): Task UUID

**Example Request:**
```bash
GET /api/tasks/c24b8ce2-743e-4a17-8e20-0339f0db048e
```

**Success Response (200):**
```json
{
  "id": "c24b8ce2-743e-4a17-8e20-0339f0db048e",
  "title": "Review pull request",
  "description": "Review the authentication PR",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2024-12-25T18:00:00.000Z",
  "createdAt": "2024-12-20T10:00:00.000Z",
  "updatedAt": "2024-12-20T10:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Task not found"
}
```

---

#### POST `/api/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "Review pull request",
  "description": "Review the authentication PR",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2024-12-25T18:00:00.000Z"
}
```

**Field Constraints:**
- `title` (string, required): 1-500 characters
- `description` (string, optional): Max 5000 characters
- `status` (enum, optional): `TODO`, `IN_PROGRESS`, `DONE`
- `priority` (enum, optional): `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- `dueDate` (ISO string, optional): Must be today or future date

**Example Request:**
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Fix login bug",
  "description": "The login form is not validating email correctly",
  "status": "IN_PROGRESS",
  "priority": "URGENT",
  "dueDate": "2024-12-22T23:59:59.000Z"
}
```

**Success Response (201):**
```json
{
  "id": "c24b8ce2-743e-4a17-8e20-0339f0db048e",
  "title": "Fix login bug",
  "description": "The login form is not validating email correctly",
  "status": "IN_PROGRESS",
  "priority": "URGENT",
  "dueDate": "2024-12-22T23:59:59.000Z",
  "createdAt": "2024-12-20T10:00:00.000Z",
  "updatedAt": "2024-12-20T10:00:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Cannot select past date. Please select today or a future date."
}
```

---

#### PUT `/api/tasks/:id`
Update an existing task.

**Path Parameters:**
- `id` (string, required): Task UUID

**Request Body:**
```json
{
  "title": "Updated task title",
  "status": "DONE",
  "priority": "MEDIUM"
}
```

All fields are optional. At least one field must be provided.

**Example Request:**
```bash
PUT /api/tasks/c24b8ce2-743e-4a17-8e20-0339f0db048e
Content-Type: application/json

{
  "status": "DONE"
}
```

**Success Response (200):**
```json
{
  "id": "c24b8ce2-743e-4a17-8e20-0339f0db048e",
  "title": "Fix login bug",
  "description": "The login form is not validating email correctly",
  "status": "DONE",
  "priority": "URGENT",
  "dueDate": "2024-12-22T23:59:59.000Z",
  "createdAt": "2024-12-20T10:00:00.000Z",
  "updatedAt": "2024-12-20T10:30:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "At least one field must be provided for update"
}
```

---

#### DELETE `/api/tasks/:id`
Delete a task.

**Path Parameters:**
- `id` (string, required): Task UUID

**Example Request:**
```bash
DELETE /api/tasks/c24b8ce2-743e-4a17-8e20-0339f0db048e
```

**Success Response (204):**
No content

**Error Response (404):**
```json
{
  "error": "Task not found"
}
```

---

### Voice Endpoints

#### POST `/api/voice/parse`
Parse a text transcript into structured task data using Google Gemini.

**Request Body:**
```json
{
  "transcript": "Create a high priority task to review the pull request by tomorrow evening"
}
```

**Field Constraints:**
- `transcript` (string, required): 1-10000 characters

**Example Request:**
```bash
POST /api/voice/parse
Content-Type: application/json

{
  "transcript": "Add a task to fix the login bug, it's urgent and should be in progress"
}
```

**Success Response (200):**
```json
{
  "transcript": "Add a task to fix the login bug, it's urgent and should be in progress",
  "parsed": {
    "title": "Fix the login bug",
    "description": null,
    "status": "IN_PROGRESS",
    "priority": "URGENT",
    "dueDate": null
  }
}
```

**Success Response with Warning (200):**
```json
{
  "transcript": "Remind me to call John yesterday",
  "parsed": {
    "title": "Call John",
    "description": null,
    "status": null,
    "priority": null,
    "dueDate": null
  },
  "warning": "Cannot select past date. Date has been removed."
}
```

**Error Response (400):**
```json
{
  "error": "Transcript is required"
}
```

---

#### POST `/api/voice/transcribe`
Transcribe an audio file and parse it into structured task data.

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `audio`
- File types: `audio/webm`, `audio/mp4`, `audio/mpeg`, `audio/wav`, `audio/ogg`, `audio/x-m4a`, `audio/mp3`
- Max file size: 10MB

**Example Request:**
```bash
POST /api/voice/transcribe
Content-Type: multipart/form-data

[audio file as binary]
```

**Success Response (200):**
```json
{
  "transcript": "Create a high priority task to review the pull request by tomorrow evening",
  "parsed": {
    "title": "Review the pull request",
    "description": null,
    "status": null,
    "priority": "HIGH",
    "dueDate": "2024-12-21T18:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Audio file is required"
}
```

**Error Response (413):**
```json
{
  "error": "Audio file is too large. Maximum size is 10MB"
}
```

---

### Health Check

#### GET `/health`
Check API health status.

**Example Request:**
```bash
GET /health
```

**Success Response (200):**
```json
{
  "status": "ok"
}
```

---

## 4. Decisions & Assumptions

### Key Design Decisions

#### Architecture
- **Clean Architecture**: Separated into domain, use-cases, infrastructure, and presentation layers for maintainability and testability
- **Dependency Injection**: Used a container pattern for managing dependencies
- **Repository Pattern**: Abstracted database access through repository interfaces

#### Database
- **PostgreSQL**: Chosen for reliability and robust date/time handling
- **Prisma ORM**: Used for type-safe database access and migrations
- **UUID Primary Keys**: Used UUIDs instead of auto-incrementing IDs for better distributed system support

#### API Design
- **RESTful API**: Standard REST endpoints with clear resource naming
- **Zod Validation**: Schema validation at the API layer for type safety
- **Error Handling**: Consistent error response format across all endpoints
- **CORS Configuration**: Explicitly configured to allow frontend origin

#### Voice Processing
- **Deepgram for STT**: Chosen for high accuracy and real-time transcription
- **Google Gemini for NLP**: Used for natural language understanding and task extraction
- **Two-Step Process**: Separate transcription and parsing endpoints for flexibility
- **Past Date Validation**: Automatically removes past dates from voice input with user warning

#### Frontend
- **React 19**: Latest React version for performance
- **Vite**: Fast build tool and HMR for development
- **Drag-and-Drop**: Implemented using @dnd-kit for task status updates
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Date Picker**: Prevents past date selection on frontend and backend

#### Docker Setup
- **One-Command Setup**: Docker Compose for easy deployment
- **Volume Mounts**: Hot-reload support for development
- **Automatic Migrations**: Database migrations run automatically on container startup

### Assumptions

#### Limitations
- **Date Handling**: Dates are compared in local timezone (date-only, ignoring time) to prevent timezone issues
- **File Size**: Audio files limited to 10MB for performance
- **Transcript Length**: Text transcripts limited to 10,000 characters
- **Task Title**: Maximum 500 characters
- **Task Description**: Maximum 5,000 characters

#### API Keys
- Users are expected to provide their own Deepgram and Gemini API keys
- API keys are stored in environment variables, not in code

#### Browser Support
- Modern browsers with MediaRecorder API support required for voice input
- Chrome, Firefox, Edge, Safari (latest versions)

#### Date Formats
- All dates accepted in ISO 8601 format
- Dates are validated to prevent past date selection
- Time component is ignored for date-only comparisons

---

## 5. AI Tools Usage

### Which AI Tools You Used

**ChatGPT/OpenAI**: Used for repetitive tasks, debugging, and code refactoring.

### What They Helped With

#### Code Refactoring
- Refactored date comparison logic into a centralized utility function
- Improved form reset logic in task creation modal
- Consolidated validation logic across controllers
- Optimized React component structure

#### Debugging
- Fixed React Hooks violations (usePriorityLabel hook called conditionally)
- Resolved CORS policy issues
- Fixed Deepgram API stream reuse errors
- Debugged date comparison logic for timezone-related issues

#### Repetitive Tasks
- Generated TypeScript type definitions and interfaces
- Created validation schemas
- Set up boilerplate for API endpoints

---

## Project Structure

```
vett/
│
├── docker-compose.yml      # Root Docker Compose (all services)
├── .env.example            # Environment variables template
├── setup.sh                # Linux/Mac setup script
├── setup.ps1               # Windows PowerShell setup script
├── README.md               # This file
│
├── backend/
│   ├── src/
│   │   ├── domain/          # Domain entities and interfaces
│   │   ├── use-cases/       # Business logic
│   │   ├── infrastructure/  # External services
│   │   └── presentation/    # API layer
│   ├── prisma/              # Database schema and migrations
│   └── Dockerfile           # Backend container definition
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── hooks/           # Custom React hooks
    │   ├── lib/             # Utilities
    │   └── types/           # TypeScript type definitions
    └── Dockerfile           # Frontend container definition
```

---

## Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run prisma:studio  # Open Prisma Studio
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```
