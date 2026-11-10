# 🧭 AI Career Compass

AI Career Compass is an AI-powered career guidance web application that generates personalized career roadmaps based on users' education, skills, interests, and career goals. It helps users identify skill gaps, explore career opportunities, and plan their learning journey.

Built with: **HTML5 + CSS3 + JavaScript + Node.js + Express + Groq API**

---

## ✨ Features

- 🎯 **Tailored Career Match**: AI-driven analysis matching you with 3 high-potential career paths based on your profile.
- ⚡ **Targeted Skill Recommendations**: Identifies priority skills to learn next with curated free learning resources.
- 🗺️ **3-Stage Step-by-Step Roadmap**: Clear milestones spanning Beginner, Intermediate, and Advanced stages with real-world project recommendations.
- 💡 **Actionable Career Tips**: Strategic resume, internship, and interview advice customized to your aspirations.
- 📄 **One-Click PDF Export**: Download your complete personalized career roadmap as a PDF anytime.
- 🌙 **Modern Glassmorphic Dark UI**: Responsive design with clean typography and seamless mobile support.

---

## 🗂️ Project Structure

```
ai-career-compass/
│
├── server.js              # Express backend & Groq API integration
├── package.json           # Node.js dependencies and scripts
├── .env.example           # Environment variable template
├── .gitignore             # Excluded files (node_modules, .env)
│
└── public/                # Frontend application
    ├── index.html         # Main dashboard interface
    ├── css/
    │   └── style.css      # Custom styles & responsive theme
    └── js/
        └── main.js        # Form handler, API calls & PDF export
```

---

## ⚙️ Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher): [Download Node.js](https://nodejs.org)
- **Groq API Key**: [Get a free API key from Groq Console](https://console.groq.com)

### 2. Clone the Repository
```bash
git clone https://github.com/manthankadhare/ai-career-compass.git
cd ai-career-compass
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to a new `.env` file:
```bash
cp .env.example .env
```
Open `.env` and insert your Groq API key:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
PORT=5000
```

### 5. Launch the Application
```bash
# Production start:
npm start

# Development mode (with live reload):
npm run dev
```

Visit **http://localhost:5000** in your web browser.

---

## 🔧 Architecture & Flow

```
[ User Input Form (HTML / CSS / JS) ]
                   │
                   ▼  POST /api/career-advice (JSON)
[ Express.js Backend Server ]
                   │
                   ▼  Structured Prompt with JSON Mode
[ Groq Cloud API (openai/gpt-oss-20b) ]
                   │
                   ▼  Structured Career Roadmap JSON
[ Frontend Dashboard ]
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
 [ Visual Roadmap ]    [ Download PDF ]
```

---

## 🛠️ Troubleshooting

| Issue | Resolution |
|-------|------------|
| `GROQ_API_KEY Missing` | Ensure your `.env` file exists in the root folder with a valid key. |
| `Port 5000 in use` | Change `PORT=5001` (or another port) in your `.env` file. |
| `API returns 401` | Verify your API key at [console.groq.com](https://console.groq.com). |
| `API returns 429` | Groq rate limit reached — wait a few moments and try again. |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
