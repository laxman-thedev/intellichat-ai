# 🤖 IntelliChat — Intelligent AI Assistant

IntelliChat is a **full-stack AI chat application** built using the **MERN stack with TypeScript**, designed to provide **AI-powered text and image generation**, user authentication, credit-based usage, community image sharing, and secure payment integration.

This project follows **real-world backend + frontend architecture**, RESTful APIs, and production deployment practices.

---

## 🚀 Live Demo

* **Link:** [https://intellichat-ai-lime.vercel.app](https://intellichat-ai-lime.vercel.app)

---

## 🧠 Features

### 🔐 Authentication & Authorization

* User registration & login (JWT-based)
* Protected routes using middleware
* Secure password hashing with bcrypt

### 💬 AI Chat

* Text-based AI responses (Gemini / OpenAI-compatible API)
* Image generation using AI
* Chat history stored per user
* Multiple chats per user

### 🎨 Community Images

* Users can publish generated images
* Public community gallery
* Displays creator name with image

### 💳 Credit System

* Credit-based AI usage
* Text messages consume credits
* Image generation consumes more credits
* Real-time credit updates in UI

### 💰 Payments (Stripe)

* Purchase credit plans
* Secure Stripe Checkout
* Webhook handling for payment confirmation
* Automatic credit top-up after payment

### 🌗 UI & UX

* Dark / Light mode toggle
* Responsive layout
* Sidebar chat navigation
* Loading states & toast notifications

### 🛠 Developer Friendly

* Full TypeScript (Client + Server)
* Clean folder structure
* Reusable context & hooks
* Centralized API handling
* Deployed on Vercel

---

## 🏗 Tech Stack

### Frontend (Client)

* React + TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios
* React Context API
* PrismJS
* React Markdown
* React Hot Toast

### Backend (Server)

* Node.js
* Express + TypeScript
* MongoDB + Mongoose
* JWT Authentication
* Stripe Payments
* ImageKit
* OpenAI / Gemini API
* Nodemon / tsx

### Deployment

* **Client:** Vercel (Static Build)
* **Server:** Vercel (Serverless Functions)
* **Database:** MongoDB Atlas

---

## 📁 Project Structure

```
intellichat-ai/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── types/
│   │   ├── assets/
│   │   └── main.tsx
│   ├── index.html
│   ├── vercel.json
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── configs/
│   │   └── server.ts
│   ├── vercel.json
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Guide (Local Development)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/laxman-goud/intellichat-ai.git
cd intellichat-ai
```

---

### 2️⃣ Client Setup

```bash
cd client
npm install
```

* Create a `.env` file in `client/`
* Copy all required variables from **`.env.example`**
* Then start the client:

```bash
npm run dev
```

---

### 3️⃣ Server Setup

```bash
cd ../server
npm install
```

* Create a `.env` file in `server/`
* Copy all required variables from **`.env.example`**
* Then start the server:

```bash
npm run dev
```

> Ensure MongoDB, Stripe, ImageKit, and AI API keys are correctly configured in `.env`.

---

### 4️⃣ Open in Browser

* Client: `http://localhost:5173`
* Server: `http://localhost:5000`

---

## ⭐ Support

If you like this project, please **star ⭐ the repository**
Issues, PRs, and suggestions are always welcome.

---