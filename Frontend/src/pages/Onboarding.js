import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MapPin, Zap, ArrowRight, Loader, Sparkles, CheckCircle } from 'lucide-react';
import { gigShieldAPI } from '../services/api';
import { useWorker } from '../context/WorkerContext';
import { useLanguage } from '../context/LanguageContext';
import LockoutBanner from '../components/onboarding/LockoutBanner';
import UPIMandate from '../components/onboarding/UPIMandate';

const Onboarding = () => {
    const navigate = useNavigate();
    const { loginUser } = useWorker();
    const { t } = useLanguage();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [gpsStatus, setGpsStatus] = useState('');

    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [zone, setZone] = useState('');
    const [zoneList, setZoneList] = useState([]);
    const [quoteData, setQuoteData] = useState(null);
    const [lockoutData, setLockoutData] = useState(null);

    useEffect(() => {
        const fetchZones = async () => {
            const fetchedZones = await gigShieldAPI.getZones();
            setZoneList(fetchedZones);
            if (fetchedZones.length > 0) {
                setZone(fetchedZones[0].id);
            }
        };
        fetchZones();
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleGPSLocation = () => {
        if (!navigator.geolocation) {
            setErrorMsg("Geolocation is not supported by your browser.");
            return;
        }

        setLoading(true);
        setGpsStatus("📡 Acquiring satellites...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;

                let closestZone = null;
                let minDistance = Infinity;

                zoneList.forEach(z => {
                    const dist = calculateDistance(userLat, userLon, z.latitude, z.longitude);
                    if (dist < minDistance) {
                        minDistance = dist;
                        closestZone = z;
                    }
                });

                if (closestZone) {
                    setZone(closestZone.id);
                    setGpsStatus(`📍 Auto-mapped via GPS to nearby zone: ${closestZone.display_name}`);
                }
                setLoading(false);
            },
            (error) => {
                setErrorMsg("Failed to get location. Please enable GPS permissions.");
                setLoading(false);
            }
        );
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1000);
    };

    const handleGetQuote = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setGpsStatus('GPS acquired. Analyzing zone infrastructure...');

        try {
            const data = await gigShieldAPI.getQuote(zone);

            // 🛑 Adverse Selection Check
            if (data.enrollment_locked) {
                setLockoutData(data);
                setLoading(false);
                return; // Halt and show banner
            }

            setGpsStatus('AI analysis complete. Generating your quote...');
            setQuoteData(data);
            setStep(3);
        } catch (error) {
            console.error("Failed to fetch quote", error);
            setErrorMsg('Could not connect. Check your internet connection and try again.');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '24px 0' }}>

            {/* Updated 4-Step Progress Bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                {[1, 2, 3, 4].map(s => (
                    <div key={s} style={{ height: '4px', flex: 1, backgroundColor: step >= s ? '#2563eb' : 'var(--border-color)', borderRadius: '2px' }} />
                ))}
            </div>

            {errorMsg && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.875rem', color: '#991b1b', display: 'flex', gap: '8px' }}>
                    <span>⚠️</span><span>{errorMsg}</span>
                    <button onClick={() => setErrorMsg('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                </div>
            )}

            {step === 1 && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <Shield size={40} color="#2563eb" style={{ marginBottom: '16px' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-primary)' }}>{t('protectEarnings')}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.875rem' }}>{t('enterPhone')}</p>

                    <form onSubmit={handleVerifyOTP}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-secondary)' }}>Phone Number</label>
                            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem' }} />
                        </div>
                        {phone.length > 9 && (
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-secondary)' }}>OTP Code</label>
                                <input type="number" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="1234" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', letterSpacing: '0.25em' }} />
                            </div>
                        )}

                        <button type="submit" disabled={loading || !otp} style={{ width: '100%', minHeight: '52px', padding: '12px', backgroundColor: '#2563eb', color: 'var(--bg-secondary)', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: (loading || !otp) ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {loading ? <Loader className="animate-spin" size={20} /> : 'Verify & Continue'}
                        </button>
                    </form>
                </div>
            )}

            {step === 2 && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <MapPin size={40} color="#2563eb" style={{ marginBottom: '16px' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-primary)' }}>{t('locatePrimaryZone')}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.875rem' }}>Select your operations zone dynamically.</p>

                    <button onClick={handleGPSLocation} style={{ width: '100%', marginBottom: '24px', minHeight: '44px', padding: '10px', backgroundColor: '#e0e7ff', color: '#4338ca', borderRadius: '8px', fontWeight: 'bold', border: '1px solid #c7d2fe', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={18} /> Use My Live GPS Location
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
                        {zoneList.map((z) => (
                            <label key={z.id} style={{ display: 'flex', alignItems: 'center', padding: '16px', border: `2px solid ${zone === z.id ? '#2563eb' : 'var(--border-color)'}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: zone === z.id ? '#eff6ff' : 'var(--bg-secondary)' }}>
                                <input type="radio" name="zone" value={z.id} checked={zone === z.id} onChange={(e) => { setZone(e.target.value); setGpsStatus(''); }} style={{ marginRight: '12px' }} />
                                <div>
                                    <h4 style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-primary)' }}>{z.display_name}</h4>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{z.description}</span>
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* 🛑 Renders the Lockout Banner if a Weather Alert is active */}
                    {lockoutData ? (
                        <LockoutBanner lockData={lockoutData} />
                    ) : (
                        <>
                            <button onClick={handleGetQuote} disabled={loading} style={{ width: '100%', minHeight: '52px', padding: '12px', backgroundColor: '#2563eb', color: 'var(--bg-secondary)', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                {loading ? <Loader className="animate-spin" size={20} /> : <><Sparkles size={20} /> {t('getQuote')}</>}
                            </button>
                            {loading && gpsStatus && <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.875rem', color: '#2563eb', fontWeight: '500' }}>{gpsStatus}</p>}
                        </>
                    )}
                </div>
            )}

            {step === 3 && quoteData && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <Zap size={40} color="#f59e0b" style={{ marginBottom: '16px' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-primary)' }}>{t('yourSmartQuote')}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.875rem' }}>{t('pricedDynamically')} {zone.replace('COIMBATORE_', '')}.</p>

                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)', marginBottom: '16px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('weeklyPremiumLabel')}</p>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-primary)' }}>₹{quoteData.premium.toFixed(2)}</h1>
                    </div>

                    <div style={{ backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Sparkles size={16} color="#7c3aed" />
                            <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 'bold', color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('aiInfraAnalysis')}</h4>
                        </div>
                        <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#4c1d95', lineHeight: '1.5' }}>
                            {quoteData.agent_reasoning}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: '#5b21b6', backgroundColor: '#ede9fe', padding: '6px 10px', borderRadius: '4px', width: 'fit-content' }}>
                            <CheckCircle size={14} />
                            <span>{t('parametricThreshold')}: <strong>&gt; {quoteData.threshold_mm}mm</strong></span>
                        </div>
                    </div>

                    {/* Step 3 advances to Step 4 (UPI Mandate) */}
                    <button onClick={() => setStep(4)} style={{ width: '100%', minHeight: '52px', padding: '16px', backgroundColor: '#10b981', color: 'var(--bg-secondary)', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                        Continue to Payment Setup <ArrowRight size={20} />
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                        Secure checkout via Razorpay Mock.
                    </p>
                </div>
            )}

            {/* Step 4: UPI Mandate Integration */}
            {step === 4 && quoteData && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <UPIMandate
                        premium={quoteData.premium}
                        onComplete={(upiId) => {
                            // Register worker and navigate to dashboard
                            gigShieldAPI.registerWorker(phone, zone).then(result => {
                                loginUser(phone, 'worker', zone, quoteData.premium, quoteData.threshold_mm, result.worker_id);
                                navigate('/dashboard');
                            }).catch(() => {
                                // Fallback: still log user in even if registration call fails
                                loginUser(phone, 'worker', zone, quoteData.premium, quoteData.threshold_mm, 1);
                                navigate('/dashboard');
                            });
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Onboarding;
