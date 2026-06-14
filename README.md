<div align="center">

<img src="frontend\assets\background_form.jpg" alt="Migrant4Migrant Banner" width="100%">

<h1>MIGRANT4MIGRANT</h1>

<p><strong>A community-first platform connecting migrants with resources, support & each other.</strong></p>

<p>
  <a href="https://github.com/tajirdev/MIGRANT4MIGRANT/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/tajirdev/MIGRANT4MIGRANT?style=for-the-badge&color=FF6B6B" alt="Contributors">
  </a>
  <a href="https://github.com/tajirdev/MIGRANT4MIGRANT/network/members">
    <img src="https://img.shields.io/github/forks/tajirdev/MIGRANT4MIGRANT?style=for-the-badge&color=4ECDC4" alt="Forks">
  </a>
  <a href="https://github.com/tajirdev/MIGRANT4MIGRANT/stargazers">
    <img src="https://img.shields.io/github/stars/tajirdev/MIGRANT4MIGRANT?style=for-the-badge&color=FFE66D" alt="Stars">
  </a>
  <a href="https://github.com/tajirdev/MIGRANT4MIGRANT/issues">
    <img src="https://img.shields.io/github/issues/tajirdev/MIGRANT4MIGRANT?style=for-the-badge" alt="Issues">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License">
  </a>
</p>

<p>
  <a href="#demo">View Demo</a> ·
  <a href="#features">Features</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#api-reference">API Docs</a> ·
  <a href="#contributing">Contribute</a>
</p>

</div>

---

## About The Project

> *"Every migrant deserves a community — MIGRANT4MIGRANT makes it findable."*

Migrants often face a triple barrier: **no reliable information**, **language obstacles**, and **social isolation**. MIGRANT4MIGRANT is a web platform that bridges that gap — a single, trusted space where newly arrived and established migrants can find legal resources, housing support, job listings, peer mentors, and emergency contacts for their region.

### Why This Project?

- Migrants waste hours navigating scattered, unreliable sources
- Language barriers block access to critical services
- Peer knowledge from other migrants is underutilized
- NGOs and support organizations lack a unified channel to reach those who need them

