// src/context/LanguageContext.js
import React, { createContext, useState, useContext } from 'react';

export const translations = {
    en: {
        welcome: 'Welcome back',
        primaryZone: 'Primary Zone',
        yourGigScore: 'Your GigScore',
        activeCoverage: 'Active Coverage',
        heavyRainfall: 'Heavy Rainfall',
        getQuote: 'Get Your AI Quote',
        paid: 'Paid',
        weeklyPremiumLabel: 'Weekly Premium',
        protectEarnings: 'Protect Your Gig Earnings',
        enterPhone: 'Enter your phone number to get started',
        locatePrimaryZone: 'Locate Primary Zone',
        yourSmartQuote: 'Your Smart Quote',
        pricedDynamically: 'Priced dynamically for',
        aiInfraAnalysis: 'AI Infrastructure Analysis',
        parametricThreshold: 'Parametric Threshold',
        dashboard: 'Dashboard',
        claims: 'Claims',
        coverage: 'Coverage',
        settings: 'Settings',
        logout: 'Logout',
        enrollmentLocked: 'Enrollment Locked',
        payoutHistory: 'Payout History',
        noClaimsYet: 'No active claims history found.',
        buildingTrust: 'Building Trust',
        activeMember: 'Active Member',
        topTrusted: 'Top 10% — Trusted',
        discountMessage: 'Excellent! You qualify for a ₹15 discount on weekly premiums.',
        keepBuilding: 'Keep building your score to unlock premium discounts!'
    },
    ta: {
        welcome: 'மீண்டும் வருக',
        primaryZone: 'முதன்மை பகுதி',
        yourGigScore: 'உங்கள் கிக்ஸ்கோர்',
        activeCoverage: 'செயலில் உள்ள காப்பீடு',
        heavyRainfall: 'கனமழை',
        getQuote: 'AI மேற்கோள் பெறுங்கள்',
        paid: 'செலுத்தப்பட்டது',
        weeklyPremiumLabel: 'வாராந்திர பிரீமியம்',
        protectEarnings: 'உங்கள் கிக் வருவாயைப் பாதுகாக்கவும்',
        enterPhone: 'தொடங்க உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்',
        locatePrimaryZone: 'முதன்மைப் பகுதியைக் கண்டறிக',
        yourSmartQuote: 'உங்கள் ஸ்மார்ட் மேற்கோள்',
        pricedDynamically: 'இதற்கான மாறும் கட்டணம்',
        aiInfraAnalysis: 'AI உள்கட்டமைப்பு பகுப்பாய்வு',
        parametricThreshold: 'பாராமெட்ரிக் வரம்பு',
        dashboard: 'முகப்பு',
        claims: 'உரிமைகோரல்கள்',
        coverage: 'காப்பீடு',
        settings: 'அமைப்புகள்',
        logout: 'வெளியேறு',
        enrollmentLocked: 'பதிவு முடக்கப்பட்டுள்ளது',
        payoutHistory: 'கொடுப்பனவு வரலாறு',
        noClaimsYet: 'செயலில் உள்ள உரிமைகோரல் வரலாறு இல்லை.',
        buildingTrust: 'நம்பிக்கையை உருவாக்குகிறது',
        activeMember: 'செயலில் உள்ள உறுப்பினர்',
        topTrusted: 'முதல் 10% — நம்பகமானவர்',
        discountMessage: 'அருமை! வாராந்திர பிரீமியங்களில் ₹15 தள்ளுபடி பெற நீங்கள் தகுதி பெற்றுள்ளீர்கள்.',
        keepBuilding: 'பிரீமியம் தள்ளுபடிகளைத் திறக்க உங்கள் ஸ்கோரைத் தொடர்ந்து மேம்படுத்துங்கள்!'
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('en');
    const t = (key) => translations[lang][key] || translations['en'][key] || key;
    const toggleLang = () => setLang(prev => prev === 'en' ? 'ta' : 'en');
    return (
        <LanguageContext.Provider value={{ lang, t, toggleLang }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);