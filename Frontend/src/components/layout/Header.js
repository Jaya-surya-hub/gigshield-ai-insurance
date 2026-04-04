import React from 'react';
import { Shield, User, LogOut } from 'lucide-react';
import { useWorker } from '../../context/WorkerContext';

const Header = () => {
    const { worker, logoutUser } = useWorker();

    return (
        <header style={{ backgroundColor: '#ffffff', padding: '16px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={28} color="#2563eb" />
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    GigShield <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#6b7280' }}>by Jutro</span>
                </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right', display: 'none', '@media (min-width: 640px)': { display: 'block' } }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 'bold' }}>{worker?.name || "Guest"}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: worker?.isActive ? '#059669' : '#dc2626' }}>
                        Status: {worker?.isActive ? 'Active' : 'Inactive'}
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <User size={16} />
                    </div>
                    {/* Logout Button */}
                    <button onClick={logoutUser} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#ef4444' }} title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;