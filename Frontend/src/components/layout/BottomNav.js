// src/components/layout/BottomNav.js
import React from 'react';
import { Home, ShieldAlert, Zap } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? "#2563eb" : "#6b7280";

    return (
        <nav style={{
            backgroundColor: '#ffffff',
            width: '80px',
            borderRight: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '24px',
            gap: '32px'
        }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: isActive('/dashboard') }}>
                <Home size={24} color={isActive('/dashboard')} />
                <span style={{ fontSize: '0.75rem', fontWeight: location.pathname === '/dashboard' ? 'bold' : 'normal' }}>Home</span>
            </Link>

            <Link to="/onboarding" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: isActive('/onboarding') }}>
                <Zap size={24} color={isActive('/onboarding')} />
                <span style={{ fontSize: '0.75rem', fontWeight: location.pathname === '/onboarding' ? 'bold' : 'normal' }}>Quote</span>
            </Link>

            <Link to="/verification" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: isActive('/verification') }}>
                <ShieldAlert size={24} color={isActive('/verification')} />
                <span style={{ fontSize: '0.75rem', fontWeight: location.pathname === '/verification' ? 'bold' : 'normal' }}>Verify</span>
            </Link>
        </nav>
    );
};

export default BottomNav;