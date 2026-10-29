// =============================================
// server.js - Groq Version (Free AI)
// AI Career Growth Advisor
// =============================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ---- Middleware ----
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Create Groq client using OpenAI SDK
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// =============================================
// POST /api/career-advice
// =============================================
app.post("/api/career-advice", async (req, res) => {
  const { name, education, skills, interests, goals, experience } = req.body;

  // Validation
  if (!name || !skills || !interests || !goals) {
    return res.status(400).json({
      error: "Please fill required fields (name, skills, interests, goals)",
    });
  }

  // Prompt
  const userPrompt = `
You are an expert career counselor helping a student plan their tech career.

Here is information about the student:
- Name: ${name}
- Education Level: ${education || "Not specified"}
- Current Skills: ${skills}
- Interests: ${interests}
- Career Goals: ${goals}
- Experience: ${experience || "Beginner"}

Respond ONLY in valid JSON format:

{
  "summary": "",
  "careerPaths": [
    {
      "title": "",
      "match": "",
      "description": "",
      "avgSalary": "",
      "topCompanies": []
    }
  ],
  "skillsToLearn": [
    {
      "skill": "",
      "priority": "",
      "reason": "",
      "freeResource": ""
    }
  ],
  "roadmap": {
    "beginner": {
      "duration": "",
      "goals": [],
      "project": ""
    },
    "intermediate": {
      "duration": "",
      "goals": [],
      "project": ""
    },
    "advanced": {
      "duration": "",
      "goals": [],
      "project": ""
    }
  },
  "internshipTips": [],
  "motivationalQuote": ""
}
`;

  try {
    console.log(`📋 Generating plan for ${name}`);

    // Groq API call via OpenAI SDK
    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "You are a career counselor. Always respond with valid JSON only. No markdown, no code fences, no extra text." },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0].message.content;

    let careerPlan;
    try {
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      careerPlan = JSON.parse(cleanJson);
    } catch (err) {
      console.error("JSON parse error:", err);
      return res.status(500).json({
        error: "AI returned an invalid response. Please try again.",
      });
    }

    // Ensure required fields exist with safe defaults
    careerPlan.careerPaths = Array.isArray(careerPlan.careerPaths) ? careerPlan.careerPaths : [];
    careerPlan.skillsToLearn = Array.isArray(careerPlan.skillsToLearn) ? careerPlan.skillsToLearn : [];
    careerPlan.internshipTips = Array.isArray(careerPlan.internshipTips) ? careerPlan.internshipTips : [];
    careerPlan.roadmap = careerPlan.roadmap || {};
    careerPlan.summary = careerPlan.summary || "";
    careerPlan.motivationalQuote = careerPlan.motivationalQuote || "";

    console.log(`✅ Success for ${name}`);

    res.json({
      success: true,
      careerPlan,
    });

  } catch (error) {
    console.error("❌ Groq Error:", error.message);

    if (error.status === 401) {
      return res.status(401).json({
        error: "Invalid GROQ API key. Check your .env file.",
      });
    } else if (error.status === 429) {
      return res.status(429).json({
        error: "Rate limit reached. Try again later.",
      });
    } else {
      return res.status(500).json({
        error: "Server error: " + error.message,
      });
    }
  }
});

// =============================================
// GET /
// =============================================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =============================================
// START SERVER
// =============================================
app.listen(PORT, () => {
  console.log("\n🚀 Groq AI Career Advisor Running!");
  console.log(`📍 http://localhost:${PORT}`);
  console.log(
    `🔑 API Key: ${process.env.GROQ_API_KEY ? "✅ Loaded" : "❌ Missing"}`
  );
});