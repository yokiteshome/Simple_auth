# Simple_auth
# Simple Authentication System

A comprehensive, full-stack authentication starter kit built with Node.js, Express, MongoDB, and React (Vite + TypeScript). This project provides a robust foundation for handling user registration, login, password recovery, and admin setup with a modern UI.

##  Features

- **Robust Backend**: Node.js/Express API with JWT-based authentication.
- **Secure Storage**: Password hashing using `bcrypt`.
- **User Management**: Support for user profiles and roles.
- **Password Recovery**: Email-based password reset using `nodemailer`.
- **Modern Frontend**: Built with React 19, Vite, and TypeScript.
- **Theming & Localization**: Integrated theme (Dark/Light) and language context.
- **UI/UX**: Smooth animations with Framer Motion and GSAP, styled with Tailwind CSS 4.
- **Admin Setup**: Initial admin user configuration flow.

## 🛠 Tech Stack

### Backend

- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Security**: [JSON Web Tokens (JWT)](https://jwt.io/), [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Utilities**: `dotenv`, `cookie-parser`, `nodemailer`

### Frontend

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

##  How to Use This Project

Follow these steps to integrate this authentication system into your own projects.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/simple-authentication.git
cd simple-authentication
```

### 2. Backend Setup

Install backend dependencies and configure environment variables.

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
CLIENT_URL=http://localhost:5173
```

#### Start Backend

```bash
npm run dev
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies.

#### Navigate and Install

```bash
cd frontend/teme
npm install
# OR if you use pnpm
pnpm install
```

#### Start Frontend

```bash
npm run dev
```

The application should now be running at `http://localhost:5173` and the API at `http://localhost:5000`.

---

##  Key API Endpoints

| Method | Endpoint                    | Description                        |
| :----- | :-------------------------- | :--------------------------------- |
| GET    | `/api/auth/status`          | Check if admin user exists         |
| POST   | `/api/auth/register`        | Register a new user                |
| POST   | `/api/auth/login`           | Login and receive cookie-based JWT |
| POST   | `/api/auth/logout`          | Clear auth cookies                 |
| PATCH  | `/api/auth/change-password` | Update password (authenticated)    |
| POST   | `/api/auth/reset-password`  | Send reset password email          |
| PATCH  | `/api/auth/reset-password`  | Confirm reset using token          |
| GET    | `/api/auth/`                | List all users (admin only)        |
| DELETE | `/api/auth/:id`             | Delete user (admin only)           |

---

## Project Structure

- `backend/`: Node.js/Express backend.
  - `index.js`: Main entry point.
  - `controllers/`: Logic for authentication and user management.
  - `routes/`: Express route definitions.
  - `models/`: Mongoose schemas (User).
  - `middlewares/`: Authentication and error handling middlewares.
  - `utils/`: Token generation and mailing utilities.
- `frontend/teme/`: React application.
  - `src/context/`: Auth, Theme, and Language providers.
  - `src/pages/`: Main application views (Login, Register, Profile, etc.).
  - `src/components/`: Reusable UI elements (Layout & UI components).

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

##  License

This project is licensed under the MIT License.
