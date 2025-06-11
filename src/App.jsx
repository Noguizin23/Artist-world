
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Services from '@/pages/Services';
import CreatePost from '@/pages/CreatePost';
import CreateRequest from '@/pages/CreateRequest';
import ServiceRequests from '@/pages/ServiceRequests';
import Community from '@/pages/Community';
import CreateCommunityPost from '@/pages/CreateCommunityPost';
import SocialPlaceholder from '@/pages/SocialPlaceholder';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen minecraft-bg text-foreground">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/services" element={<Services />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/service-requests" element={<ServiceRequests />} />
            <Route path="/community" element={<Community />} />
            <Route path="/create-community-post" element={<CreateCommunityPost />} />
            <Route path="/social" element={<SocialPlaceholder />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
