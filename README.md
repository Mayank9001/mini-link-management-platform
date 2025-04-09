# LinkVista

LinkVista is a **MERN stack URL shortener and analytics platform** that allows users to create, manage, and track shortened links with expiration options. It provides real-time click tracking, device-wise and date-wise analytics, and a user-friendly dashboard.

## Features

- **Dashboard**: View total clicks, device-wise and date-wise click breakdown.
- **Links Management**: Create, edit, delete, and copy shortened links with expiration options and automatic status updates.
- **Analytics**: Log visits with timestamp, destination URL, short link, IP address, and device details.
- **Settings**: Update user information like name, email, and mobile number.
- **Navigation**: Quick link creation and advanced search functionality.

## Tech Stack

- **Frontend**: Vite + React.js
- **Backend**: Node.js, Express.js, MongoDB
- **Hosting**: Vercel (Frontend), Render (Backend)

## Demo

[![Watch the video](https://img.youtube.com/vi/HTMTB8nJfkA/maxresdefault.jpg)](https://youtu.be/HTMTB8nJfkA)

## Installation

Follow these steps to set up the project locally:

### Prerequisites

Ensure you have **Node.js** and **MongoDB** installed.

### Clone Repository

```bash
git clone https://github.com/your-username/LinkVista.git
cd LinkVista
```

### Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` folder and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

#### Start Backend Server

```bash
npm run dev
```

### Frontend Setup

```bash
cd ../frontend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `frontend` folder and add:

```
VITE_API_BASE_URL=http://localhost:5000 or YOUR_BACKEND_DEPLOYED_URL
Example: VITE_API_BASE_URL=https://xyz.onrender.com
```

#### Start Frontend

```bash
npm run dev
```

## Folder Structure

```
LinkVista/
│── backend/   # Node.js, Express.js, MongoDB (API & DB)
│── frontend/  # Vite + React.js (UI & Client-side)
```

## Deployment

- **Frontend**: Deploy on [Vercel](https://vercel.com/)
- **Backend**: Deploy on [Render](https://render.com/)
