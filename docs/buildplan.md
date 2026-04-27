# MIGRANT4MIGRANT — 9 Week Development Plan (MVP)

## Project Goal
Build a Minimum Viable Product (MVP) of MIGRANT4MIGRANT in 9 weeks using:

- FastAPI
- PostgreSQL
- SQLAlchemy + Alembic
- Jinja2 Templates
- Tailwind CSS
- Docker
- GitHub Projects

## Scope (Included in MVP)

### Core Features
- User Authentication
- Role-Based Access Control (Guest, Migrant, Volunteer, Admin)
- Resource Hub (CRUD + Search + Filters)
- Peer Support Forum
- Organization Directory
- Emergency Contacts
- Admin Dashboard
- Responsive Frontend
- Deployment

---

## Deferred Features (Post-MVP)
These are intentionally excluded for now:

- Google Translate API integration
- Email/SMTP notifications
- S3 File Storage
- Real-time chat
- Advanced analytics
- Full mentor matching algorithm
- Nginx reverse proxy (unless needed later)

---

# Phase 1 — Foundation (Weeks 1–3)

## Week 1 — Environment & Architecture

### Day 1
- Create GitHub repository
- Configure branch protection
- Initialize FastAPI project structure

### Day 2
- Setup Docker Compose
- Configure FastAPI container
- Configure PostgreSQL container

### Day 3
- Setup database connection
- Configure SQLAlchemy

### Day 4
- Configure Alembic migrations
- Create initial User table

### Day 5
- Setup GitHub Actions
- Add linting (Black/Flake8)
- Add basic CI test

---

## Week 2 — Authentication & Security

### Day 1
Implement:
```http
POST /auth/register
```

### Day 2
- Password hashing with bcrypt

### Day 3
- JWT token generation
- OAuth2 flow

### Day 4
Implement:
```http
POST /auth/login
POST /auth/logout
GET /auth/me
```

### Day 5
- Role-based access control middleware

---

## Week 3 — Base UI

### Day 1
- Setup Jinja2 templates
- Create base layout

### Day 2
- Integrate Tailwind CSS

### Day 3
Build:
- Login page
- Registration page

### Day 4
- Connect forms to auth endpoints

### Day 5
- User session handling

---

# Phase 2 — Feature Development (Weeks 4–6)

## Week 4 — Resource Hub

### Day 1
Resource CRUD:
```http
GET /resources
POST /resources
GET /resources/{id}
DELETE /resources/{id}
```

### Day 2
- Search functionality

### Day 3
- Resource listing UI

### Day 4
- Resource detail page

### Day 5
- Category filtering

---

## Week 5 — Peer Support Forum

### Day 1
Create schema:
- Posts
- Comments

### Day 2
Build:
```http
GET /posts
POST /posts
```

### Day 3
- Create post UI

### Day 4
- Reply/thread logic

### Day 5
- Report/flag system

---

## Week 6 — Organizations & Emergency Contacts

### Day 1
- Organization model
- Organization CRUD

### Day 2
- Organization listing UI

### Day 3
- Admin verification workflow

### Day 4
Emergency Contacts:
```http
GET /emergency
POST /emergency
```

### Day 5
- Emergency quick-access widget

---

# Phase 3 — Admin & UX Refinement (Weeks 7–8)

## Week 7 — Admin Dashboard

### Day 1
- Protect admin routes

### Day 2
User management:
```http
GET /admin/users
PUT /admin/users/{id}/role
DELETE /admin/users/{id}
```

### Day 3
- Resource moderation

### Day 4
Analytics overview:
- Total users
- Resource count
- Forum activity

### Day 5
- Flagged content moderation queue

---

## Week 8 — UX Polish

### Day 1
- Mobile responsiveness fixes

### Day 2
- Simple language toggle (static translations only)

### Day 3
- Profile page
- Saved resources
- User activity

### Day 4
- Custom 404/500 pages

### Day 5
- Final UI cleanup and testing

---

# Phase 4 — Production Launch (Week 9)

## Week 9 — Deployment

### Day 1
- Move secrets to .env

### Day 2
- Docker production setup

### Day 3
Deploy to:
- Render
- Railway
- DigitalOcean (optional)

### Day 4
- Domain + HTTPS setup

### Day 5
Launch tasks:
- Smoke testing
- Seed initial resources
- Go live

---

# Team Workflow Rules

## Git Branching Strategy

Use:
```bash
main
develop

feature/auth
feature/resources
feature/forum
feature/admin
```

---

## Workflow

Create branch:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/auth
```

Push work:
```bash
git add .
git commit -m "Implemented JWT login"
git push origin feature/auth
```

Create Pull Request:
```text
feature/*  → develop
develop    → main (release only)
```

---

## GitHub Project Rules

Every daily task should have:

- GitHub Issue
- Assignee
- Deadline

Project board columns:
- To Do
- In Progress
- Review
- Done

---

# MVP Success Criteria

Project is complete if users can:

✅ Register/Login  
✅ Search resources  
✅ Create forum posts  
✅ View organizations  
✅ Access emergency contacts  
✅ Admin manage users  
✅ Platform deployed live

---

## Seed Data Target

Initial launch content:

- 15 Housing Resources
- 10 Legal Resources
- 10 Job Resources
- 5 Emergency Contacts

Total:
40 starter records

---

Built with FastAPI • Designed for People • Open to All
