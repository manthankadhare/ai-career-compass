# 🎯 AI Career Growth Advisor

A beginner-friendly, full-stack AI web application that generates personalized career roadmaps using Claude AI.

Built with: **HTML + CSS + JavaScript + Node.js + Express + Anthropic Claude API**

---

## 📸 Features

- ✅ Beautiful dark-themed UI with amber accents
- ✅ AI-powered career path suggestions (3 matched career paths)
- ✅ Personalized skills-to-learn with free resources
- ✅ 3-stage learning roadmap (Beginner → Intermediate → Advanced)
- ✅ Internship & job hunting tips
- ✅ Motivational quote
- ✅ **Download as PDF** (with one click!)
- ✅ Fully responsive (works on mobile too)

---

## 🗂️ Project Structure

```
ai-career-advisor/
│
├── server.js              # Backend: Node.js + Express server
├── package.json           # Project dependencies
├── .env                   # Your API key goes here (never share this!)
├── .env.example           # Template for .env
├── .gitignore             # Ignores node_modules and .env
│
└── public/                # Frontend files (HTML/CSS/JS)
    ├── index.html         # Main HTML page
    ├── css/
    │   └── style.css      # All styles
    └── js/
        └── main.js        # Frontend JavaScript + PDF download
```

---

## ⚙️ Setup Instructions (Step by Step)

### Step 1: Install Node.js
Download from https://nodejs.org (choose LTS version)
Verify: `node --version` and `npm --version` in terminal

### Step 2: Get your FREE Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign up for a free account
3. Click "API Keys" → "Create Key"
4. Copy the key (starts with `sk-ant-...`)

### Step 3: Clone/Download this project
```bash
# If using git:
git clone <your-repo-url>
cd ai-career-advisor

# Or just download and extract the ZIP file
```

### Step 4: Install dependencies
```bash
npm install
```
This downloads Express, CORS, dotenv, and the Anthropic SDK.

### Step 5: Add your API key
Open the `.env` file and replace `your_api_key_here`:
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
PORT=3000
```

### Step 6: Start the server
```bash
# Normal start:
node server.js

# OR for auto-restart during development:
npm run dev
```

### Step 7: Open in browser
Go to: **http://localhost:3000**

---

## 🧪 Sample Input & Output

### Sample Input:
```
Name: Priya Patel
Education: 3rd Year BTech/BCA
Skills: Python, basic HTML/CSS, C programming, Excel
Interests: Data analysis, problem solving, finance, making dashboards
Goals: I want to work at a data-driven company doing analysis or 
       become a data scientist. Would love to work at Google or a fintech startup.
Experience: Completed Python basics on Coursera, built a small expense tracker
```

### Sample Output (what AI returns):
```json
{
  "summary": "Priya, you have a strong foundation...",
  "careerPaths": [
    { "title": "Data Scientist", "match": "High", ... },
    { "title": "Business Analyst", "match": "High", ... },
    { "title": "Machine Learning Engineer", "match": "Medium", ... }
  ],
  "skillsToLearn": [
    { "skill": "SQL", "priority": "High", "freeResource": "Mode Analytics SQL Tutorial" },
    { "skill": "Pandas & NumPy", "priority": "High", ... },
    ...
  ],
  "roadmap": {
    "beginner": { "duration": "0-3 months", "goals": [...], "project": "..." },
    "intermediate": { "duration": "3-9 months", ... },
    "advanced": { "duration": "9-18 months", ... }
  },
  "internshipTips": [...],
  "motivationalQuote": "..."
}
```

---

## 🔧 How It Works (Architecture)

```
Browser (HTML/CSS/JS)
        ↓ POST /api/career-advice (JSON data)
Express Server (server.js)
        ↓ API call with your prompt
Claude AI (claude-sonnet-4)
        ↓ Returns structured JSON career plan
Express Server
        ↓ Sends JSON response
Browser
        ↓ Displays results + PDF option
```

---

## 🚀 Ideas to Improve Later

1. **Add a database** — Save career plans with MongoDB or SQLite
2. **User accounts** — Login with Google, save multiple plans
3. **Compare plans** — Show side-by-side comparisons
4. **Email the plan** — Use Nodemailer to email the PDF
5. **LinkedIn integration** — Pull skills from LinkedIn profile
6. **Progress tracker** — Check off completed roadmap goals
7. **Dark/light mode toggle** — Add theme switcher
8. **Share button** — Generate a public link to share the plan
9. **Multiple AI models** — Let user choose between models
10. **Chatbot mode** — Ask follow-up questions about the plan

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| `ANTHROPIC_API_KEY not found` | Check your `.env` file has the key |
| `npm: command not found` | Install Node.js from nodejs.org |
| Port 3000 in use | Change `PORT=3001` in `.env` |
| API returns 401 | Your API key is wrong or expired |
| API returns 429 | Rate limited — wait 30 seconds and retry |

---

## 📄 License
Free to use for educational purposes.

---

Made with ❤️ — A BTech CS Final Year Project
