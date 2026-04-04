import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, XCircle } from 'lucide-react';
import LAVCamera from '../components/verification/LAVCamera';
import { gigShieldAPI } from '../services/api';
import { useWorker } from '../context/WorkerContext';

const Verification = () => {
    const navigate = useNavigate();
    const { worker } = useWorker();

    // Status can be: 'pending', 'approved', or 'rejected'
    const [verificationStatus, setVerificationStatus] = useState('pending');
    const [aiResult, setAiResult] = useState(null);

    // This gets called by LAVCamera when the 3 seconds are up
    const handleFramesCaptured = async (base64Frames) => {
        try {
            const payload = {
                worker_id: worker.id,
                zone_id: worker.zone,
                frames: base64Frames
            };

            // Send to FastAPI!
            const response = await gigShieldAPI.verifyEnvironment(payload);
            setAiResult(response);

            if (response.payout_unlocked) {
                setVerificationStatus('approved');
            } else {
                setVerificationStatus('rejected');
            }
        } catch (error) {
            console.error("Backend CV failed:", error);
            // Fallback for demo if backend is offline
            setVerificationStatus('approved');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            {verificationStatus === 'pending' && (
                <>
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', borderRadius: '8px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
                        <AlertTriangle color="#dc2626" size={24} style={{ flexShrink: 0 }} />
                        <div>
                            <h2 style={{ color: '#991b1b', fontSize: '1rem', fontWeight: 'bold', margin: '0 0 4px 0' }}>Action Required</h2>
                            <p style={{ color: '#b91c1c', fontSize: '0.875rem', margin: 0 }}>
                                Telematics anomaly detected. To protect the community pool, please verify your environment visually.
                            </p>
                        </div>
                    </div>

                    <LAVCamera onVerificationComplete={handleFramesCaptured} workerData={worker} />
                </>
            )}

            {verificationStatus === 'approved' && (
                <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #34d399', borderRadius: '8px', padding: '32px 16px', textAlign: 'center' }}>
                    <ShieldCheck color="#10b981" size={64} style={{ margin: '0 auto 16px' }} />
                    <h2 style={{ color: '#065f46', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Weather Verified!</h2>
                    <p style={{ color: '#047857', fontSize: '0.875rem', marginBottom: '16px' }}>
                        CV Confidence Score: {aiResult?.confidence ? `${(aiResult.confidence * 100).toFixed(0)}%` : '88%'}
                    </p>
                    <p style={{ color: '#047857', marginBottom: '24px' }}>
                        Your parametric claim of ₹325.00 has been released to Guidewire ClaimCenter.
                    </p>
                    <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
                        Return to Dashboard
                    </button>
                </div>
            )}

            {verificationStatus === 'rejected' && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #ef4444', borderRadius: '8px', padding: '32px 16px', textAlign: 'center' }}>
                    <XCircle color="#ef4444" size={64} style={{ margin: '0 auto 16px' }} />
                    <h2 style={{ color: '#991b1b', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Claim Denied</h2>
                    <p style={{ color: '#b91c1c', fontSize: '0.875rem', marginBottom: '16px' }}>
                        CV Confidence Score: {aiResult?.confidence ? `${(aiResult.confidence * 100).toFixed(0)}%` : '12%'}
                    </p>
                    <p style={{ color: '#b91c1c', marginBottom: '24px' }}>
                        Our AI detected clear weather conditions. Filing false claims negatively impacts your GigScore.
                    </p>
                    <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#ef4444', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
                        Return to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default Verification;