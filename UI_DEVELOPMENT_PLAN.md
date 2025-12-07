# React Learning - UI Development Plan

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Backend Features Summary](#backend-features-summary)
3. [UI Development Roadmap](#ui-development-roadmap)
4. [Technology Stack](#technology-stack)
5. [Phase 1: Homepage with Animations](#phase-1-homepage-with-animations)
6. [Code Standards & Best Practices](#code-standards--best-practices)
7. [Component Structure](#component-structure)
8. [Integration Checklist](#integration-checklist)

---

## 🎯 Project Overview

### Objectives
- Build an attractive, responsive React UI for the React Learning Platform
- Implement all backend API endpoints with proper error handling
- Create animations and smooth user experience
- Follow industry best practices and code standards
- Develop in modular, reusable components

### Target Users
- Students learning React
- Content creators (posts/comments)
- Platform administrators

---

## 🔧 Backend Features Summary

### ✅ Implemented Backend Endpoints (22 Total)

#### **Authentication (4 Endpoints)**
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Refresh JWT token
- `POST /api/v1/auth/logout` - User logout

#### **User Management (8 Endpoints)**
- `GET /api/v1/users` - List all users (paginated)
- `GET /api/v1/users/{id}` - Get user by ID
- `GET /api/v1/users/me` - Get current authenticated user
- `PUT /api/v1/users/{id}` - Update user profile
- `PUT /api/v1/users/{id}/password` - Change password
- `DELETE /api/v1/users/{id}` - Delete user account
- `GET /api/v1/users/{id}/statistics` - User statistics (posts, comments, account age)
- `GET /api/v1/users/search?q=query` - Search users by username/email

#### **Posts Management (6 Endpoints)**
- `POST /api/v1/posts` - Create new post
- `GET /api/v1/posts` - Get all published posts (paginated)
- `GET /api/v1/posts/{id}` - Get post by ID with comments count
- `PUT /api/v1/posts/{id}` - Update post (author only)
- `DELETE /api/v1/posts/{id}` - Delete post (author only)
- `GET /api/v1/users/{userId}/posts` - Get user-specific posts

#### **Comments Management (4 Endpoints)**
- `POST /api/v1/posts/{postId}/comments` - Create comment on post
- `GET /api/v1/posts/{postId}/comments` - Get post comments (paginated)
- `PUT /api/v1/comments/{id}` - Update comment (author only)
- `DELETE /api/v1/comments/{id}` - Delete comment (author only)

### 📊 Data Models

#### **User Entity**
```
- id (Long)
- username (String) - 3-50 chars, alphanumeric + underscore
- email (String) - Valid email format
- password (String) - Encrypted, 8+ chars with uppercase, lowercase, number, special char
- firstName (String) - 2-100 chars
- lastName (String) - 2-100 chars
- phone (String) - 7-15 digits, optional
- avatar (String) - Optional profile picture URL
- role (String) - USER, ADMIN
- status (Enum) - ACTIVE, INACTIVE, SUSPENDED, DELETED
- createdAt (DateTime)
- updatedAt (DateTime)
- deletedAt (DateTime) - For soft deletes
```

#### **Post Entity**
```
- id (Long)
- title (String) - 5-255 chars
- content (String) - 10+ chars
- status (Enum) - DRAFT, PUBLISHED, ARCHIVED
- author (User) - Foreign key to User
- comments (List) - One-to-many relationship
- createdAt (DateTime)
- updatedAt (DateTime)
- deletedAt (DateTime)
```

#### **Comment Entity**
```
- id (Long)
- content (String) - 1-5000 chars
- author (User) - Foreign key
- post (Post) - Foreign key
- createdAt (DateTime)
- updatedAt (DateTime)
- deletedAt (DateTime)
```

### 🔐 Authentication Details
- **JWT Token**: 1-hour expiration
- **Refresh Token**: 7-day expiration
- **Algorithm**: HS256
- **Password Encoding**: BCrypt with salt
- **CORS Enabled**: http://localhost:3000, http://localhost:5173

---

## 🗺️ UI Development Roadmap

### Phase 1: Homepage & Authentication ⭐ (Current)
- **Homepage with animations**
- **Authentication pages (Login/Register)**
- **Navigation bar**
- **Footer**

### Phase 2: User Dashboard
- **User profile page**
- **User settings/profile update**
- **User statistics display**
- **Change password**

### Phase 3: Posts Management
- **Create post page**
- **Post listing with pagination**
- **Post detail view**
- **Edit post (author only)**
- **Delete post (author only)**
- **Post search functionality**

### Phase 4: Comments System
- **Comment display on posts**
- **Add comment form**
- **Edit comment (author only)**
- **Delete comment (author only)**

### Phase 5: User Discovery
- **User search**
- **User profile view**
- **User posts listing**
- **User statistics**

### Phase 6: Advanced Features
- **Notifications**
- **Bookmarks/Favorites**
- **Real-time updates**
- **Admin dashboard**

---

## 🛠️ Technology Stack

### Frontend
```
React: 18.x
Vite: Latest (dev server)
React Router: v6+ (routing)
Axios: HTTP client (API calls)
Tailwind CSS: Styling
Framer Motion: Animations
React Query: Data fetching & caching
Zustand/Redux: State management
React Hook Form: Form handling
Zod/Yup: Form validation
```

### Development Tools
```
ESLint: Code quality
Prettier: Code formatting
Vitest: Unit testing
React Testing Library: Component testing
```

---

## 🏠 Phase 1: Homepage with Animations

### 1.1 Component Hierarchy
```
App.jsx
├── Layout/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── Layout.jsx (wrapper)
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── NotFound.jsx
├── components/
│   ├── Hero/
│   │   ├── HeroSection.jsx (animated banner)
│   │   ├── HeroAnimation.jsx (hero animations)
│   │   └── HeroContent.jsx
│   ├── Features/
│   │   ├── FeaturesSection.jsx (feature cards)
│   │   └── FeatureCard.jsx (individual card with animation)
│   ├── Stats/
│   │   ├── StatsSection.jsx (platform statistics)
│   │   └── StatCounter.jsx (animated number counter)
│   ├── CTA/
│   │   └── CTASection.jsx (call to action)
│   └── Auth/
│       ├── LoginForm.jsx
│       └── RegisterForm.jsx
└── styles/
    └── animations.css
```

### 1.2 Homepage Sections

#### **Section 1: Hero Section (With Animations)**
```
- Full-width banner with gradient background
- Animated title text (fade-in, scale)
- Animated tagline (stagger animation)
- Hero image/illustration (parallax effect)
- CTA buttons (hover animations)
- Background animated shapes/particles
```

**Animations to Include:**
- Text fade-in with stagger
- Smooth scale-up on load
- Parallax scrolling
- Gradient animation
- Button hover effects (glow, scale)

#### **Section 2: Features Section**
```
- Feature cards grid (responsive)
- Each card shows:
  - Icon (animated on hover)
  - Title
  - Description
  - Learn more link
- Card animations on scroll (fade-in, slide-up)
```

#### **Section 3: Statistics Section**
```
- Display platform stats:
  - Total Users
  - Total Posts
  - Total Comments
  - Active Daily Users
- Animated counters (count-up animation)
- Icons with rotation animation
```

#### **Section 4: Call-to-Action Section**
```
- Encourage user registration/login
- Testimonials carousel
- Animated background
```

#### **Section 5: Footer**
```
- Links
- Social media
- Copyright
```

### 1.3 Animation Details

**Using Framer Motion:**

1. **Text Animations**
   - Fade-in with opacity
   - Scale animation (small → normal)
   - Stagger children
   - Slide-in from top/sides

2. **Card Animations**
   - Fade-in on scroll (Intersection Observer)
   - Slide-up with bounce
   - Hover: scale + shadow

3. **Interactive Animations**
   - Button hover: glow effect, scale
   - Links: underline animation
   - Smooth transitions

4. **Page Load**
   - Hero content sequential animation
   - Features stagger animation
   - Stats counter animation

### 1.4 Responsive Design
```
Mobile (< 640px):
- Single column layout
- Smaller font sizes
- Compact spacing
- Touch-friendly buttons (48px min)

Tablet (640px - 1024px):
- 2 column grid
- Medium font sizes
- Adjusted spacing

Desktop (> 1024px):
- 3-4 column grid
- Full animations
- Optimized spacing
```

---

## 📝 Code Standards & Best Practices

### 1. File Structure
```
src/
├── components/          # Reusable components
│   ├── Common/         # Shared components (Navbar, Footer, etc.)
│   ├── Home/           # Homepage specific components
│   ├── Auth/           # Auth components
│   ├── Posts/          # Post components
│   └── Comments/       # Comment components
├── pages/              # Page components (routed)
├── hooks/              # Custom React hooks
├── services/           # API calls, utilities
├── store/              # State management (Zustand/Redux)
├── styles/             # Global styles, animations
├── constants/          # Constants, config
├── types/              # TypeScript types (if using TS)
└── utils/              # Utility functions
```

### 2. Component Template

```jsx
// components/Home/HeroSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './HeroSection.css';

/**
 * HeroSection Component
 * Displays attractive hero banner with animations
 * 
 * @component
 * @example
 * return <HeroSection />
 */
const HeroSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  return (
    <motion.section
      className="hero-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants} className="hero-title">
        Welcome to React Learning Platform
      </motion.h1>
      <motion.p variants={itemVariants} className="hero-subtitle">
        Master React with interactive lessons and community projects
      </motion.p>
      <motion.div variants={itemVariants} className="hero-buttons">
        {/* Buttons */}
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
```

### 3. Naming Conventions
```
Components: PascalCase (HeroSection.jsx)
Files: PascalCase for components, camelCase for utilities
Functions: camelCase (handleClick, fetchUsers)
Constants: UPPER_SNAKE_CASE (API_BASE_URL)
CSS Classes: kebab-case (.hero-section, .button-primary)
Variables: camelCase (userName, isLoading)
```

### 4. API Service Example

```javascript
// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: (token) => apiClient.post('/auth/logout', { token }),
  refreshToken: (refreshToken) => 
    apiClient.post('/auth/refresh-token', { refreshToken }),
};

// User APIs
export const userAPI = {
  getAll: (page = 0, size = 10) => 
    apiClient.get('/users', { params: { page, size } }),
  getById: (id) => apiClient.get(`/users/${id}`),
  getCurrentUser: () => apiClient.get('/users/me'),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  changePassword: (id, data) => 
    apiClient.put(`/users/${id}/password`, data),
  delete: (id) => apiClient.delete(`/users/${id}`),
  search: (query, page = 0, size = 10) => 
    apiClient.get('/users/search', { params: { q: query, page, size } }),
  getStatistics: (id) => apiClient.get(`/users/${id}/statistics`),
};

// Post APIs
export const postAPI = {
  create: (data) => apiClient.post('/posts', data),
  getAll: (page = 0, size = 10) => 
    apiClient.get('/posts', { params: { page, size } }),
  getById: (id) => apiClient.get(`/posts/${id}`),
  update: (id, data) => apiClient.put(`/posts/${id}`, data),
  delete: (id) => apiClient.delete(`/posts/${id}`),
  getByUserId: (userId, page = 0, size = 10) => 
    apiClient.get(`/users/${userId}/posts`, { params: { page, size } }),
  search: (query, page = 0, size = 10) => 
    apiClient.get('/posts/search', { params: { q: query, page, size } }),
};

// Comment APIs
export const commentAPI = {
  create: (postId, data) => 
    apiClient.post(`/posts/${postId}/comments`, data),
  getByPostId: (postId, page = 0, size = 10) => 
    apiClient.get(`/posts/${postId}/comments`, { params: { page, size } }),
  update: (id, data) => apiClient.put(`/comments/${id}`, data),
  delete: (id) => apiClient.delete(`/comments/${id}`),
};

export default apiClient;
```

### 5. Custom Hooks Example

```javascript
// hooks/useAuth.js
import { useState, useCallback } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      setUser(response.data.data);
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(userData);
      setUser(response.data.data);
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }, []);

  return { user, loading, error, login, register, logout };
};
```

### 6. Error Handling Pattern

```javascript
// Utils for error handling
export const handleApiError = (error) => {
  if (error.response) {
    // Server error
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      errors: error.response.data?.error?.details,
    };
  } else if (error.request) {
    // Network error
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
    };
  } else {
    // Other errors
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
    };
  }
};
```

### 7. Form Validation

```javascript
// Using React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    // Handle login
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password')} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
};
```

---

## 🏗️ Component Structure

### Phase 1 Components (Homepage)

#### 1. **Navbar Component**
```
Features:
- Logo with home link
- Navigation links (Home, About, Docs)
- Auth buttons (Login/Register) - unauthenticated
- User dropdown (Profile, Settings, Logout) - authenticated
- Mobile menu toggle
- Smooth scroll navbar
```

#### 2. **Hero Section Component**
```
Features:
- Animated background
- Fade-in title text
- Stagger subtitle
- CTA buttons with hover effects
- Animated background shapes
```

#### 3. **Features Section Component**
```
Features:
- 3-4 feature cards grid
- Icons with animations
- Hover effects (lift, scale, shadow)
- Responsive layout
```

#### 4. **Statistics Section Component**
```
Features:
- Count-up animation for numbers
- Icons with rotation
- Platform stats display
```

#### 5. **Authentication Components**
```
LoginForm:
- Email input
- Password input
- Remember me checkbox
- Forgot password link
- Submit button
- Sign up link

RegisterForm:
- Username input
- Email input
- Password input (with strength indicator)
- Confirm password
- First name, Last name
- Phone (optional)
- Terms checkbox
- Submit button
- Login link
```

#### 6. **Footer Component**
```
Features:
- Links sections (Product, Company, Resources)
- Social media links
- Newsletter signup
- Copyright
```

---

## ✅ Integration Checklist

### Backend Integration Tasks
- [ ] Set up API base URL constant
- [ ] Create API service layer
- [ ] Implement axios interceptors for auth token
- [ ] Add token refresh logic
- [ ] Handle 401 unauthorized responses
- [ ] Add loading states
- [ ] Add error messages display
- [ ] Add request/response logging

### Authentication Integration
- [ ] Register endpoint integration
- [ ] Login endpoint integration
- [ ] Token storage (localStorage/sessionStorage)
- [ ] Auto-login on page load
- [ ] Logout functionality
- [ ] Protected routes
- [ ] Role-based access control

### Frontend Validation
- [ ] Form validation setup
- [ ] Field-level error messages
- [ ] Password strength indicator
- [ ] Email validation
- [ ] Username validation

### Error Handling
- [ ] Global error boundary
- [ ] Toast notifications
- [ ] Form submission errors
- [ ] Network error handling
- [ ] 404 page
- [ ] 500 error page

---

## 📦 Dependencies to Install

```bash
npm install react-router-dom axios react-query zustand
npm install framer-motion
npm install -D tailwindcss postcss autoprefixer
npm install react-hook-form @hookform/resolvers zod
npm install sonner react-hot-toast  # For notifications
npm install react-icons            # For icons
npm install clsx classnames         # For conditional classes
```

---

## 🚀 Getting Started

### Step 1: Project Setup
```bash
cd react-learning
npm install
# Install above dependencies
```

### Step 2: Create Folder Structure
```bash
mkdir -p src/components/{Common,Home,Auth,Posts,Comments}
mkdir -p src/pages
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/store
mkdir -p src/styles
mkdir -p src/constants
mkdir -p src/utils
```

### Step 3: Start Development
```bash
npm run dev
# Backend should be running on http://localhost:8080
```

---

## 📚 References

- [React Documentation](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [React Hook Form](https://react-hook-form.com/)

---

## 🔄 Development Workflow

1. **Plan**: Read this document carefully
2. **Setup**: Install dependencies and create folder structure
3. **Component**: Create component with JSX
4. **Style**: Add Tailwind classes and animations
5. **Test**: Test component locally
6. **Integrate**: Connect to backend API
7. **Review**: Check code standards
8. **Document**: Add comments and JSDoc

---

**Last Updated**: December 7, 2025  
**Status**: 🟢 Ready for Development  
**Next Phase**: Homepage Development

