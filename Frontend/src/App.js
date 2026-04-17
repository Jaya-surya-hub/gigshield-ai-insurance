// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { WorkerProvider, useWorker } from './context/WorkerContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';

// Layout
import JutroLShape from './components/layout/JutroLShape';
import TransitionWrapper from './components/layout/TransitionWrapper';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Verification from './pages/Verification';
import InsurerDashboard from './pages/InsurerDashboard';

const ProtectedRoute = ({ children }) => {
    const { worker } = useWorker();
    if (!worker) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AnimatedRoutes = () => {
    const { worker } = useWorker();
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={<TransitionWrapper>{worker ? <Navigate to="/dashboard" replace /> : <Landing />}</TransitionWrapper>} />
                <Route path="/login" element={<TransitionWrapper>{worker ? <Navigate to="/dashboard" replace /> : <Login />}</TransitionWrapper>} />
                <Route path="/onboarding" element={<TransitionWrapper><Onboarding /></TransitionWrapper>} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <TransitionWrapper><Dashboard /></TransitionWrapper>
                    </ProtectedRoute>
                } />
                <Route path="/verification" element={
                    <TransitionWrapper><Verification /></TransitionWrapper>
                } />

                {/* Admin/Insurer Route */}
                <Route path="/insurer" element={<TransitionWrapper><InsurerDashboard /></TransitionWrapper>} />
            </Routes>
        </AnimatePresence>
    );
};

const AppRoutes = () => {
    return (
        <JutroLShape>
            <AnimatedRoutes />
        </JutroLShape>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <WorkerProvider>
                <LanguageProvider>
                    <Router>
                        <AppRoutes />
                    </Router>
                </LanguageProvider>
            </WorkerProvider>
        </ThemeProvider>
    );
};

export default App;
