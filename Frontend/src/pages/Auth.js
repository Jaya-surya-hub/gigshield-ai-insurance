import React, { useState } from 'react';
import { Shield, User, Lock, Loader } from 'lucide-react';
import { useWorker } from '../context/WorkerContext';

const Auth = () => {
    const { loginUser } = useWorker();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate a 1-second database check/registration
        setTimeout(() => {
            loginUser(name, password);
            setLoading(false);
        }, 1000);
    };

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6', padding: '24px' }}>
            <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Shield size={48} color="#2563eb" style={{ margin: '0 auto 16px' }} />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '8px' }}>
                        GigShield Parametric Coverage
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151' }}>Full Name</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px' }}>
                            <User size={20} color="#9ca3af" style={{ marginRight: '8px' }} />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ramesh K."
                                style={{ border: 'none', outline: 'none', width: '100%' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151' }}>Password</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px' }}>
                            <Lock size={20} color="#9ca3af" style={{ marginRight: '8px' }} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ border: 'none', outline: 'none', width: '100%' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name || !password}
                        style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: (loading || !name || !password) ? 'not-allowed' : 'pointer', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        {loading ? <Loader className="animate-spin" size={20} /> : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Auth;