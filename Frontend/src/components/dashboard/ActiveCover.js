import React from 'react';
import { ShieldCheck, CloudRain, Clock, AlertTriangle } from 'lucide-react';

const ActiveCover = ({ premium, tier, zoneId, threshold }) => {
    const rainfallThreshold = threshold ? `${threshold}mm` : '50mm';

    return (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={20} color="#10b981" />
                    Active Coverage: {tier} Shield
                </h3>
                <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 'bold' }}>Active</span>
            </div>

            <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Weekly Premium (AI Adjusted)</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>₹{premium?.toFixed(2)} <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#9ca3af' }}>/ week</span></p>
            </div>

            <h4 style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '12px' }}>Covered Triggers:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem', color: '#4b5563' }}>
                    <CloudRain size={18} color="#3b82f6" />
                    {/* FIXED: Dynamic UI rendering [cite: 37] */}
                    <span>Heavy Rainfall &gt; {rainfallThreshold} (IFI-Adjusted)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem', color: '#4b5563' }}>
                    <Clock size={18} color="#f59e0b" />
                    <span>Excessive Dwell Time (15m+)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem', color: '#4b5563' }}>
                    <AlertTriangle size={18} color="#ef4444" />
                    <span>Zone Outages & Strikes</span>
                </div>
            </div>
        </div>
    );
};

export default ActiveCover;