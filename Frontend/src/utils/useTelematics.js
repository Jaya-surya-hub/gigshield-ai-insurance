import { useState, useEffect, useRef } from 'react';

export const useTelematics = () => {
    const [telematics, setTelematics] = useState({
        latitude: null,
        longitude: null,
        isMoving: false,
        kinematicVariance: 0.0, // <-- NEW: The Spoofer Trap metric
        error: null
    });

    // We use a ref to store a rolling window of the last 20 motion readings
    const motionBuffer = useRef([]);

    useEffect(() => {
        const handleMotion = (event) => {
            const acc = event.accelerationIncludingGravity;
            if (!acc) return;

            // Calculate total acceleration magnitude (Gravity is ~9.8)
            const magnitude = Math.sqrt(
                Math.pow(acc.x || 0, 2) +
                Math.pow(acc.y || 0, 2) +
                Math.pow(acc.z || 0, 2)
            );

            // Add to rolling buffer
            motionBuffer.current.push(magnitude);
            if (motionBuffer.current.length > 20) {
                motionBuffer.current.shift(); // Keep only the last ~2 seconds of data
            }

            // Calculate Statistical Variance
            let variance = 0;
            if (motionBuffer.current.length > 5) {
                const mean = motionBuffer.current.reduce((a, b) => a + (b || 0), 0) / motionBuffer.current.length;
                variance = motionBuffer.current.reduce((a, b) => a + Math.pow((b || 0) - mean, 2), 0) / motionBuffer.current.length;
            }

            const isDeviceMoving = magnitude > 11 || magnitude < 8.5;
            
            // Ensure we never return NaN
            let finalVariance = parseFloat(variance.toFixed(4));
            if (isNaN(finalVariance)) finalVariance = 0.0;

            setTelematics(prev => ({
                ...prev,
                isMoving: isDeviceMoving,
                kinematicVariance: finalVariance // Send clean number to backend
            }));
        };

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setTelematics(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
            },
            (err) => setTelematics(prev => ({ ...prev, error: err.message })),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission().then(res => {
                if (res === 'granted') window.addEventListener('devicemotion', handleMotion);
            }).catch(console.error);
        } else {
            window.addEventListener('devicemotion', handleMotion);
        }

        return () => {
            navigator.geolocation.clearWatch(watchId);
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, []);

    return telematics;
};