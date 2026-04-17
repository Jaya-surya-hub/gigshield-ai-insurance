import React, { createContext, useState, useContext } from 'react';

const WorkerContext = createContext();

export const WorkerProvider = ({ children }) => {
    const [worker, setWorker] = useState(() => {
        const saved = localStorage.getItem('gigshield_worker');
        if (saved) {
            try { return JSON.parse(saved); } 
            catch (e) { return null; }
        }
        return null;
    });

    // workerId param added — receives real DB id from /register-worker response
    const loginUser = (name, password, zone, premium, threshold_mm, workerId = 1) => {
        // If name looks like a phone number or is empty, show a friendly display name
        const isPhoneLike = /^[\d\s+\-()]{7,}$/.test(String(name || '').trim());
        const displayName = (!name || isPhoneLike)
            ? `Worker #${String(workerId).padStart(3, '0')}`
            : String(name).trim();

        const workerData = {
            id: workerId,                            // real DB id, not hardcoded 1
            name: displayName,
            zone: zone || 'COIMBATORE_PEELAMEDU',   // safe default if zone is empty
            gigScore: 90,
            premium: premium ?? 42.00,
            threshold_mm: threshold_mm ?? 50.0,
            tier: 'Full',
            isActive: true
        };
        setWorker(workerData);
        localStorage.setItem('gigshield_worker', JSON.stringify(workerData));
    };

    const logoutUser = () => {
        setWorker(null);
        localStorage.removeItem('gigshield_worker');
    };

    return (
        <WorkerContext.Provider value={{ worker, loginUser, logoutUser }}>
            {children}
        </WorkerContext.Provider>
    );
};

export const useWorker = () => useContext(WorkerContext);
