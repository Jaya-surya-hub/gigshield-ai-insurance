import React from 'react';
import { Star, TrendingUp } from 'lucide-react';

const GigScoreCard = ({ score }) => {
    // Determine color based on score (Green for good, Amber for okay, Red for bad)
    const getColor = (s) => {
        if (s >= 80) return '#10b981'; // Green
        if (s >= 50) return '#f59e0b'; // Amber
        return '#ef4444'; // Red
    };

    const color = getColor(score);

    return (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={20} color="#6366f1" />
                    Your GigScore
                </h3>
                <span style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    Top 10%
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 'bold', color: color }}>{score}</span>
                <span style={{ fontSize: '1rem', color: '#9ca3af' }}>/ 100</span>
            </div>

            <div style={{ width: '100%', backgroundColor: '#f3f4f6', height: '8px', borderRadius: '999px', marginTop: '16px', overflow: 'hidden' }}>
                <div style={{ width: `${score}%`, backgroundColor: color, height: '100%', borderRadius: '999px' }} />
            </div>

            <p style={{ marginTop: '16px', fontSize: '0.875rem', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} color="#10b981" />
                Excellent! You qualify for a ₹15 discount on weekly premiums.
            </p>
        </div>
    );
};

export default GigScoreCard;