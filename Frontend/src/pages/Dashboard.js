import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudLightning, Loader, MapPinOff } from 'lucide-react';
import GigScoreCard from '../components/dashboard/GigScoreCard';
import ActiveCover from '../components/dashboard/ActiveCover';
import ZoneMap from '../components/dashboard/ZoneMap';
import { gigShieldAPI } from '../services/api';
import { useWorker } from '../context/WorkerContext';
import { useTelematics } from '../utils/useTelematics';
import LiveWeather from '../components/dashboard/LiveWeather';
import PayoutHistory from '../components/dashboard/PayoutHistory';

const Dashboard = () => {
    const navigate = useNavigate();
    const { worker } = useWorker();
    const telematics = useTelematics();

    const [isTriggering, setIsTriggering] = useState(false);
    const [demoResult, setDemoResult] = useState(null);

    const handleTriggerStorm = async () => {
        setIsTriggering(true);
        try {
            const payload = {
                zone_id: worker.zone,
                live_lat: telematics.latitude || null,
                live_lon: telematics.longitude || null,
                is_moving: Boolean(telematics.isMoving),
                kinematic_variance: Number(telematics.kinematicVariance) || 0.0
            };


            console.log("Sending Live Hardware Data to AI:", payload);
            const result = await gigShieldAPI.evaluateZone(payload);
            setDemoResult(result);

            if (result.claims_flagged_for_fraud > 0) {
                setTimeout(() => navigate('/verification'), 2000);
            }
        } catch (error) {
            console.error("Backend offline:", error);
            alert("Ensure your FastAPI server is running and CORS is configured!");
        }
        setIsTriggering(false);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>Welcome back, {worker.name}</h1>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Primary Zone: {worker.zone}</p>
            </div>
            <LiveWeather lat={telematics.latitude} lon={telematics.longitude} />
            <GigScoreCard score={worker.gigScore} />
            <ZoneMap zoneId={worker.zone} userLocation={{ lat: telematics.latitude, lon: telematics.longitude, isMoving: telematics.isMoving }} />
            <ActiveCover premium={worker.premium} tier={worker.tier} zoneId={worker.zone} threshold={worker.threshold_mm} />
            <PayoutHistory workerId={worker.id} triggerRefresh={demoResult} />
            <div style={{ marginTop: '48px', padding: '16px', border: '2px dashed #cbd5e1', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase' }}>👨‍💻 Telematics Demo Panel</h4>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', fontSize: '0.75rem' }}>
                    <span style={{ backgroundColor: telematics.latitude ? '#dcfce7' : '#fee2e2', color: telematics.latitude ? '#166534' : '#991b1b', padding: '4px 8px', borderRadius: '4px' }}>
                        GPS: {telematics.latitude ? 'LOCKED' : 'SEARCHING...'}
                    </span>
                    <span style={{ backgroundColor: telematics.isMoving ? '#dbeafe' : '#f1f5f9', color: telematics.isMoving ? '#1e40af' : '#475569', padding: '4px 8px', borderRadius: '4px' }}>
                        ACCELEROMETER: {telematics.isMoving ? 'MOTION DETECTED' : 'STATIONARY'}
                    </span>
                </div>

                <button
                    onClick={handleTriggerStorm}
                    disabled={isTriggering}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#475569', color: 'white', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: isTriggering ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                    {isTriggering ? <Loader className="animate-spin" size={20} /> : <><CloudLightning size={20} /> Trigger Smart Claim</>}
                </button>
            </div>
        </div>
    );
};

export default Dashboard;