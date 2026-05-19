# GoalTrack — In-House Goal Setting & Tracking Portal

Mono-repo with separate frontend and backend apps.

- `frontend/` contains the React + Vite frontend
- `backend/` contains the Express + MongoDB backend

Enterprise-grade React frontend for goal management with role-based dashboards (Employee, Manager, Admin/HR).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- ShadCN-style UI (Radix primitives)
- Framer Motion
- React Router 7
- Recharts
- Lucide Icons

## Quick start

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Backend:
```bash
cd backend
npm install
npm start
```

**Important:** This project must have its own git repository (`git init`) so Tailwind can scan `src/` for classes. If the app looks unstyled (plain HTML), run `git init` in this folder and restart the dev server.

## Where is the CSS?

Styling uses **Tailwind CSS v4** (utility classes in JSX like `className="flex rounded-xl bg-indigo-600"`), not separate `.css` files per component. The single entry point is `src/index.css`, imported in `src/main.tsx`. Vite compiles it at build/dev time into `dist/assets/*.css`.

Open http://localhost:5173

## Demo accounts

Password for all: `demo123`

| Role     | Email                         |
|----------|-------------------------------|
| Employee | sarah.chen@company.com        |
| Manager  | james.mitchell@company.com    |
| Admin    | elena.rodriguez@company.com   |

Use the quick-login buttons on the sign-in page.

## Build

Frontend:
```bash
cd frontend
npm run build
npm run preview
```
