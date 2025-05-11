# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# 🌍 GlobeTrotter Quiz App

**GlobeTrotter** is a fun and educational geography-based quiz app where players guess cities based on clues, fun facts, and trivia. It supports both solo and challenge-based multiplayer gameplay.

Built using **React**, **Zustand** for state management, and **Ant Design** for the UI.

---

## 🧠 Features

- 🧍 Solo quiz mode with 5 questions
- 🧩 Random city clues with multiple-choice answers
- 📚 Fun facts and trivia after each answer
- 🏆 Challenge friends via invite links
- 📊 Real-time score tracking
- 🎨 Clean, responsive UI with Ant Design + Styled Components

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/globetrotter-quiz.git
cd globetrotter-quiz
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

App will run at `http://localhost:5173` by default.

---

## 🗂 Project Structure

```
src/
├── App.jsx / main.tsx            # App entry points
│
├── Services/                     # API logic
│   ├── quizService.js            # Start session, fetch questions, submit answers
│   └── challengeService.js       # Create and accept challenge sessions
│
├── Stores/                       # Zustand state stores
│   ├── quizStore.ts              # Handles quiz state & async actions
│   └── useRootStore.ts           # Centralized hook for accessing stores
│
├── Components/                   # Reusable UI components
│   ├── Quiz.jsx                  # Quiz UI (question, answers, feedback)
│   └── ...                       # Other UI components (Navbar, Results, etc.)
│
├── Styles/                       # Theme and styling
│   └── theme.js                  # Color palette, spacing, fonts
│
└── assets/                       # Icons, images, fonts
```

---

## 🧩 Quiz Flow Overview

1. **Start Quiz**
   - Calls `startNewSession()` in `quizStore`
   - Fetches a session ID and first question

2. **Answering Questions**
   - User selects an option → triggers `submitAnswer()`
   - App displays if answer was correct + fun fact/trivia

3. **Next Question**
   - Calls `handleNextQuestion()` → fetches next until all are done

4. **Results**
   - Final score displayed; challenge option offered

---

## 🏆 Challenge Mode Flow

1. User creates challenge → `createChallenge()` returns an invite link  
2. Friend joins via link → `startChallenge()` initializes their session  
3. Shared quiz begins with comparison score shown at the end

---

## 🧠 State Management (Zustand)

Global quiz state is managed using Zustand in:

📄 `Stores/quizStore.ts`

Tracks:
- `sessionId`, `currentQuestion`, `score`, `questionCount`
- Challenge data (`isChallenge`, `challengeId`, `inviteLink`)
- Feedback and loading/error states

Access it via:

```ts
const { quiz } = useRootStore(); // Provides access to quiz store
```

---

## 📌 Notes

- Compatible with React 18+ and Ant Design (patched via `@ant-design/compatible`)
- Designed with separation of concerns: Services (API), Store (state), Components (UI)
- Replace mock APIs in `quizService` and `challengeService` with your backend logic

