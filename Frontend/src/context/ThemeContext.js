import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [autoMode, setAutoMode] = useState(() => {
        const savedAuto = localStorage.getItem('themeAutoMode');
        return savedAuto !== null ? JSON.parse(savedAuto) : true;
    });

    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('themePreference');
        return savedTheme || 'light';
    });

    useEffect(() => {
        const checkTimeTheme = () => {
            if (!autoMode) return;
            const hour = new Date().getHours();
            const isDarkTime = hour >= 18 || hour < 6;
            const targetTheme = isDarkTime ? 'dark' : 'light';
            
            if (theme !== targetTheme) {
                setTheme(targetTheme);
            }
        };

        // Check initially
        checkTimeTheme();

        // Check every minute if in auto mode
        let interval;
        if (autoMode) {
            interval = setInterval(checkTimeTheme, 60000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoMode, theme]);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
        console.log("THEME APPLIED:", theme);
        
        localStorage.setItem('themePreference', theme);
        localStorage.setItem('themeAutoMode', JSON.stringify(autoMode));
    }, [theme, autoMode]);

    const setManualTheme = (newTheme) => {
        setAutoMode(false);
        setTheme(newTheme);
    };

    const enableAutoMode = () => {
        setAutoMode(true);
        // Instant check
        const hour = new Date().getHours();
        setTheme(hour >= 18 || hour < 6 ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, autoMode, setManualTheme, enableAutoMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
