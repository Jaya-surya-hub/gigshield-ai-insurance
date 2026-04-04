import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MapPin, Zap, ArrowRight, Loader, Sparkles, CheckCircle } from 'lucide-react';
import { gigShieldAPI } from '../services/api';
import { useWorker } from '../context/WorkerContext';

const Onboarding = () => {
    const navigate = useNavigate();
    const { loginUser } = useWorker();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [zone, setZone] = useState('COIMBATORE_PEELAMEDU');
    const [quoteData, setQuoteData] = useState(null);

    // Step 1 -> 2
    const handleVerifyOTP = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1000);
    };

    // Step 2 -> 3 (Fetch Quote + AI Reasoning via GPS)
    const handleLocateAndQuote = () => {
        setLoading(true);
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Reverse geocode via OSM Nominatim
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const json = await res.json();

                    const city = json.address.city || json.address.town || json.address.village || 'COIMBATORE';
                    const neighborhood = json.address.suburb || json.address.neighbourhood || 'AREA';

                    const determinedZone = `${city.toUpperCase()}_${neighborhood.toUpperCase()}`.replace(/\s+/g, '');
                    setZone(determinedZone);

                    // Fetch dynamic quote directly with the real-world zone
                    const data = await gigShieldAPI.getQuote(determinedZone);
                    setQuoteData(data);
                    setStep(3);
                } catch (error) {
                    console.error("Geocoding or fetch failed", error);
                    alert("Backend offline. Ensure FastAPI is running.");
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.error("GPS Error:", error);
                alert("GPS access denied! Using fallback zone.");
                gigShieldAPI.getQuote('COIMBATORE_PEELAMEDU').then(data => {
                    setZone('COIMBATORE_PEELAMEDU');
                    setQuoteData(data);
                    setStep(3);
                }).finally(() => setLoading(false));
            }
        );
    };

    // Step 3 -> Dashboard (Activate)
    const activatePolicy = () => {
        loginUser("Ramesh K.", "demo_password", zone, quoteData?.premium, quoteData?.threshold_mm);
        navigate('/dashboard');
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '24px 0' }}>

            {/* Progress Bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                <div style={{ height: '4px', flex: 1, backgroundColor: step >= 1 ? '#2563eb' : '#e5e7eb', borderRadius: '2px' }} />
                <div style={{ height: '4px', flex: 1, backgroundColor: step >= 2 ? '#2563eb' : '#e5e7eb', borderRadius: '2px' }} />
                <div style={{ height: '4px', flex: 1, backgroundColor: step >= 3 ? '#2563eb' : '#e5e7eb', borderRadius: '2px' }} />
            </div>

            {/* STEP 1: Phone & OTP */}
            {step === 1 && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <Shield size={40} color="#2563eb" style={{ marginBottom: '16px' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Protect your earnings</h2>
                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>Enter your phone number to check eligibility.</p>

                    <form onSubmit={handleVerifyOTP}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px' }}>Phone Number</label>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem' }}
                            />
                        </div>
                        {phone.length > 9 && (
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px' }}>OTP Code</label>
                                <input
                                    type="number"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="1234"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', letterSpacing: '0.25em' }}
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading || !otp}
                            style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: (loading || !otp) ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            {loading ? <Loader className="animate-spin" size={20} /> : 'Verify & Continue'}
                        </button>
                    </form>
                </div>
            )}

            {/* STEP 2: Zone Selection (GPS) */}
            {step === 2 && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <MapPin size={40} color="#2563eb" style={{ marginBottom: '16px' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Locate Primary Zone</h2>
                    <p style={{ color: '#6b7280', margin: '0 0 24px 0' }}>We use your GPS to determine your primary delivery area and assess infrastructure risk.</p>

                    <button
                        onClick={handleLocateAndQuote}
                        disabled={loading}
                        style={{ width: '100%', padding: '16px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '1rem' }}
                    >
                        {loading ? <Loader className="animate-spin" size={24} /> : <><MapPin size={24} /> Acquire GPS & Generate Quote</>}
                    </button>
                    {loading && <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.875rem', color: '#6b7280' }}>Fetching coordinates and AI analysis...</p>}
                </div>
            )}

            {/* STEP 3: AI Quote & Reasoning */}
            {step === 3 && quoteData && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <Zap size={40} color="#f59e0b" style={{ marginBottom: '16px' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Your Smart Quote</h2>
                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>Priced dynamically for {zone.replace('COIMBATORE_', '')}.</p>

                    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '16px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.875rem' }}>Weekly Premium</p>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#1f2937' }}>₹{quoteData.premium.toFixed(2)}</h1>
                    </div>

                    {/* ✨ THE NEW AI AGENT REASONING UI ✨ */}
                    <div style={{ backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Sparkles size={16} color="#7c3aed" />
                            <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 'bold', color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Infrastructure Analysis</h4>
                        </div>
                        <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#4c1d95', lineHeight: '1.5' }}>
                            {quoteData.agent_reasoning}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#5b21b6', backgroundColor: '#ede9fe', padding: '6px 10px', borderRadius: '4px', width: 'fit-content' }}>
                            <CheckCircle size={14} />
                            <span>Pariometric Threshold set to: <strong>&gt; {quoteData.threshold_mm}mm rain</strong></span>
                        </div>
                    </div>

                    <button
                        onClick={activatePolicy}
                        style={{ width: '100%', padding: '16px', backgroundColor: '#10b981', color: 'white', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '1.125rem' }}
                    >
                        Pay & Activate Shield <ArrowRight size={20} />
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginTop: '12px' }}>
                        Secure checkout via Razorpay Mock.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Onboarding;