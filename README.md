# jobcompass
---
### Smart Career Guidance & Interview Preparation Platform
Visit site [https://jobcompass-app.vercel.app](https://jobcompass-app.vercel.app)

JobCompass is a full-stack web application designed to help students and freshers make **clear career decisions** and **prepare effectively for technical interviews**.  
The platform combines structured learning roadmaps, interview simulation, and AI-assisted guidance into a single system.

This is a **real deployed product**, not a tutorial demo.

---

## 🌟 Core Idea

Students often struggle with:
- Choosing the right career path (SDE, Data Analyst, AI, etc.)
- Understanding *what to learn next*
- Preparing for **technical + HR interviews**

**JobCompass solves this** by providing:
- Guided career roadmaps
- Technical interview simulation
- STAR-method based HR practice
- Centralized progress tracking

---

## 🔥 Key Features

- 🔐 **Secure Authentication**
  - Email & Password Login
  - Google OAuth (Firebase)
  
- 🧭 **Career Roadmaps**
  - Role-based learning paths
  - Step-by-step skill progression

- 🎯 **Technical Interview Simulator**
  - Practice technical questions
  - Simulated interview flow
  - Helps reduce interview anxiety

- 🧠 **STAR Method Module**
  - Practice HR/behavioral questions
  - Structured answers using Situation, Task, Action, Result
  - Improves communication & clarity

- 🤖 **AI-Assisted Guidance**
  - Career suggestions
  - Interview preparation support

- 📊 **User Dashboard**
  - Track progress
  - Personalized experience

- 🌐 **Fully Deployed**
  - Frontend + Backend + Database live

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Axios
- Firebase Authentication
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication

### AI & Integrations
- OpenRouter API (AI features)
- Firebase Google OAuth

### Deployment
- **Frontend:** Vercel  
- **Backend:** Render  
- **Database:** MongoDB Atlas  

---

## 🏗️ Architecture Overview

```

Frontend (React + Firebase Auth)
|
| REST API (Axios)
↓
Backend (Node.js + Express + JWT)
|
↓
MongoDB Atlas

````

---

## 🔐 Authentication Flow

1. User registers/logs in via frontend
2. Google OAuth handled by Firebase
3. Backend validates user & issues JWT
4. JWT stored in browser
5. Protected routes verify JWT on each request

## 🚀 Live Links

* **Frontend:** [https://jobcompass-app.vercel.app](https://jobcompass-app.vercel.app)
* **Backend:** [https://jobcompass-4w64.onrender.com](https://jobcompass-4w64.onrender.com)

---

## 🧪 Run Locally

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📚 What This Project Demonstrates

* End-to-end full-stack development
* Real production deployment
* Secure authentication & authorization
* API design and integration
* Debugging real deployment issues
* Interview-oriented system design

---

## 👩‍💻 Author

**Shravya Palegarthuli**
GitHub: [https://github.com/shravya-9723](https://github.com/shravya-9723)

---
```

