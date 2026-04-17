import React, { useState } from 'react';
import { Smartphone, CheckCircle, Loader, Lock, IndianRupee } from 'lucide-react';

const UPIMandate = ({ premium, onComplete }) => {
    const [upiId, setUpiId] = useState('');
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const isValidUPI = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(upiId);

    const handleSetupMandate = () => {
        if (!isValidUPI) { setError('Please enter a valid UPI ID (e.g., ramesh@ybl)'); return; }
        setError('');
        setStatus('verifying');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => onComplete(upiId), 1500);
        }, 1500);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            {status !== 'success' ? (
                <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <Smartphone size={24} color='#2563eb' />
                        <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-primary)' }}>Set Up UPI Auto-Pay</h3>
                    </div>
                    <div style={{ backgroundColor: '#eff6ff', borderRadius: '8px', padding: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.875rem', color: '#1e40af' }}>Weekly Deduction</span>
                        <span style={{ fontWeight: 'bold', color: '#1d4ed8', fontSize: '1rem' }}>₹{premium?.toFixed(2)} every Sunday midnight</span>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>Your UPI ID</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${error ? '#ef4444' : 'var(--border-hover)'}`, borderRadius: '8px', padding: '10px 12px' }}>
                            <IndianRupee size={18} color='#9ca3af' style={{ marginRight: '8px' }} />
                            <input type='text' value={upiId} onChange={e => setUpiId(e.target.value)} placeholder='ramesh@ybl / ramesh@okaxis' style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }} />
                        </div>
                        {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '6px' }}>{error}</p>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '12px', marginBottom: '20px' }}>
                        <Lock size={14} color='var(--text-muted)' style={{ marginTop: '2px', flexShrink: 0 }} />
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Powered by Razorpay. ₹{premium?.toFixed(2)} will be auto-deducted every Sunday. You can pause up to 2 times per year. No cancellation penalty.</p>
                    </div>
                    <button onClick={handleSetupMandate} disabled={!isValidUPI || status === 'verifying'} style={{ width: '100%', minHeight: '52px', padding: '12px', backgroundColor: isValidUPI ? '#10b981' : '#9ca3af', color: 'var(--bg-secondary)', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: isValidUPI ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                        {status === 'verifying' ? <><Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> Connecting to Razorpay...</> : 'Authorize ₹' + premium?.toFixed(2) + '/week via UPI'}
                    </button>
                </div>
            ) : (
                <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #34d399', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
                    <CheckCircle size={56} color='#10b981' style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ color: '#065f46', marginBottom: '8px' }}>UPI Mandate Activated!</h3>
                    <p style={{ color: '#047857', fontSize: '0.875rem', margin: '0 0 8px 0' }}>Auto-deduction of ₹{premium?.toFixed(2)} set up for {upiId}</p>
                    <p style={{ color: '#047857', fontSize: '0.875rem', margin: 0 }}>First deduction: Sunday midnight. Coverage active now.</p>
                </div>
            )}
        </div>
    );
};
export default UPIMandate;