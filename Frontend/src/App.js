import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useWorker } from './context/WorkerContext';
import JutroLShape from './components/layout/JutroLShape';

// Pages
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Verification from './pages/Verification';

function App() {
    // This now works perfectly because App is INSIDE the WorkerProvider!
    const { worker } = useWorker();

    return (
        <Router>
            {/* IF NOT LOGGED IN: Show only the Auth screen */}
            {!worker ? (
                <Routes>
                    <Route path="*" element={<Auth />} />
                </Routes>
            ) : (
                /* IF LOGGED IN: Show the Jutro Layout and App screens */
                <JutroLShape>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/verification" element={<Verification />} />
                    </Routes>
                </JutroLShape>
            )}
        </Router>
    );
}

export default App;