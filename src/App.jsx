import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetailPage from './pages/PostDetailPage';
import UserSearch from './pages/UserSearch';
import UserProfile from './pages/UserProfile';
import { useAuth } from './hooks/useAuth';
import AppLayout from './components/Common/AppLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import PublicRoute from './components/Auth/PublicRoute';

function App() {
  const { checkAuth } = useAuth();

  // Check authentication status on app load
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout><Home /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/posts" element={
          <ProtectedRoute>
            <AppLayout><Posts /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/posts/create" element={
          <ProtectedRoute>
            <AppLayout><CreatePost /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/posts/:id" element={
          <ProtectedRoute>
            <AppLayout><PostDetailPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/posts/:id/edit" element={
          <ProtectedRoute>
            <AppLayout><EditPost /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <AppLayout><UserSearch /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/users/:id" element={
          <ProtectedRoute>
            <AppLayout><UserProfile /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
