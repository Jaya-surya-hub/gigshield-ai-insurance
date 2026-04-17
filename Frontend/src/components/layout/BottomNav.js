// src/components/layout/BottomNav.js
import React from 'react';
import { Home, ShieldAlert, Zap } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? "var(--accent-color)" : "var(--text-muted)";

    return (
        <nav className="bottom-nav">
            <Link to="/dashboard" className="bottom-nav-link" style={{ color: isActive('/dashboard') }}>
                <Home size={24} color={isActive('/dashboard')} />
                <span style={{ fontSize: '0.75rem', fontWeight: location.pathname === '/dashboard' ? 'bold' : 'normal' }}>Home</span>
            </Link>

            <Link to="/onboarding" className="bottom-nav-link" style={{ color: isActive('/onboarding') }}>
                <Zap size={24} color={isActive('/onboarding')} />
                <span style={{ fontSize: '0.75rem', fontWeight: location.pathname === '/onboarding' ? 'bold' : 'normal' }}>Quote</span>
            </Link>

            <Link to="/verification" className="bottom-nav-link" style={{ color: isActive('/verification') }}>
                <ShieldAlert size={24} color={isActive('/verification')} />
                <span style={{ fontSize: '0.75rem', fontWeight: location.pathname === '/verification' ? 'bold' : 'normal' }}>Verify</span>
            </Link>
        </nav>
    );
};

export default BottomNav;