### Built With

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![AWS S3](https://img.shields.io/badge/Amazon_S3-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)

---

## Features

| Feature | Description |
|---|---|
| **Resource Hub** | Searchable database of housing, legal aid, healthcare & jobs — filtered by city/country |
| **Peer Support Forum** | Community Q&A board with volunteer and peer answers |
| **Mentor Matching** | Connect newly arrived migrants with experienced ones in the same field or country |
| **Organization Directory** | Verified NGOs, legal clinics & community centers with full contact info |
| **Multi-language Support** | Platform available in 5+ languages via Google Translate API |
| **Emergency Contacts** | One-click access to country-specific hotlines and rapid support numbers |

---

## System Architecture

```
+---------------------------------------------+
|         Multilingual HTML/CSS/JS Frontend    |
|              (Mobile-Responsive)             |
+------------------+--------------------------+
                   |
+------------------v--------------------------+
|            FastAPI Application Server        |
|   REST API · Auth Middleware · Search Engine |
|         Notification System                  |
+---+-----------+-------------+---------------+
    |           |             |
+---v---+  +---v----+  +------v------+
|  JWT  |  |  SMTP  |  |  Google     |
|  Auth |  |  Email |  |  Translate  |
+-------+  +--------+  +-------------+
    |
+---v-----------------------------------------+
|               PostgreSQL Database            |
|  Users · Resources · Posts · Orgs · Reports  |
+---------------------------------------------+
    |
+---v-----------------------------------------+
|           External Integrations              |
|  Maps API · S3 File Storage · Google APIs   |
+---------------------------------------------+
```

---

## User Roles

| Role | Access Level |
|---|---|
| **Guest** | Browse resources, read posts, search by location, view org profiles |
| **Migrant** | + Post support requests, message mentors, save bookmarks, join groups |
| **Volunteer** | + Offer mentorship, add local resources, moderate posts |
| **Admin** | Full access: verify orgs, manage users, analytics, system config |

---

## Getting Started

### Prerequisites

- Python 3.10+
- PostgreSQL 14+
- Docker (optional, for containerized setup)

```bash
# Check your Python version
python --version

# Check PostgreSQL
psql --version
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tajirdev/MIGRANT4MIGRANT.git
   cd MIGRANT4MIGRANT
   ```

2. **Set up the Python environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate       # On Windows: venv\Scripts\activate
   pip install -r app/requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your values:
   ```env
   DATABASE_URL=postgresql://user:password@localhost/migrant4migrant
   SECRET_KEY=your-secret-key-here
   GOOGLE_TRANSLATE_API_KEY=your-google-api-key
   AWS_S3_BUCKET=your-s3-bucket
   SMTP_HOST=smtp.yourmailprovider.com
   ```

4. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

5. **Start the development server**
   ```bash
   uvicorn app.main:app --reload
   ```

6. **Open your browser**
   ```
   http://localhost:8000
   API Docs: http://localhost:8000/docs
   ```

### Docker Setup (Recommended)

```bash
docker-compose up --build
```

---

## API Reference

> Full interactive docs available at `http://localhost:8000/docs` (Swagger UI) or `/redoc`.

### Registration (MIGRANT)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/register/user` | Register a new user | Public |
| `GET` | `/register/users` | Get all users | Required |
| `GET` | `/register/me` | Get current user profile | Required |
| `PUT` | `/register/edite/me` | Update current user profile | Required |
| `PUT` | `/register/edite/me/password` | Update password | Required |
| `DELETE` | `/register/delete/me` | Delete account | Required |
| `POST` | `/registerverfy/me` | Send account verification | Required |
| `POST` | `/registerverfy/me/otp` | Verify account with OTP | Required |

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/login` | Login and receive token | Public |
| `POST` | `/forgot-password` | Request password reset | Public |
| `POST` | `/verify-otp` | Verify OTP code | Public |
| `POST` | `/reset-password` | Reset password with token | Public |

### Admin

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/admin/register` | Create an admin account | Public |

### Mentor

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/register/mentor` | Register as a mentor | Required |
| `GET` | `/register/mentor/me` | Get current mentor profile | Required |

### Posts

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/create` | Create a new post | Required |
| `GET` | `/posts` | Read all posts | Required |
| `GET` | `/{id}` | Get post by ID | Required |
| `GET` | `/pots/me` | Get my posts | Required |
| `PUT` | `/edit/{id}` | Edit a post | Required |
| `DELETE` | `/delete-post/{post_id}` | Delete a post | Required |

### Resources

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/resources/create` | Add a new resource | Required |
| `GET` | `/resources/all` | Get all resources | Required |
| `GET` | `/resources/all/me` | Get my resources | Required |
| `GET` | `/resources/{id}` | Get resource by ID | Required |
| `PUT` | `/resources/edit/{update_id}` | Edit a resource | Required |
| `DELETE` | `/resources/delete/{delete_id}` | Remove a resource | Required |

### Emergency Contacts

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/emergency/create` | Add emergency contact | Required |
| `GET` | `/emergency/all` | Get all emergency contacts | Required |
| `GET` | `/emergency/{id}` | Get emergency contact by ID | Required |
| `PUT` | `/emergency/edit/{id}` | Edit emergency contact | Required |
| `DELETE` | `/emergency/delete/{id}` | Remove emergency contact | Required |

### Organizations

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/organization/create` | Add an organization | Required |
| `GET` | `/organization/all` | Get all organizations | Public |
| `GET` | `/organization/{id}` | Get organization by ID | Public |
| `PUT` | `/organization/edit/{id}` | Edit organization | Required |
| `DELETE` | `/organization/delete/{id}` | Remove organization | Required |

---

## Database Schema

<details>
<summary>Click to expand schema</summary>

```sql
-- Users
users: id, email, user_name, password_hash, name, role, language, country, created_at

-- Mentors
mentors: id, user_id (FK), expertise, languages, availability, rating

-- Organizations
organizations: id, name, type, country, email, verified, description, services

-- Resources
resources: id, title, category, description, location, contact, verified, added_by (FK)

-- Posts
posts: id, author_id (FK), title, body, category, is_resolved, created_at

-- Emergency Contacts
emergency_contacts: id, country, service_name, phone, available_24h
```

</details>

---

## Project Structure

```
MIGRANT4MIGRANT/
├── backend/
│   ├── app/
│   │   ├── models/         # SQLAlchemy data models
│   │   ├── schemas/        # Pydantic validation schemas
│   │   ├── services/       # Business logic & API services
│   │   ├── auth/           # JWT authentication & authorization
│   │   ├── main.py         # FastAPI app entry point
│   │   ├── database.py     # DB connection & session management
│   │   └── requirements.txt
│   ├── .env                # Environment variables (never commit!)
│   ├── venv/
│   └── .gitignore
├── frontend/               # HTML/CSS/JS client
├── docs/                   # Documentation & API specs
└── README.md
```

---

## Security

- **JWT authentication** with role-based access control
- **bcrypt** password hashing with salt
- **Token expiry & refresh** flow
- **HTTPS enforced** via TLS 1.3
- **SQL injection prevention** via SQLAlchemy ORM
- **Input validation** with Pydantic schemas
- **GDPR-aware** data handling with user deletion on request
- **Rate limiting** on login endpoint
- **CORS whitelist** configured

---

## Impact

<div align="center">

| Languages | Resources | User Roles | Emergency |
|:---:|:---:|:---:|:---:|
| **5+** | **100+** | **4** | **24/7** |
| Supported at launch | Available on launch | Guest to Admin | Emergency contacts |

</div>

---

## Roadmap

- [x] FastAPI setup & DB schema
- [x] Auth system (JWT + bcrypt + OTP verification)
- [x] User registration, profiles & password reset
- [x] Resource CRUD
- [x] Forum posts (create, read, edit, delete)
- [x] Mentor registration & profile
- [x] Organization directory (CRUD)
- [x] Emergency contacts (CRUD)
- [x] Admin registration
- [ ] Multi-language toggle (Google Translate)
- [ ] Analytics dashboard
- [ ] Docker + VPS deployment
- [ ] Mobile app (future)

See [open issues](https://github.com/tajirdev/MIGRANT4MIGRANT/issues) for the full list of planned features and known bugs.

---

## Contributors

Thanks to everyone who has contributed to this project:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/omarisengulo17">
        <img src="https://github.com/omarisengulo17.png" width="80" height="80" style="border-radius:50%" alt="omarisengulo17"/><br/>
        <sub><b>omarisengulo17</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/maduhu1234">
        <img src="https://github.com/maduhu1234.png" width="80" height="80" style="border-radius:50%" alt="maduhu1234"/><br/>
        <sub><b>maduhu1234</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Jobbarnar">
        <img src="https://github.com/Jobbarnar.png" width="80" height="80" style="border-radius:50%" alt="Jobbarnar"/><br/>
        <sub><b>Jobbarnar</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/HimChana">
        <img src="https://github.com/HimChana.png" width="80" height="80" style="border-radius:50%" alt="HimChana"/><br/>
        <sub><b>HimChana</b></sub><br/>
        <sub>he/him</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/anollian-mushi">
        <img src="https://github.com/anollian-mushi.png" width="80" height="80" style="border-radius:50%" alt="anollian-mushi"/><br/>
        <sub><b>anollian-mushi</b></sub><br/>
        <sub>he/him</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/agostinosasi3-rgb">
        <img src="https://github.com/agostinosasi3-rgb.png" width="80" height="80" style="border-radius:50%" alt="agostinosasi3-rgb"/><br/>
        <sub><b>agostinosasi3-rgb</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/tajirdev">
        <img src="https://github.com/tajirdev.png" width="80" height="80" style="border-radius:50%" alt="tajirdev"/><br/>
        <sub><b>tajirdev</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## Contributing

Contributions make this project more impactful. Here's how to get involved:

1. Fork the project
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## Contact

Project Link: [https://github.com/tajirdev/MIGRANT4MIGRANT](https://github.com/tajirdev/MIGRANT4MIGRANT)

---

## Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) — for the blazing-fast Python web framework
- [SQLAlchemy](https://www.sqlalchemy.org/) — for the powerful ORM
- [Tailwind CSS](https://tailwindcss.com/) — for the utility-first styling framework
- [Google Translate API](https://cloud.google.com/translate) — for multi-language support
- [Shields.io](https://shields.io) — for the badges
- All the migrants, volunteers, and NGOs who inspired this project

---

<div align="center">

**Built with FastAPI · Designed for people · Open to all**

Star this repo if you believe every migrant deserves a community.

</div>
