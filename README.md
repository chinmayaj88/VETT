<div align="center">

```
██╗   ██╗███████╗████████╗████████╗
██║   ██║██╔════╝╚══██╔══╝╚══██╔══╝
██║   ██║█████╗     ██║      ██║   
╚██╗ ██╔╝██╔══╝     ██║      ██║   
 ╚████╔╝ ███████╗   ██║      ██║   
  ╚═══╝  ╚══════╝   ╚═╝      ╚═╝   
```

# 🎤 Voice-Enabled Task Tracker

### *Speak your tasks into existence* ✨

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)


---

</div>

## 🎯 What is Vett?

> **Vett** is a revolutionary task management application that transforms your voice into organized tasks. Simply speak naturally, and watch as AI intelligently extracts task details, priorities, due dates, and more - all automatically!

<div align="center">

### 🚀 **Get Started in Minutes**

[Quick Start](#-quick-start) • [Features](#-features) • [Documentation](#-api-documentation) • [How It Works](#-how-it-works)

---

</div>

## ✨ Features

<div align="center">

| 🎤 | 📋 | 🔍 | 🎨 | ⚡ | 🤖 |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **Voice Input** | **Kanban Board** | **Smart Filtering** | **Modern UI** | **Real-time Audio** | **AI-Powered** |
| Speak naturally to create tasks | Drag-and-drop task management | Search & filter by status/priority | Dark theme with responsive design | Visual feedback while recording | Google Gemini NLP parsing |

</div>

### 🎤 Voice Input
> **Speak naturally** - The AI extracts all details automatically from your voice commands

### 📋 Kanban Board  
> **Visual task management** - Drag-and-drop columns (To Do, In Progress, Done)

### 🔍 Smart Filtering
> **Find tasks instantly** - Search and filter by status, priority, or keywords

### 🎨 Modern UI
> **Beautiful design** - Dark theme with responsive design built using shadcn/ui

### ⚡ Real-time Audio Visualization
> **Visual feedback** - See your voice being captured in real-time

### 🤖 AI-Powered Parsing
> **Intelligent extraction** - Uses Google Gemini to understand natural language

---

## 🛠️ Tech Stack

### 🔧 Backend

<div align="center">

```
┌─────────────────────────────────────────────────────────┐
│  Node.js v22  │  Express v5  │  TypeScript  │  Prisma  │
│  PostgreSQL   │  Deepgram    │  Gemini AI   │   Zod    │
└─────────────────────────────────────────────────────────┘
```

</div>

| 🟢 Technology | 📝 Purpose |
|:---:|:---|
| **Node.js v22** | Runtime environment |
| **Express v5** | Web framework |
| **TypeScript** | Type-safe development |
| **PostgreSQL** | Relational database |
| **Prisma ORM** | Database toolkit |
| **Deepgram API** | Speech-to-text conversion |
| **Google Gemini API** | Natural language processing |
| **Zod** | Schema validation |

### 🎨 Frontend

<div align="center">

```
┌─────────────────────────────────────────────────────────┐
│  React 19  │  TypeScript  │  Vite  │  Tailwind CSS v4  │
│  shadcn/ui │  Axios       │  DnD Kit                   │
└─────────────────────────────────────────────────────────┘
```

</div>

| 🟦 Technology | 📝 Purpose |
|:---:|:---|
| **React 19** | UI framework |
| **TypeScript** | Type-safe development |
| **Vite** | Build tool & dev server |
| **shadcn/ui** | Component library |
| **Tailwind CSS v4** | Utility-first styling |
| **Axios** | HTTP client |
| **react-datepicker** | Date selection component |

---

## 🚀 Quick Start

### 📋 Prerequisites

<div align="center">

**Before you begin, make sure you have:**

</div>

| Requirement | Description | Link |
|:---:|:---|:---|
| 🐳 **Docker** | Docker & Docker Compose (recommended) | [Get Docker](https://www.docker.com/) |
| 📦 **Node.js** | Node.js v20+ (for manual setup) | [Download](https://nodejs.org/) |
| 🗄️ **PostgreSQL** | PostgreSQL database (for manual setup) | [Download](https://www.postgresql.org/) |
| 🔑 **Deepgram API** | Speech-to-text API key | [Get Free Key](https://console.deepgram.com) |
| 🔑 **Gemini API** | Google Gemini API key | [Get Free Key](https://ai.google.dev) |

---

### 🐳 Docker Setup (Recommended)

<div align="center">

#### ⚡ **One-Command Setup - Fastest way to get started**

</div>

#### 📝 Step 1: Create Environment File

Create a `.env` file in the **root directory** of the project:

<details>
<summary><b>📋 Click to expand .env template</b></summary>

```env
# 🗄️ Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=vett
POSTGRES_PORT=5432

# 🔑 API Keys (Required)
DEEPGRAM_API_KEY=your_deepgram_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# ⚙️ Server Configuration
NODE_ENV=production
BACKEND_PORT=3000
FRONTEND_PORT=5173

# 🌐 Frontend Configuration
VITE_API_URL=http://localhost:3000/api
```

</details>

#### 🚀 Step 2: Run One Command

**For Linux/Mac:**
```bash
./setup.sh
```

**For Windows (PowerShell):**
```powershell
.\setup.ps1
```

**Or manually with Docker Compose:**
```bash
docker compose up --build
```

<div align="center">

✅ **That's it!** The setup script will:
- ✅ Check Docker installation
- ✅ Create `.env` file if needed
- ✅ Build and start all containers (Frontend, Backend, Database)
- ✅ Run database migrations automatically (or push schema if no migrations exist)
- ✅ Start all services

</div>

#### 🎉 Step 3: Access Your Application

<div align="center">

| Service | URL | Description |
|:---:|:---|:---|
| 🌐 **Frontend** | http://localhost:5173 | Main application |
| 🔧 **Backend API** | http://localhost:3000 | REST API |
| 🗄️ **Adminer** | http://localhost:8080 | Database admin tool |

🎉 **You're all set!** Open your browser and start creating tasks with your voice!

</div>

#### 📝 Useful Docker Commands

```bash
# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f backend
docker compose logs -f frontend

# Stop all services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v

# Rebuild and restart
docker compose up --build -d
```

---

## 📖 Manual Setup

### 🔧 Backend Setup

<details>
<summary><b>🔽 Click to expand backend setup instructions</b></summary>

#### 1️⃣ Install Dependencies

```bash
cd backend
npm install
```

#### 2️⃣ Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/vett
DEEPGRAM_API_KEY=your_deepgram_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
NODE_ENV=development
```

#### 3️⃣ Set Up Database

```bash
npm run prisma:generate
npm run prisma:migrate
```

#### 4️⃣ Start Development Server

```bash
npm run dev
```

</details>

### 🎨 Frontend Setup

<details>
<summary><b>🔽 Click to expand frontend setup instructions</b></summary>

#### 1️⃣ Install Dependencies

```bash
cd frontend
npm install
```

#### 2️⃣ Configure Environment Variables (Optional)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

#### 3️⃣ Start Development Server

```bash
npm run dev
```

</details>

---

## 🔌 API Documentation

### 📋 Tasks Endpoints

<div align="center">

| Method | Endpoint | Description | Query Params |
|:---:|:---|:---|:---|
| `GET` | `/api/tasks` | Get all tasks | `search`, `status`, `priority` |
| `GET` | `/api/tasks/:id` | Get task by ID | - |
| `POST` | `/api/tasks` | Create a new task | - |
| `PUT` | `/api/tasks/:id` | Update a task | - |
| `DELETE` | `/api/tasks/:id` | Delete a task | - |

</div>

### 🎤 Voice Endpoints

<div align="center">

| Method | Endpoint | Description |
|:---:|:---|:---|
| `POST` | `/api/voice/parse` | Parse text transcript into structured task data |
| `POST` | `/api/voice/transcribe` | Transcribe audio file and parse into task data |

</div>

### ❤️ Health Check

<div align="center">

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/health` | Health check endpoint |

</div>

---

## 📁 Project Structure

```
vett/
│
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 domain/          # Domain entities and interfaces
│   │   │   ├── 📂 entities/    # Business entities
│   │   │   └── 📂 interfaces/  # Domain interfaces
│   │   ├── 📂 use-cases/       # Business logic
│   │   │   ├── 📂 tasks/       # Task-related use cases
│   │   │   └── 📂 voice/       # Voice processing use cases
│   │   ├── 📂 infrastructure/  # External services
│   │   │   ├── 📂 config/      # Configuration
│   │   │   ├── 📂 container/   # Dependency injection
│   │   │   ├── 📂 database/    # Database repositories
│   │   │   └── 📂 services/    # External API services
│   │   └── 📂 presentation/    # API layer
│   │       ├── 📂 controllers/ # Request handlers
│   │       ├── 📂 dto/         # Data transfer objects
│   │       ├── 📂 middleware/  # Express middleware
│   │       └── 📂 routes/      # API routes
│   ├── 📂 prisma/              # Database schema and migrations
│   ├── 🐳 docker-compose.yml   # Docker configuration
│   └── 🐳 Dockerfile           # Backend container definition
│
└── 📂 frontend/
    ├── 📂 src/
    │   ├── 📂 components/      # React components
    │   │   ├── 📂 ui/          # Reusable UI components
    │   │   └── ...             # Feature components
    │   ├── 📂 hooks/
    │   │   ├── 📂 api/         # API calling hooks
    │   │   └── 📂 app/         # Business logic hooks
    │   ├── 📂 lib/             # Utilities
    │   │   ├── 📄 axios.ts     # HTTP client configuration
    │   │   └── 📄 utils.ts     # Helper functions
    │   ├── 📂 types/           # TypeScript type definitions
    │   └── 📄 main.tsx         # Application entry point
    └── 📂 public/              # Static assets
```

---

## 💻 Development

### 🔧 Backend Commands

<div align="center">

| Command | Description |
|:---:|:---|
| `npm run dev` | 🚀 Start development server with hot reload |
| `npm run build` | 📦 Build for production |
| `npm start` | ▶️ Start production server |
| `npm run prisma:studio` | 🗄️ Open Prisma Studio (database GUI) |
| `npm run prisma:migrate` | 🔄 Create a new migration |
| `npm run prisma:generate` | ⚙️ Generate Prisma client |

</div>

### 🎨 Frontend Commands

<div align="center">

| Command | Description |
|:---:|:---|
| `npm run dev` | 🚀 Start development server |
| `npm run build` | 📦 Build for production |
| `npm run preview` | 👀 Preview production build |
| `npm run lint` | ✅ Run ESLint |

</div>

---

## 🎯 How It Works

<div align="center">

### 🔄 **Process Flow**

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ User Speaks │ --> │ Audio Capture│ --> │ Deepgram API│
└─────────────┘     └──────────────┘     └─────────────┘
                                                
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│Text Transcript│ -->│Google Gemini │ --> │Structured   │
└─────────────┘     └──────────────┘     │   Data      │
                                        └─────────────┘
                                                
┌─────────────┐     ┌──────────────┐
│Preview Modal│ --> │Save to DB    │
└─────────────┘     └──────────────┘
```

</div>

### 📝 Step-by-Step Process

#### 1. 🎤 **Voice Recording**
   - User clicks the microphone button and speaks their task
   - Audio is captured using the browser's MediaRecorder API

#### 2. 📡 **Audio Processing**
   - Audio file is sent to the backend server
   - Deepgram API converts speech to text transcript

#### 3. 🤖 **AI Parsing**
   - Google Gemini analyzes the transcript and extracts:
     - ✅ Task title
     - ✅ Description
     - ✅ Priority (LOW, MEDIUM, HIGH, URGENT)
     - ✅ Status (TODO, IN_PROGRESS, DONE)
     - ✅ Due date (parsed from natural language)

#### 4. 👀 **Preview & Confirmation**
   - Parsed data is displayed in a preview modal
   - User can review and edit before saving

#### 5. 💾 **Task Creation**
   - Confirmed task data is saved to PostgreSQL database
   - Task appears in the Kanban board

---

## 💡 Example Voice Inputs

<div align="center">

### 🗣️ **Try speaking these natural language commands:**

</div>

| 🎤 Voice Input | 📋 Expected Result |
|:---|:---|
| `"Create a high priority task to review the pull request by tomorrow evening"` | ✅ Task with **HIGH** priority, due tomorrow evening |
| `"Add a task to fix the login bug, it's urgent and should be in progress"` | ✅ Task with **URGENT** priority, status **IN_PROGRESS** |
| `"Remind me to call John on December 25th, make it medium priority"` | ✅ Task with **MEDIUM** priority, due date **December 25th** |
| `"I need to finish the documentation by Friday"` | ✅ Task with default priority, due **Friday** |

<div align="center">

💡 **Tip:** The AI understands natural language, so feel free to speak naturally!

</div>

---

<div align="center">

[⬆ Back to Top](#-vett---voice-enabled-task-tracker)

</div>
