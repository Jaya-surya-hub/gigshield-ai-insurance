import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CloudLightning, Wallet, ArrowRight } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '24px 0' }}>
            <div style={{ backgroundColor: '#eff6ff', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px' }}>
                <ShieldCheck size={40} color="#2563eb" />
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                Weather Protection for the Modern Gig Worker
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '40px', lineHeight: '1.6' }}>
                Get instant, zero-touch payouts when severe weather or infrastructure outages disrupt your delivery earnings. Powered by Guidewire & AI.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', textAlign: 'left', marginBottom: '40px' }}>
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <CloudLightning size={24} color="#f59e0b" style={{ flexShrink: 0 }} />
                    <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 'bold' }}>Parametric Triggers</h3>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Payouts trigger automatically when rainfall exceeds your zone's safety limits.</p>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Wallet size={24} color="#10b981" style={{ flexShrink: 0 }} />
                    <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 'bold' }}>Dynamic AI Pricing</h3>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Fair premiums calculated in real-time based on local infrastructure and your GigScore.</p>
                    </div>
                </div>
            </div>

            <button
                onClick={() => navigate('/onboarding')}
                style={{ backgroundColor: '#2563eb', color: 'white', padding: '16px 32px', borderRadius: '8px', fontSize: '1.125rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
            >
                Get Your AI Quote <ArrowRight size={20} />
            </button>
        </div>
    );
};

export default Landing;