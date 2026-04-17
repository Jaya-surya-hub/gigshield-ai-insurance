// src/pages/Landing.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CloudLightning } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Landing = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '50%' }}>
                    <CloudLightning size={48} color="#2563eb" />
                </div>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: '1.2' }}>
                {t('Welcome To Gigshield')}
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.5' }}>
                {t('The parametric insurance')}
            </p>

            {/* 52px Accessible Button [cite: 1530-1536] */}
            <button
                onClick={() => navigate('/onboarding')}
                style={{ width: '100%', minHeight: '52px', backgroundColor: '#2563eb', color: 'var(--bg-secondary)', borderRadius: '8px', border: 'none', fontSize: '1.125rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)', marginBottom: '16px' }}
            >
                <ShieldCheck size={24} />
                Sign Up
            </button>

            <button
                onClick={() => navigate('/login')}
                style={{ width: '100%', minHeight: '52px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '2px solid var(--border-color)', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                Log In
            </button>
        </div>
    );
};

export default Landing;
