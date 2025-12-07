# Homepage Implementation Guide

## 📖 Table of Contents
1. [Setup & Dependencies](#setup--dependencies)
2. [Project Structure](#project-structure)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Animation Code Examples](#animation-code-examples)
5. [Tailwind CSS Setup](#tailwind-css-setup)
6. [Testing & Deployment](#testing--deployment)

---

## 🔧 Setup & Dependencies

### Install Required Packages

```bash
# Navigate to project
cd react-learning

# Install core dependencies
npm install react-router-dom axios react-query zustand

# Install animation library
npm install framer-motion

# Install UI & styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install form & validation
npm install react-hook-form @hookform/resolvers zod

# Install notifications
npm install sonner react-hot-toast

# Install icons
npm install react-icons

# Install utilities
npm install clsx classnames
```

### Verify Installation

```bash
npm list react-router-dom framer-motion tailwindcss
```

---

## 📁 Project Structure

### Create Folder Structure

```bash
# Windows PowerShell
mkdir -p src/components/Common
mkdir -p src/components/Home
mkdir -p src/components/Auth
mkdir -p src/components/Posts
mkdir -p src/components/Comments
mkdir -p src/pages
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/store
mkdir -p src/styles
mkdir -p src/constants
mkdir -p src/utils
```

### Final Structure

```
src/
├── components/
│   ├── Common/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   └── ScrollToTop.jsx
│   ├── Home/
│   │   ├── HeroSection.jsx
│   │   ├── FeaturesSection.jsx
│   │   ├── StatisticsSection.jsx
│   │   ├── CTASection.jsx
│   │   └── HeroAnimation.jsx
│   ├── Auth/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── Posts/
│   │   ├── PostCard.jsx
│   │   ├── PostList.jsx
│   │   └── PostDetail.jsx
│   └── Comments/
│       ├── CommentCard.jsx
│       └── CommentForm.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── NotFound.jsx
│   └── Dashboard.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useApi.js
│   └── useLocalStorage.js
├── services/
│   ├── api.js
│   └── auth.js
├── store/
│   └── authStore.js
├── styles/
│   ├── globals.css
│   ├── animations.css
│   └── tailwind.css
├── constants/
│   └── config.js
├── utils/
│   ├── errorHandler.js
│   └── validators.js
├── App.jsx
└── main.jsx
```

---

## 👨‍💻 Step-by-Step Implementation

### Step 1: Setup Tailwind CSS

**File: `tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',      // Blue
        secondary: '#10B981',    // Green
        accent: '#F59E0B',       // Amber
        dark: '#1F2937',         // Dark gray
        light: '#F9FAFB',        // Light gray
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

**File: `src/styles/globals.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: #f9fafb;
  color: #1f2937;
}

html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
```

### Step 2: Create API Service

**File: `src/services/api.js`**
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const { token } = response.data.data;
        localStorage.setItem('token', token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
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

### Step 3: Create Auth Hook

**File: `src/hooks/useAuth.js`**
```javascript
import { useState, useCallback, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await userAPI.getCurrentUser();
          setUser(response.data.data);
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      const { token, refreshToken, user: userData } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
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
      const { token, refreshToken, user: newUser } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(newUser);
      return newUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
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

  return { user, loading, error, login, register, logout, isAuthenticated: !!user };
};
```

### Step 4: Create Navbar Component

**File: `src/components/Common/Navbar.jsx`**
```javascript
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚛️</span>
          ReactLearning
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/posts" className="nav-link">
            Posts
          </Link>
          <Link to="/users" className="nav-link">
            Users
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">Welcome, {user?.firstName}</span>
              <Link to="/profile" className="btn btn-secondary">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="menu-toggle" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/posts" className="mobile-link" onClick={toggleMenu}>
            Posts
          </Link>
          <Link to="/users" className="mobile-link" onClick={toggleMenu}>
            Users
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="mobile-link" onClick={toggleMenu}>
                Profile
              </Link>
              <button onClick={handleLogout} className="mobile-link">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={toggleMenu}>
                Login
              </Link>
              <Link to="/register" className="mobile-link" onClick={toggleMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
```

**File: `src/components/Common/Navbar.css`**
```css
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: white;
}

.logo-icon {
  font-size: 1.8rem;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}

.navbar-auth {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.user-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.user-name {
  font-size: 0.9rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #10B981;
  color: white;
}

.btn-primary:hover {
  background: #059669;
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.btn-outline:hover {
  background: white;
  color: #667eea;
}

.btn-secondary {
  background: #F59E0B;
  color: white;
}

.btn-danger {
  background: #EF4444;
  color: white;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.mobile-menu {
  background: rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: none;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .navbar-menu {
    display: none;
  }

  .navbar-auth {
    display: none;
  }

  .menu-toggle {
    display: block;
  }

  .mobile-menu.active {
    display: flex;
  }
}
```

---

## 🎬 Animation Code Examples

### Hero Section with Animations

**File: `src/components/Home/HeroSection.jsx`**
```javascript
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'react-icons/hi';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background shapes */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -100, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Hero Content */}
      <motion.div
        className="relative max-w-7xl mx-auto px-4 py-20 h-screen flex items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div>
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 mb-6"
            >
              <Sparkles className="text-yellow-400" size={24} />
              <span className="text-yellow-400 font-semibold">
                Welcome to React Learning
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                React
              </span>
              {' '}Like Never Before
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-300 mb-8 leading-relaxed"
            >
              Learn React by building real-world projects, connect with developers, 
              and grow your skills in an interactive community platform.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex gap-4 flex-wrap"
            >
              <Link
                to="/register"
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Get Started
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                to="/posts"
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-900 transition-all"
              >
                Explore Posts
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-700"
            >
              <div>
                <div className="text-3xl font-bold text-blue-400">1000+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">500+</div>
                <div className="text-gray-400">Tutorials</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-400">10K+</div>
                <div className="text-gray-400">Comments</div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Floating Image */}
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="hidden md:flex justify-center"
          >
            <div className="relative w-80 h-80">
              {/* Floating cards animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl backdrop-blur-xl border border-white/10"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl">⚛️</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-white/50 text-center">
          <div className="text-sm mb-2">Scroll to explore</div>
          <div className="border border-white/30 rounded-full w-6 h-10 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
```

---

## 🏠 Homepage Page

**File: `src/pages/Home.jsx`**
```javascript
import React from 'react';
import Navbar from '../components/Common/Navbar';
import HeroSection from '../components/Home/HeroSection';
import FeaturesSection from '../components/Home/FeaturesSection';
import StatisticsSection from '../components/Home/StatisticsSection';
import CTASection from '../components/Home/CTASection';
import Footer from '../components/Common/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatisticsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;
```

---

## 🚀 Getting Started

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:5173

# 4. Backend should be running on
# http://localhost:8080
```

---

**Next Steps**: Implement FeaturesSection, StatisticsSection, and CTASection following the same pattern.

