// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('appTheme');
            if (saved) return saved;
        }
        return 'dark';
    });

    const [customColor, setCustomColor] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('customColor');
            if (saved) return saved;
        }
        return '#6366F1';
    });

    // Aplicar tema inmediatamente cuando se monta el componente
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        
        if (theme === 'custom') {
            root.style.setProperty('--color-custom', customColor);
        }
        
        localStorage.setItem('appTheme', theme);
        localStorage.setItem('customColor', customColor);
        
        console.log('Tema aplicado:', theme, 'Color:', customColor);
    }, [theme, customColor]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, customColor, setCustomColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe usarse dentro de ThemeProvider');
    }
    return context;
};