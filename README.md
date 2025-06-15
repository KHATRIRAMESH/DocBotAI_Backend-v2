# DocBotAI Backend v2

A Node.js backend application for DocBotAI with authentication, database integration, and OAuth support.

## Features

- Local authentication with email/password
- OAuth integration with Google and Facebook
- PostgreSQL database using Drizzle ORM
- Session management
- User registration and login
- Privacy policy page

## Tech Stack

- Node.js
- Express.js
- Passport.js
- DrizzleORM
- NeonDB (PostgreSQL)
- EJS templating
- Express Session

## Installation

1. Clone the repository:
```bash
git clone https://github.com/KHATRIRAMESH/DocBotAI_Backend-v2.git
cd docbotai_backend-v2
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
NEON_DATABASE_URL=your_neon_db_url
SESSION_SECRET=your_session_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/auth/facebook/callback
```

## Database Setup

1. Generate database migrations:
```bash
npm run db:generate
```

2. Run migrations:
```bash
npm run db:migrate
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Routes

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Protected dashboard page
- `/auth/google` - Google OAuth login
- `/auth/facebook` - Facebook OAuth login
- `/privacy-policy` - Privacy policy page

## Project Structure

```
├── src/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   │   ├── connection/
│   │   └── schema/
│   ├── middleware/
│   │   └── auth/
│   ├── routes/
│   └── server.js
├── views/
│   ├── dashboard.ejs
│   ├── login.ejs
│   ├── privacy-policy.ejs
│   └── register.ejs
└── package.json
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations

## License

ISC