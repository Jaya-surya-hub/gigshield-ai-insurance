import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Loader, MapPin, Smartphone } from 'lucide-react';
import GigScoreCard from '../components/dashboard/GigScoreCard';
import ActiveCover from '../components/dashboard/ActiveCover';
import ZoneMap from '../components/dashboard/ZoneMap';
import LiveWeather from '../components/dashboard/LiveWeather';
import PayoutHistory from '../components/dashboard/PayoutHistory';
import AdminSimulator from '../components/dashboard/AdminSimulator';
import { useWorker } from '../context/WorkerContext';
import { useTelematics } from '../utils/useTelematics';
import { gigShieldAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext'; // <-- Added Translation Hook

const Dashboard = () => {
    const { worker } = useWorker();
    const telematics = useTelematics();
    const navigate = useNavigate();
    const { t } = useLanguage(); // <-- Added Translation Hook

    const [isTriggering, setIsTriggering] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [buddyVerification, setBuddyVerification] = useState(null);

    useEffect(() => {
        if (!worker) navigate('/');
    }, [worker, navigate]);

    if (!worker) return null;

    const handleTriggerStorm = async () => {
        setIsTriggering(true);
        setErrorMsg('');
        setBuddyVerification(null);
        try {
            const payload = {
                zone_id: worker.zone,
                live_lat: telematics.latitude,
                live_lon: telematics.longitude,
                is_moving: telematics.isMoving,
                kinematic_variance: telematics.kinematicVariance
            };

            const response = await gigShieldAPI.evaluateZone(payload);

            if (response.claims_flagged_for_fraud > 0) {
                setTimeout(() => navigate('/verification'), 2000);
            } else if (response.claims_initiated > 0) {
                setBuddyVerification(response.claims_initiated);
                setTimeout(() => window.location.reload(), 4000);
            } else {
                setTimeout(() => window.location.reload(), 2000);
            }
        } catch (error) {
            console.error("Evaluation failed", error);
            setErrorMsg('Could not connect to the evaluation engine. Check your connection.');
        } finally {
            setIsTriggering(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '32px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                    {t('welcome')}, {worker.name}
                </h1>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    {t('primaryZone')}: {
                        worker.zone
                            ? worker.zone.replace('COIMBATORE_', '').replace('CHENNAI_', '').replace('BANGALORE_', '') || worker.zone
                            : 'Zone not set'
                    }
                </p>
            </div>

            {errorMsg && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.875rem', color: '#991b1b', display: 'flex', gap: '8px' }}>
                    <span>⚠️</span><span>{errorMsg}</span>
                    <button onClick={() => setErrorMsg('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                </div>
            )}

            {buddyVerification && (
                <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #10b981', borderRadius: '12px', padding: '16px', marginBottom: '24px', animation: 'bounceIn 0.5s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ backgroundColor: '#10b981', color: 'var(--bg-secondary)', padding: '10px', borderRadius: '50%', display: 'flex' }}>
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, color: '#065f46', fontSize: '1rem', fontWeight: 'bold' }}>Buddy Verification Complete</h4>
                            <p style={{ margin: '2px 0 0 0', color: '#047857', fontSize: '0.875rem' }}>
                                <strong>{buddyVerification} workers</strong> in your zone confirmed the same disruption. Claim approved.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <LiveWeather lat={telematics.latitude} lon={telematics.longitude} />
            <GigScoreCard score={worker.gigScore} />
            <ZoneMap zoneId={worker.zone} userLocation={{ lat: telematics.latitude, lon: telematics.longitude, isMoving: telematics.isMoving }} />
            <ActiveCover premium={worker.premium} tier={worker.tier} zoneId={worker.zone} />
            <PayoutHistory workerId={worker.id} />

            <AdminSimulator zoneId={worker.zone} />

            {/* DEMO PANEL */}
            <div style={{ marginTop: '32px', padding: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px dashed var(--border-hover)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <ShieldAlert size={20} color="#64748b" />
                    <h3 style={{ margin: 0, fontSize: '0.875rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>Judge / Admin Panel</h3>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={16} color={telematics.latitude ? "#10b981" : "#94a3b8"} />
                        <span style={{ color: telematics.latitude ? "#059669" : "#64748b" }}>
                            {telematics.latitude ? t('gpsLocked') : t('gpsSearching')}
                        </span>
                    </div>
                    <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Smartphone size={16} color={telematics.isMoving ? "#3b82f6" : "#f59e0b"} />
                        <span style={{ color: telematics.isMoving ? "#2563eb" : "#d97706" }}>
                            {telematics.isMoving ? t('motionDetected') : t('stationary')}
                        </span>
                    </div>
                </div>

                {/* Accessible 52px Button [cite: 1530-1536] */}
                <button
                    onClick={handleTriggerStorm}
                    disabled={isTriggering}
                    style={{ width: '100%', minHeight: '52px', backgroundColor: '#0f172a', color: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: isTriggering ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '1rem' }}
                >
                    {isTriggering ? <Loader size={18} className="animate-spin" /> : <ShieldAlert size={18} />}
                    {t('triggerSmartClaim')}
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
