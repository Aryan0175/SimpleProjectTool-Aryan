# SimpleProjectTool - MERN Stack Task Management App

A full-stack, enterprise-grade Task Management application built using the MERN stack (MongoDB, Express.js, React, Node.js). This project features a clean API architecture, secure JWT authentication, and an interactive Native HTML5 Drag-and-Drop Kanban board.

## ✨ Key Features
* **Secure Authentication:** JWT-based login and registration with encrypted passwords (bcryptjs).
* **Project Management:** Create, view, and delete projects. User data is strictly isolated.
* **Kanban Task Board:** Native HTML5 Drag & Drop interface to move tasks between 'To Do', 'In Progress', and 'Done' columns.
* **Optimistic UI Updates:** Instant visual feedback during drag-and-drop before the server responds.
* **Clean Architecture:** Strict separation of concerns (Models, Controllers, Routes, Services).
* **Reusable UI Components:** Custom-built Buttons, Inputs, and Loaders utilizing Tailwind CSS.
* **Responsive Design:** Fully responsive layout with a global Header/Footer wrapper.

## 🛠️ Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS, React Router DOM, Lucide Icons
* **Backend:** Node.js, Express.js, JWT, bcryptjs
* **Database:** MongoDB (Mongoose)

## 💻 Local Setup Instructions

### Prerequisites
* Node.js installed on your machine.
* MongoDB Atlas account (or local MongoDB).

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Aryan0175/SimpleProjectTool-Aryan.git
cd SimpleProjectTool-Aryan
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` directory and add:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
\`\`\`
Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal tab.
\`\`\`bash
cd frontend
npm install
\`\`\`
Start the Vite development server:
\`\`\`bash
npm run dev
\`\`\`

## 🧠 Architecture Highlights
* **Clean API Layer:** The frontend isolates all `fetch` calls into a dedicated `api/` folder, preventing messy components.
* **Global Auth Context:** A React Context provider securely manages the user's JWT token and state across the application.
* **Native Drag & Drop:** Built without heavy external libraries to keep the bundle size small and demonstrate core DOM manipulation skills.