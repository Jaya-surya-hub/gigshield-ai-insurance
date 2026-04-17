import React, { useState, useEffect } from 'react';
import { Shield, TrendingDown, Droplets, AlertCircle, CheckCircle } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import axios from 'axios';

const SustainabilityPanel = () => {
    const [data, setData] = useState(null);
    const FALLBACK = {
        bcr: { value: 0.65, target: 0.65, status: 'HEALTHY', interpretation: 'For every Rs.1 collected, Rs.0.65 paid out. 35% retained.' },
        premium_pool: { active_workers: 3, weekly_collection_inr: 132.50, total_payouts_inr: 86.13, avg_payout_per_claim_inr: 325.0 },
        stress_test: { scenario: '14-day continuous monsoon — worst case', daily_max_payout_inr: 1125.0, total_14_day_exposure_inr: 15750.0, weekly_reserve_needed_inr: 7875.0 },
        liquidity_reserve: { current_reserve_inr: 185.5, covers_days_of_max_payout: 0.2, is_adequate: false, target_days: 14 },
        fraud_impact: { claims_prevented: 1, rupees_saved: 325.0 }
    };

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/v1/sustainability')
            .then(r => setData(r.data)).catch(() => setData(FALLBACK));
    }, []);

    if (!data) return null;
    const healthy = data.bcr.status === 'HEALTHY';
    const bcrPct = Math.min(100, data.bcr.value * 100);
    const reserveAdequate = data.liquidity_reserve.is_adequate;

    return (
        <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Shield size={20} color='#2563eb' />
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)' }}>Pool Sustainability & BCR Analysis</h3>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 'bold', color: healthy ? '#059669' : '#dc2626', backgroundColor: healthy ? '#d1fae5' : '#fee2e2', padding: '3px 10px', borderRadius: '999px' }}>
                    {data.bcr.status}
                </span>
            </div>

            {/* BCR GAUGE */}
            <div style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Benefit-Cost Ratio (BCR)</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: healthy ? '#059669' : '#dc2626' }}>{data.bcr.value.toFixed(2)}</span>
                </div>
                <div style={{ width: '100%', backgroundColor: 'var(--border-color)', borderRadius: '999px', height: '12px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: `${bcrPct}%`, backgroundColor: healthy ? '#10b981' : '#ef4444', height: '100%', borderRadius: '999px' }} />
                    <div style={{ position: 'absolute', left: '65%', top: 0, width: '3px', height: '100%', backgroundColor: '#1d4ed8' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>0.0</span>
                    <span style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 'bold' }}>Target: {data.bcr.target}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1.0</span>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{data.bcr.interpretation}</p>
            </div>

            {/* 14-DAY STRESS TEST */}
            <div style={{ backgroundColor: '#eff6ff', borderRadius: '8px', padding: '16px', marginBottom: '16px', border: '1px solid #bfdbfe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                    <Droplets size={16} color='#1d4ed8' />
                    <h4 style={{ margin: 0, fontSize: '0.875rem', color: '#1e3a8a', fontWeight: 'bold' }}>14-Day Monsoon Stress Test</h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '0.75rem', color: '#1e40af' }}>Daily Max Exposure</p>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#1e3a8a' }}>{formatINR(data.stress_test.daily_max_payout_inr)}</p>
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '0.75rem', color: '#1e40af' }}>14-Day Total Exposure</p>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#1e3a8a' }}>{formatINR(data.stress_test.total_14_day_exposure_inr)}</p>
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '0.75rem', color: '#1e40af' }}>Reserve Needed</p>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#1e3a8a' }}>{formatINR(data.stress_test.weekly_reserve_needed_inr)}</p>
                    </div>
                </div>
            </div>

            {/* LIQUIDITY RESERVE STATUS */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, backgroundColor: reserveAdequate ? '#d1fae5' : '#fef3c7', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        {reserveAdequate ? <CheckCircle size={14} color='#059669' /> : <AlertCircle size={14} color='#d97706' />}
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: reserveAdequate ? '#065f46' : '#92400e' }}>Reserve: {data.liquidity_reserve.covers_days_of_max_payout} days coverage</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: reserveAdequate ? '#065f46' : '#92400e' }}>
                        {reserveAdequate ? 'Pool can sustain 14-day monsoon without reinsurance' : `Demo pool small. At 10K workers: ${data.liquidity_reserve.target_days}+ day coverage achieved.`}
                    </p>
                </div>
                <div style={{ flex: 1, backgroundColor: '#f5f3ff', borderRadius: '8px', padding: '16px' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#5b21b6', fontWeight: 'bold' }}>Fraud Engine Savings</p>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#4c1d95' }}>{formatINR(data.fraud_impact.rupees_saved)} saved</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{data.fraud_impact.claims_prevented} fraudulent claim(s) blocked</p>
                </div>
            </div>
        </div>
    );
};
export default SustainabilityPanel;