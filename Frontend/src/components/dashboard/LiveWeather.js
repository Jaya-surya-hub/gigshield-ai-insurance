import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, MapPin, Loader } from 'lucide-react';
import { gigShieldAPI } from '../../services/api';

const LiveWeather = ({ lat, lon }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!lat || !lon) return;

        const fetchWeather = async () => {
            setLoading(true);
            const data = await gigShieldAPI.getLocalWeather(lat, lon);
            setWeather(data);
            setLoading(false);
        };

        fetchWeather();

        // Refresh weather every 5 minutes
        const interval = setInterval(fetchWeather, 300000);
        return () => clearInterval(interval);
    }, [lat, lon]);

    // Translate Open-Meteo WMO Codes to Icons and Text
    const getWeatherDetails = (code) => {
        if (code <= 3) return { text: 'Clear / Cloudy', icon: <Sun size={24} color="#f59e0b" />, bg: '#fffbeb' };
        if (code <= 48) return { text: 'Foggy', icon: <Cloud size={24} color="#9ca3af" />, bg: '#f3f4f6' };
        if (code <= 67) return { text: 'Raining', icon: <CloudRain size={24} color="#3b82f6" />, bg: '#eff6ff' };
        if (code >= 95) return { text: 'Thunderstorm', icon: <CloudLightning size={24} color="#7c3aed" />, bg: '#f5f3ff' };
        return { text: 'Variable', icon: <Cloud size={24} color="var(--text-muted)" />, bg: '#f9fafb' };
    };

    if (!lat || !lon) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px dashed #cbd5e1', marginBottom: '24px' }}>
                <MapPin className="animate-bounce" size={20} color="#94a3b8" />
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Acquiring GPS Satellite Lock...</span>
            </div>
        );
    }

    if (loading || !weather) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', marginBottom: '24px' }}>
                <Loader className="animate-spin" size={20} color="#3b82f6" />
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Syncing Atmospheric Data...</span>
            </div>
        );
    }

    const details = getWeatherDetails(weather.weather_code);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: details.bg, borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '8px', borderRadius: '50%', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    {details.icon}
                </div>
                <div>
                    <h3 style={{ margin: '0 0 2px 0', fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Environment</h3>
                    <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-primary)' }}>{details.text} • {weather.temperature_2m}°C</p>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 2px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Local Precipitation</p>
                <p style={{ margin: 0, fontWeight: 'bold', color: weather.precipitation > 0 ? '#2563eb' : '#10b981' }}>
                    {weather.precipitation} mm
                </p>
            </div>
        </div>
    );
};

export default LiveWeather;
