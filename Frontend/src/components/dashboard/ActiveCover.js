import React, { useState, useEffect } from 'react';
import { ShieldCheck, CloudRain, Clock, AlertTriangle, Pause, Play, Loader } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { gigShieldAPI } from '../../services/api';
import { useWorker } from '../../context/WorkerContext';

const ActiveCover = ({ premium, tier, zoneId }) => {
    const { t } = useLanguage();
    const { worker } = useWorker();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pausing, setPausing] = useState(false);

    const rainfallThreshold = zoneId?.includes('PEELAMEDU') ? '80mm' : zoneId?.includes('UKKADAM') ? '35mm' : '50mm';

    useEffect(() => {
        const fetchPolicy = async () => {
            if (!worker) return;
            const data = await gigShieldAPI.getWorkerPolicy(worker.id);
            setPolicy(data);
            setLoading(false);
        };
        fetchPolicy();
    }, [worker]);

    const handlePause = async () => {
        if (!policy) return;
        setPausing(true);
        try {
            const result = await gigShieldAPI.pausePolicy(policy.id);
            setPolicy({ ...policy, paused_until: result.paused_until });
        } catch (error) {
            console.error("Failed to pause policy", error);
        } finally {
            setPausing(false);
        }
    };

    const isPaused = policy?.paused_until && new Date(policy.paused_until) > new Date();

    if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}><Loader className="animate-spin" size={24} color="#10b981" /></div>;

    return (
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={20} color={isPaused ? "#9ca3af" : "#10b981"} />
                    {t('activeCoverage')}: {tier} Shield
                </h3>
                <span style={{ color: isPaused ? "#f59e0b" : "#10b981", fontSize: '0.875rem', fontWeight: 'bold' }}>
                    {isPaused ? 'Paused until ' + new Date(policy.paused_until).toLocaleDateString() : 'Active'}
                </span>
            </div>

            <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t('weeklyPremium')}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        ₹{premium?.toFixed(2)} <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>/ week</span>
                    </p>
                </div>
                {!isPaused && (
                    <button 
                        onClick={handlePause}
                        disabled={pausing}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', cursor: pausing ? 'not-allowed' : 'pointer' }}
                    >
                        {pausing ? <Loader size={16} className="animate-spin" /> : <Pause size={16} />}
                        Pause Cover
                    </button>
                )}
            </div>

            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{t('coveredTriggers')}:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <CloudRain size={18} color="#3b82f6" />
                    <span>{t('heavyRainfall')} &gt; {rainfallThreshold} (IFI-Adjusted)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <Clock size={18} color="#f59e0b" />
                    <span>{t('dwellTime')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <AlertTriangle size={18} color="#ef4444" />
                    <span>{t('zoneOutages')}</span>
                </div>
            </div>
        </div>
    );
};

export default ActiveCover;
