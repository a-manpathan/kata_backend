# SweetStock - Sweet Shop Management System

A full-stack web application for managing a sweet shop inventory with user authentication, role-based access control, and a modern React frontend.

## 🍬 Features

- **User Authentication**: Register and login with JWT tokens
- **Role-Based Access**: Admin and regular user permissions
- **Sweet Management**: Add, view, update, and delete sweets (Admin only)
- **Inventory Control**: Purchase sweets and restock inventory
- **Search & Filter**: Find sweets by name, category, or price
- **Responsive Design**: Mobile-first UI with SweetStock design system

## 🛠 Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **PostgreSQL** database with **Drizzle ORM**
- **JWT** for authentication
- **Jest** for testing

### Frontend
- **React** with **TypeScript**
- **React Router** for navigation
- **Axios** for API calls
- **Custom CSS** with SweetStock design system
- **Vite** for build tooling

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd KATA_assign
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with your database URL
echo "PORT=3000" > .env
echo "DATABASE_URL=your_postgresql_connection_string" >> .env
echo "JWT_SECRET=your_jwt_secret_key" >> .env

# Run database migrations
npm run db:generate
npm run db:migrate

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:3000/api" > .env

# Start frontend development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Test Coverage
Current test coverage includes:
- User registration endpoint
- User login endpoint
- Authentication middleware

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Sweets (Protected)
- `GET /api/sweets` - Get all sweets
- `POST /api/sweets` - Add new sweet
- `GET /api/sweets/search` - Search sweets
- `PUT /api/sweets/:id` - Update sweet
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)

### Inventory (Protected)
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (Admin only)

## 👥 User Roles

### Regular User
- View all sweets
- Search and filter sweets
- Purchase sweets (decreases quantity)

### Admin User
- All regular user permissions
- Add new sweets
- Update sweet details
- Delete sweets
- Restock inventory

## 🎨 Design System

SweetStock uses a warm, friendly design system:
- **Colors**: Soft pastels (pink, cream, cocoa brown)
- **Typography**: Poppins for headings, Inter for body text
- **Components**: Card-based layout with rounded corners
- **Accessibility**: WCAG AA compliant with proper focus states

## 📱 Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Create Account
![Create Account](screenshots/register_page.png)

### Popup
![Popup](screenshots/popup_page.png)



## 🤖 My AI Usage
**AI Tools Used:**
* **Google Gemini:** Primary coding assistant and thought partner.

**How I Used Them:**
* **Brainstorming & Architecture:** I used Gemini to brainstorm the database schema structure (User vs. Sweets vs. Inventory relations) and to decide between using Prisma vs. Drizzle ORM.
* **Generating Boilerplate:** I asked Gemini to generate the initial `tsconfig.json` and `jest.config.ts` configurations to ensure the environment was set up correctly for TypeScript testing.
* **Writing Tests:** For the "Inventory" module, I prompted the AI to help write edge-case tests (e.g., "Write a failing test for when stock is exactly zero") to ensure my TDD cycle was robust.
* **Debugging:** When deploying to Render, I encountered module path errors. I pasted the logs into Gemini to identify the missing build script in `package.json`.




### AI Impact on Workflow
- **Accelerated Development**: AI reduced boilerplate code writing by ~60%
- **Better Code Quality**: AI suggestions improved error handling and type safety
- **Learning Enhancement**: AI explanations helped understand best practices
- **Problem Solving**: Quick debugging assistance for configuration issues

The AI tools significantly enhanced productivity while maintaining code quality and learning opportunities.

## 🚀 Deployment

### Backend Deployment
The backend is configured for deployment on platforms like:
- Render


### Frontend Deployment
The frontend can be deployed on:
- Vercel

## 📄 License

This project is part of a TDD Kata assessment and is for educational purposes.

## 🤝 Contributing

This is an assessment project. Please refer to the original requirements for contribution guidelines.