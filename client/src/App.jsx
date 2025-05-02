import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import MainPage from './pages/MainPage';
import ChatsPage from './pages/ChatsPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};

export default function App() {
    return (
        <div>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                
                <Route path="/" element={
                    <ProtectedRoute>
                        <MainPage />
                    </ProtectedRoute>
                } />
                
                <Route path="/chats" element={
                    <ProtectedRoute>
                        <ChatsPage />
                    </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
}