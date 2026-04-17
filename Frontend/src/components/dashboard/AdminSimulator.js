import React, { useState } from 'react';
import { CloudRain, Sun, Loader, ShieldAlert, Cpu } from 'lucide-react';
import { gigShieldAPI } from '../../services/api'; // I will check if api.js supports these endpoints

const AdminSimulator = ({ zoneId, onSimulateChange }) => {
    const [loading, setLoading] = useState(false);
    const [isStormActive, setIsStormActive] = useState(false);

    const toggleWeather = async () => {
        setLoading(true);
        try {
            if (isStormActive) {
                // Clear Alert
                await gigShieldAPI.clearWeatherAlerts(zoneId);
                setIsStormActive(false);
            } else {
                // Create Alert
                await gigShieldAPI.createWeatherAlert(zoneId);
                setIsStormActive(true);
            }
            if (onSimulateChange) {
                onSimulateChange(!isStormActive);
            }
        } catch (error) {
            console.error("Failed to toggle weather simulation", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '32px', padding: '20px', backgroundColor: 'var(--bg-tertiary, #f8fafc)', borderRadius: '12px', border: '1px dashed var(--border-hover, #cbd5e1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Cpu size={20} color="#64748b" />
                <h3 style={{ margin: 0, fontSize: '0.875rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>God-Mode Simulator</h3>
            </div>
            
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px' }}>
                Use this panel to simulate extreme weather events for testing the parametric triggers and claim generation.
            </p>

            <button
                onClick={toggleWeather}
                disabled={loading}
                style={{ 
                    width: '100%', 
                    minHeight: '52px', 
                    backgroundColor: isStormActive ? '#ef4444' : '#3b82f6', 
                    color: 'var(--bg-secondary)', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: 'none', 
                    fontWeight: 'bold', 
                    cursor: loading ? 'not-allowed' : 'pointer', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '1rem',
                    transition: 'background-color 0.2s'
                }}
            >
                {loading ? <Loader size={18} className="animate-spin" /> : (isStormActive ? <Sun size={18} /> : <CloudRain size={18} />)}
                {isStormActive ? 'Clear Disaster Alert' : 'Simulate 100mm Rainfall Event'}
            </button>
        </div>
    );
};

export default AdminSimulator;
