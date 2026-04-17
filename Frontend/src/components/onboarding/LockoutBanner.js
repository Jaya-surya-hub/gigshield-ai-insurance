import React from 'react';
import { ShieldAlert, Clock } from 'lucide-react';

const LockoutBanner = ({ lockData }) => {
    if (!lockData || !lockData.enrollment_locked) return null;

    const hours = lockData.hours_remaining || 48;
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);

    return (
        <div style={{ backgroundColor: '#fef2f2', border: '2px solid #f87171', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <ShieldAlert size={28} color='#dc2626' style={{ flexShrink: 0 }} />
                <div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#991b1b', fontSize: '1rem' }}>Enrollment Temporarily Suspended</h3>
                    <p style={{ margin: '0 0 12px 0', color: '#b91c1c', fontSize: '0.875rem' }}>
                        A {lockData.alert_type || 'RED'} weather alert is active for this zone. To protect the community pool, new enrollments are suspended during and 48 hours around active weather alerts.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fee2e2', borderRadius: '8px', padding: '10px 14px', width: 'fit-content' }}>
                        <Clock size={16} color='#991b1b' />
                        <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#991b1b' }}>Enrollment reopens in: {days > 0 ? `${days}d ` : ''}{remainingHours}h</span>
                    </div>
                    <p style={{ margin: '12px 0 0 0', fontSize: '0.75rem', color: '#b91c1c' }}>Existing GigShield members are already covered during this event. Please return after the alert period to activate your shield.</p>
                </div>
            </div>
        </div>
    );
};
export default LockoutBanner;