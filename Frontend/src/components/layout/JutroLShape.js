import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import { useLocation } from 'react-router-dom';

const JutroLShape = ({ children }) => {
    const location = useLocation();
    const isLanding = location.pathname === '/';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <Header />
            <div className="layout-container">
                {!isLanding && <BottomNav />}
                <main className="main-content" style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default JutroLShape;
