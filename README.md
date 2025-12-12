# Sweet Shop Management System 🍬

A full-stack sweet shop management system built with Next.js, TypeScript, MongoDB, and Node.js. Features a candy-themed responsive UI, user authentication, sweet browsing, purchasing, and an admin panel for inventory management.

## Features

- **User Authentication**: JWT with bcrypt and HTTP-only cookies
- **Browse & Purchase Sweets**: Search, filter, and buy with real-time inventory updates
- **Admin Panel**: Add, edit, delete, and restock sweets
- **Role-Based Access**: First registered user is admin
- **Responsive UI**: Works on all devices with a candy-themed design

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Next.js API Routes, MongoDB
- **Auth & Security**: JWT, bcrypt, HTTP-only cookies

## Deplyoed Using vercel

- **Deployed LINK** : https://sweetbhavshop-git-main-pes2ug22cs128s-projects.vercel.app

## Screenshots

### Landing Page
<img width="1882" height="865" alt="image" src="https://github.com/user-attachments/assets/72382781-3459-46bc-bd4a-44b9b7ede727" />

### Shop Dashboard
<img width="1615" height="847" alt="image" src="https://github.com/user-attachments/assets/dbe370a3-22f6-49b3-90d9-ec1667a9b493" />


### Admin Panel
<img width="1616" height="789" alt="image" src="https://github.com/user-attachments/assets/f0631490-bee0-4394-968e-02567cb228f9" />

## Quick Setup

### Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd sweet-shop
npm install
```

### Configure Environment Variables (.env.local)

```env
MONGODB_URI=mongodb://localhost:27017/sweetshop
JWT_SECRET=secret-jwt-key
```

### Seed Database (optional)

```bash
npx tsx scripts/seed-database.ts
```

Creates sample sweets and default admin: `admin@sweetshop.com` / `admin123`

### Run App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/        # Pages & API routes
components/ # UI components
lib/        # DB connection & auth helpers
scripts/    # Seed database
public/     # Images/assets
```

## API Endpoints

### Auth:
- `POST /api/auth/register` – Register
- `POST /api/auth/login` – Login
- `POST /api/auth/logout` – Logout
- `GET /api/auth/me` – Current user

### Sweets:
- `GET /api/sweets` – List sweets
- `POST /api/sweets` – Add sweet (Admin)
- `PUT /api/sweets/:id` – Update sweet (Admin)
- `DELETE /api/sweets/:id` – Delete sweet (Admin)
- `POST /api/sweets/:id/purchase` – Purchase sweet
- `POST /api/sweets/:id/restock` – Restock sweet (Admin)

## My AI Usage

**Tool**: v0 by Vercel, cursor, gemini

**AI Contribution**: Architecture, To connect and fixing the error when we signin

**Manual Work**: Requirements, design tweaks, testing, environment setup

Built with ❤️ using AI assistance from BHAVANA...
