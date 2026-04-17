import React from 'react';
import { TrendingUp, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const GigScoreCard = ({ score }) => {
    const { t } = useLanguage();

    // Conditional Badge Logic [cite: 1113-1117]
    const getBadge = (s) => {
        if (s >= 80) return { text: 'Top 10% — Trusted', bg: '#eef2ff', color: '#4f46e5' };
        if (s >= 60) return { text: 'Active Member', bg: '#ecfdf5', color: '#059669' };
        return { text: 'Building Trust', bg: '#fef3c7', color: '#d97706' };
    };
    const badge = getBadge(score);

    return (
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={20} color="#f59e0b" />
                    {t('yourGigScore')}
                </h3>
                {/* Dynamic Badge applied here [cite: 1119-1122] */}
                <span style={{ backgroundColor: badge.bg, color: badge.color, padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {badge.text}
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#059669', lineHeight: 1 }}>{score}</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>/ 100</span>
            </div>

            <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ width: `${score}%`, height: '100%', backgroundColor: '#059669', borderRadius: '4px', transition: 'width 1s ease-in-out' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                <TrendingUp size={16} color="#059669" />
                <span>{score >= 60 ? t('discountMessage') : t('keepBuilding')}</span>
            </div>
        </div>
    );
};

export default GigScoreCard;
