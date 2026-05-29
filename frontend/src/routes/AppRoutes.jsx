import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Contacts from '../pages/Contacts.jsx';
import ContactDetails from '../pages/ContactDetails.jsx';
import CreateContact from '../pages/CreateContact.jsx';
import EditContact from '../pages/EditContact.jsx';
import Settings from '../pages/Settings.jsx';
import Login from '../pages/Login.jsx';
import QuickNote from '../pages/QuickNote.jsx';

export default function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/:id" element={<ContactDetails />} />
          <Route path="/contacts/create" element={<CreateContact />} />
          <Route path="/contacts/edit/:id" element={<EditContact />} />
          <Route path="/quick-note" element={<QuickNote />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </Layout>
  );
}
