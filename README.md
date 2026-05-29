# CRM Project

Full-stack CRM application with:

- Rust backend (Axum + SQLx + PostgreSQL)
- React frontend (Vite)

## Core Features

- Contact management (create/read/update/delete)
- Interaction tracking per contact
- Persistent storage with PostgreSQL
- Search and filtering for contacts

## Local Development

Backend:

1. Copy `backend/.env.example` to `backend/.env`
2. Set `DATABASE_URL`
3. Run `cd backend && cargo run`

Frontend:

1. Copy `frontend/.env.example` to `frontend/.env`
2. Set `VITE_API_URL` (for local backend use `http://localhost:8000`)
3. Run `cd frontend && npm install && npm run dev`

## Render Deployment

This repo includes `render.yaml` for a two-service deployment:

- `crm-backend` as a Rust web service
- `crm-frontend` as a static web service

Required Render environment variables:

- Backend: `DATABASE_URL`
- Frontend: `VITE_API_URL` (auto-linked from backend URL by `render.yaml`)

Backend includes a health check endpoint at `/health`.
