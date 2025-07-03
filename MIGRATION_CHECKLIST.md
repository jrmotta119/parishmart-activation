# Migration Checklist - Vite+React to Monorepo

## ✅ Completed Steps

### 1. Directory Structure
- [x] Created `/client` folder
- [x] Created `/server` folder  
- [x] Created `/shared` folder
- [x] Moved all frontend files to `/client`

### 2. Frontend Files Moved
- [x] `src/` → `/client/src/`
- [x] `public/` → `/client/public/`
- [x] `index.html` → `/client/index.html`
- [x] `vite.config.ts` → `/client/vite.config.ts`
- [x] `tsconfig.json` → `/client/tsconfig.json`
- [x] `tsconfig.node.json` → `/client/tsconfig.node.json`
- [x] `tailwind.config.js` → `/client/tailwind.config.js`
- [x] `postcss.config.js` → `/client/postcss.config.js`
- [x] `components.json` → `/client/components.json`
- [x] `tempo.config.json` → `/client/tempo.config.json`
- [x] `package.json` → `/client/package.json`
- [x] `package-lock.json` → `/client/package-lock.json`
- [x] `node_modules/` → `/client/node_modules/`
- [x] `.swc/` → `/client/.swc/`

### 3. Configuration Updates
- [x] Updated client `package.json` name to `parishmart-client`
- [x] Added proxy configuration to `vite.config.ts` for API calls
- [x] Created root `package.json` with monorepo scripts
- [x] Created shared package with common types and utilities

### 4. Backend Setup
- [x] Created Express.js server structure
- [x] Set up basic middleware (CORS, helmet, morgan, compression)
- [x] Created route structure for auth, users, products, vendors, uploads
- [x] Added file upload handling with multer
- [x] Created error handling middleware
- [x] Added health check endpoint

## 🔄 Next Steps to Complete

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies  
cd ../server && npm install

# Build shared package
cd ../shared && npm install && npm run build
```

### 2. Test Frontend Functionality
- [ ] Start client development server: `npm run dev:client`
- [ ] Verify all pages load correctly
- [ ] Check that all imports work (especially `@/` alias)
- [ ] Test API proxy configuration
- [ ] Verify static assets load properly

### 3. Test Backend Functionality
- [ ] Start server development server: `npm run dev:server`
- [ ] Test health check endpoint: `http://localhost:3001/api/health`
- [ ] Verify CORS configuration works with frontend
- [ ] Test file upload endpoint

### 4. Test Monorepo Scripts
- [ ] Test `npm run dev` (starts both frontend and backend)
- [ ] Test `npm run build` (builds both projects)
- [ ] Test `npm run start` (starts both in production mode)

### 5. Update Import Paths (if needed)
Check these files for potential import path issues:
- [ ] `client/src/App.tsx`
- [ ] `client/src/main.tsx`
- [ ] Any files using `@/` alias
- [ ] Any files importing from root-level directories

### 6. Environment Setup
- [ ] Copy `server/env.example` to `server/.env`
- [ ] Update environment variables as needed
- [ ] Verify frontend environment variables are still accessible

### 7. Database Integration (Future)
- [ ] Set up database connection
- [ ] Create database migration scripts
- [ ] Implement actual API endpoints
- [ ] Add authentication middleware

## 🚨 Potential Issues to Watch For

### Import Path Issues
- Files using `@/` alias should still work (configured in `vite.config.ts`)
- Any imports from root-level directories need to be updated
- Shared package imports should use `@parishmart/shared`

### Environment Variables
- Frontend environment variables should still be accessible
- Backend needs its own `.env` file
- CORS configuration needs to match frontend URL

### Build Process
- Client build should work from subdirectory
- Server build should compile TypeScript correctly
- Shared package should build before client/server

### Development Workflow
- Hot reload should work for both frontend and backend
- Proxy configuration should route API calls correctly
- File uploads should work with new server structure

## 🧪 Testing Commands

```bash
# Test frontend only
npm run dev:client

# Test backend only  
npm run dev:server

# Test both together
npm run dev

# Build everything
npm run build

# Start production
npm run start
```

## 📝 Notes

- The frontend should work exactly as before since all files were moved intact
- The `@/` alias in `vite.config.ts` still points to `./src` which is now `./client/src`
- API calls from frontend will be proxied to `http://localhost:3001` via Vite proxy
- Shared types and utilities are available to both frontend and backend
- Backend is set up with basic structure but endpoints need implementation 