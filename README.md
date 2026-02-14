# Find Guarana

A full-stack application built with TypeScript, Next.js, Prisma, and featuring authentication and interactive maps.

## Features

- 🔐 **Authentication & Authorization**: Secure user authentication with NextAuth.js
- 🗺️ **Interactive Maps**: OpenStreetMap integration using Leaflet and React-Leaflet
- ⚡ **Modern Stack**: TypeScript, Next.js 15, Prisma ORM
- 🎨 **Responsive UI**: Tailwind CSS for styling
- 🔒 **Secure**: Password hashing with bcrypt, session management

## Tech Stack

- **Frontend**: React, Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), easily configurable for PostgreSQL/MySQL
- **Authentication**: NextAuth.js
- **Maps**: Leaflet, React-Leaflet, OpenStreetMap

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TylerGarlick/find-guarana.git
cd find-guarana
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the `NEXTAUTH_SECRET` with a secure random string:
```bash
# You can generate one with:
openssl rand -base64 32
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
find-guarana/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth API routes
│   │   └── register/              # User registration endpoint
│   ├── auth/
│   │   ├── signin/                # Sign-in page
│   │   └── register/              # Registration page
│   ├── dashboard/                 # Protected dashboard with map
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page
│   └── providers.tsx              # Auth provider wrapper
├── components/
│   └── Map.tsx                    # Leaflet map component
├── lib/
│   ├── auth.ts                    # NextAuth configuration
│   └── prisma.ts                  # Prisma client
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
└── public/                        # Static assets
```

## Features Breakdown

### Authentication
- Email/password authentication
- Secure password hashing
- Session management
- Protected routes
- Sign in/sign up pages

### Dashboard
- Interactive map with OpenStreetMap tiles
- Marker support with popups
- Responsive design
- User profile display
- Sign-out functionality

### Database
- User model with authentication fields
- Account and Session models for NextAuth
- Prisma ORM for type-safe database access
- SQLite for development (configurable for production databases)

## Deployment

### Environment Variables

Make sure to set these environment variables in production:

- `DATABASE_URL`: Your production database connection string
- `NEXTAUTH_URL`: Your production URL (e.g., https://yourdomain.com)
- `NEXTAUTH_SECRET`: A secure random string for session encryption

### Build

```bash
npm run build
npm start
```

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
