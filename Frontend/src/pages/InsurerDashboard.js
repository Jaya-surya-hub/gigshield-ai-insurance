import React, { useState, useEffect } from 'react';
import { TrendingUp, Shield, AlertTriangle, Users, MapPin, Activity } from 'lucide-react';
import ZoneMap from '../components/dashboard/ZoneMap';
import ActuarialPanel from '../components/dashboard/ActuarialPanel';
import SustainabilityPanel from '../components/dashboard/SustainabilityPanel'; // <-- Phase 3 v3 Addition
import { formatINR } from '../utils/formatters';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

const InsurerDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/stats`).then(res => {
            setStats(res.data); setLoading(false);
        }).catch(() => {
            setStats({
                financials: { weekly_premium_run_rate: 132.50, total_payouts: 325.00, loss_ratio: 245.3 },
                claims: { total_processed: 3, fraud_prevented: 1 },
                zones: { COIMBATORE_PEELAMEDU: 2, COIMBATORE_UKKADAM: 1 }
            });
            setLoading(false);
        });
    }, []);

    if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading insurer analytics...</div>;

    const lossColor = stats.financials.loss_ratio > 100 ? '#dc2626' : '#059669';
    const fraudRate = stats.claims.total_processed > 0
        ? ((stats.claims.fraud_prevented / stats.claims.total_processed) * 100).toFixed(1)
        : '0.0';

    const card = (icon, label, value, subtext, color = 'var(--text-primary)') => (
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {icon}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            </div>
            <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold', color }}>{value}</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtext}</p>
        </div>
    );

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', paddingBottom: '40px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                    Insurer Analytics Dashboard
                </h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
                    GigShield — Guidewire PolicyCenter Integration View
                </p>
            </div>

            {/* KPI ROW */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {card(<TrendingUp size={18} color='#2563eb' />, 'Weekly Premium', formatINR(stats.financials.weekly_premium_run_rate), 'Active policies')}
                {card(<Shield size={18} color='#10b981' />, 'Total Payouts', formatINR(stats.financials.total_payouts), 'Approved claims')}
                {card(<Activity size={18} color={lossColor} />, 'Loss Ratio', `${stats.financials.loss_ratio.toFixed(1)}%`, 'Payouts / Premium ×100', lossColor)}
            </div>

            {/* ZONE MAP */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Zone Coverage Heatmap</h3>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    {Object.entries(stats.zones).map(([zone, count]) => {
                        const isPeel = zone.includes('PEELAMEDU');
                        return (
                            <div key={zone} style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: isPeel ? '#d1fae5' : '#fef3c7', border: `1px solid ${isPeel ? '#6ee7b7' : '#fcd34d'}` }}>
                                <MapPin size={14} color={isPeel ? '#059669' : '#d97706'} />
                                <p style={{ margin: '4px 0 2px 0', fontWeight: 'bold', fontSize: '0.875rem', color: isPeel ? '#065f46' : '#92400e' }}>
                                    {zone.replace('COIMBATORE_', '')}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{count} worker(s) covered</p>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', fontWeight: 'bold', color: isPeel ? '#059669' : '#d97706' }}>
                                    IFI: {isPeel ? '0.78 — Resilient' : '1.32 — Fragile'}
                                </p>
                            </div>
                        );
                    })}
                </div>
                <ZoneMap zoneId='COIMBATORE_PEELAMEDU' userLocation={null} />
            </div>

            {/* THE DEEP ANALYTICS PANELS */}
            <ActuarialPanel />
            <SustainabilityPanel />
        </div>
    );
};

export default InsurerDashboard;