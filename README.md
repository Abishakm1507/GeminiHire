# 🚀 GeminiHire – AI Job Assistant 

**GeminiHire** is a modern, AI-powered job application assistant that helps candidates analyze resumes, identify skill gaps, generate high-quality cover letters, and prepare for interviews — all through a guided, visually rich workflow.

Built with a **stunning dark glassmorphism UI**, smooth animations, and **Gemini-powered Edge Functions**, the app delivers real-time feedback at every step of the job application process.

🌐 **Live App**: https://gemini-hire.vercel.app/
📦 **Repository**: https://github.com/Abishakm1507/GeminiHire

---

## ✨ Features

### 🎨 Design & UX
- Deep **navy/teal dark theme** with cyan accents
- **Glassmorphism UI** with blurred cards and panels
- Smooth **Framer Motion animations**
- Sidebar-based **step-by-step workflow**
- Progress indicators & AI quality score rings

---

### 🧠 Core AI Capabilities

#### 📄 Resume Upload
- Drag & drop **PDF or image** resumes
- Job description input for contextual analysis

#### 🔍 AI Resume Analysis
- Gemini-powered resume parsing
- Skill extraction & **skill gap detection**
- Role-fit insights with structured feedback

#### ✉️ Cover Letter Generator
- AI-generated, role-specific cover letters
- Quality scoring on:
  - Relevance
  - Accuracy
  - Effectiveness
- Iterative refine → regenerate workflow

#### 🎤 Interview Coach
- 5 tailored interview questions:
  - 3 Technical
  - 2 Behavioral
- Practice tracking & guided preparation

---

## 🏗️ Tech Stack

### Frontend
- **Vite**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Radix UI**
- **Framer Motion**

### Backend
- **Supabase**
  - Authentication
  - File Storage
  - Edge Functions
- **Gemini 2.5 Flash**
  - Multimodal resume & job description analysis
  - Cover letter and interview content generation

---

## 🧩 Architecture Overview

```text
Frontend (React + Vite)
        |
        v
Supabase Edge Functions
  ├── gemini-analyze   → Resume & JD analysis
  └── gemini-generate  → Cover letter & interview content
        |
        v
     Gemini 2.5 Flash

## 📁 Project Structure
ai-job-assistant-pro/
│
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Workflow pages
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   └── integrations/
│       └── supabase/      # Supabase client & helpers
│
├── supabase/
│   └── functions/
│       ├── gemini-analyze/
│       │   └── index.ts
│       └── gemini-generate/
│           └── index.ts
│
├── public/
├── package.json
└── README.md
```
## Team Members
1. Abisha K M
2. Harshini S
3. Kavya S
4. Kaviya Priya S - https://github.com/Kaviyapriyasiva/
