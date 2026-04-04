import React, { createContext, useState, useContext } from 'react';

const WorkerContext = createContext();

export const WorkerProvider = ({ children }) => {
    const [worker, setWorker] = useState(null);

    const loginUser = (name, password, zone, premium, threshold_mm) => {
        setWorker({
            id: 1,
            name,
            zone: zone ?? 'COIMBATORE_PEELAMEDU',
            gigScore: 90,
            premium: premium ?? 42.00,
            threshold_mm: threshold_mm ?? 50.0,
            tier: 'Full',
            isActive: true
        });
    };

    const logoutUser = () => setWorker(null);

    return (
        <WorkerContext.Provider value={{ worker, loginUser, logoutUser }}>
            {children}
        </WorkerContext.Provider>
    );
};

export const useWorker = () => useContext(WorkerContext);