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
import Bookmarks from './pages/Bookmarks';
import AdminDashboard from './pages/AdminDashboard';
import PoliceJobFormApp from './PoliceJobFormApp';
import ChatPage from './pages/ChatPage';
import { useAuth } from './hooks/useAuth';
import AppLayout from './components/Common/AppLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminProtectedRoute from './components/Auth/AdminProtectedRoute';
import PublicRoute from './components/Auth/PublicRoute';
import useChatStore from './hooks/useChatStore';
import ChatSidebar from './components/Chat/ChatSidebar';
import { Toaster } from 'react-hot-toast';

// Session storage key for tracking police job form access
const POLICE_FORM_SESSION_KEY = 'police_form_isolated_session';

function App() {
  const currentPath = window.location.pathname;

  // Check if user is authenticated (has a valid token)
  const isAuthenticated = !!localStorage.getItem('token');

  // Check if user has ever accessed the police job form in this session
  const hasAccessedPoliceForm = sessionStorage.getItem(POLICE_FORM_SESSION_KEY) === 'true';

  // If currently on police job form URL
  if (currentPath === '/admin/police-job-form') {
    // If user is NOT authenticated, mark session as isolated (for public users)
    if (!isAuthenticated) {
      sessionStorage.setItem(POLICE_FORM_SESSION_KEY, 'true');
    }
    return <PoliceJobFormApp />;
  }

  // If user is NOT authenticated AND has previously accessed police job form in this session,
  // keep them isolated and show 404 for any other URL
  if (!isAuthenticated && hasAccessedPoliceForm) {
    return <PoliceJobFormApp />;
  }

  // Otherwise, render the main application (for authenticated users or fresh sessions)
  return <MainApp />;
}

function MainApp() {
  const { checkAuth, user, isAuthenticated } = useAuth();
  const { connect, disconnect } = useChatStore();

  // Check authentication status on app load
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Connect to WebSocket when authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token');
      if (token) {
        connect(token);
      }
    } else {
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [isAuthenticated, user, connect, disconnect]);

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
        <Route path="/bookmarks" element={
          <ProtectedRoute>
            <AppLayout><Bookmarks /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <AppLayout><ChatPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AppLayout><AdminDashboard /></AppLayout>
          </AdminProtectedRoute>
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
      <ChatSidebar />
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
