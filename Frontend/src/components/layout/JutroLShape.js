import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

const JutroLShape = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f3f4f6' }}>
            <Header />
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <BottomNav />
                <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default JutroLShape;