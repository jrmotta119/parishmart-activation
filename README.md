# Parishmart Monorepo

A monorepo containing the Parishmart marketplace application with React frontend and Express.js backend.

## 🏗️ Project Structure

```
parishmart/
├── client/                 # React + Vite frontend
│   ├── src/               # Frontend source code
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
├── server/                # Express.js backend
│   ├── src/               # Backend source code
│   ├── uploads/           # File upload directory
│   ├── package.json       # Backend dependencies
│   └── tsconfig.json      # TypeScript configuration
├── shared/                # Shared types and utilities
│   ├── src/               # Shared source code
│   ├── package.json       # Shared package configuration
│   └── tsconfig.json      # TypeScript configuration
├── package.json           # Root monorepo configuration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   ```bash
   cp server/env.example server/.env
   # Edit server/.env with your configuration
   ```

3. **Build shared package:**
   ```bash
   cd shared && npm run build
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev
```

**Start only frontend:**
```bash
npm run dev:client
```

**Start only backend:**
```bash
npm run dev:server
```

### Production

**Build both projects:**
```bash
npm run build
```

**Start production servers:**
```bash
npm run start
```

## 📁 Package Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development
- `npm run build` - Build both frontend and backend
- `npm run start` - Start both in production mode
- `npm run install:all` - Install dependencies for all packages
- `npm run clean` - Clean build artifacts

### Client (Frontend)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server (Backend)
- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database

### Shared
- `npm run build` - Build shared package
- `npm run dev` - Watch mode for shared package

## 🔧 Configuration

### Frontend Configuration
- **Port:** 5173 (Vite default)
- **API Proxy:** All `/api/*` requests are proxied to `http://localhost:3001`
- **Environment:** Uses Vite's environment variable system

### Backend Configuration
- **Port:** 3001 (configurable via `PORT` env var)
- **CORS:** Configured for `http://localhost:5173`
- **File Uploads:** Stored in `server/uploads/`
- **Rate Limiting:** 100 requests per 15 minutes per IP

### Environment Variables

**Backend (.env):**
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=your_database_url_here
JWT_SECRET=your_jwt_secret_here
```

## 🛠️ Development Workflow

1. **Frontend Development:**
   - Edit files in `client/src/`
   - Hot reload available at `http://localhost:5173`
   - API calls automatically proxied to backend

2. **Backend Development:**
   - Edit files in `server/src/`
   - Server restarts automatically with nodemon
   - API available at `http://localhost:3001`

3. **Shared Code:**
   - Edit files in `shared/src/`
   - Rebuild with `npm run build` in shared directory
   - Import in both frontend and backend using `@parishmart/shared`

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Vendors
- `GET /api/vendors` - List vendors
- `POST /api/vendors` - Create vendor
- `GET /api/vendors/:id` - Get vendor by ID
- `PUT /api/vendors/:id` - Update vendor
- `POST /api/vendors/:id/verify` - Verify vendor

### File Uploads
- `POST /api/uploads/image` - Upload image file

## 🔍 Troubleshooting

### Common Issues

1. **Import errors with `@/` alias:**
   - Ensure `vite.config.ts` has correct alias configuration
   - Check that TypeScript paths are configured in `tsconfig.json`

2. **API calls not working:**
   - Verify backend is running on port 3001
   - Check CORS configuration in backend
   - Ensure proxy configuration in Vite is correct

3. **Shared package not found:**
   - Build shared package: `cd shared && npm run build`
   - Check that shared package is listed in dependencies

4. **File uploads not working:**
   - Ensure `server/uploads/` directory exists
   - Check file size limits in multer configuration
   - Verify file type restrictions

### Debug Commands

```bash
# Check if ports are in use
netstat -ano | findstr :3001
netstat -ano | findstr :5173

# Clean and reinstall
npm run clean
npm run install:all

# Rebuild shared package
cd shared && npm run build
```

## 📚 Additional Resources

- [Migration Checklist](./MIGRATION_CHECKLIST.md) - Detailed migration steps
- [Vite Documentation](https://vitejs.dev/) - Frontend build tool
- [Express.js Documentation](https://expressjs.com/) - Backend framework
- [TypeScript Documentation](https://www.typescriptlang.org/) - Type system
