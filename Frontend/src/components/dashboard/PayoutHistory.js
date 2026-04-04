import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { gigShieldAPI } from '../../services/api';
import { formatINR, formatDate } from '../../utils/formatters';

const PayoutHistory = ({ workerId, triggerRefresh }) => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClaims = async () => {
            if (!workerId) return;
            const data = await gigShieldAPI.getClaimHistory(workerId);
            setClaims(data);
            setLoading(false);
        };
        fetchClaims();
    }, [workerId, triggerRefresh]);

    if (loading) {
        return <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>Loading payout history...</div>;
    }

    if (claims.length === 0) {
        return (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginTop: '24px', textAlign: 'center' }}>
                <FileText size={32} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ margin: '0 0 4px 0', color: '#374151' }}>No Claims Yet</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Your parametric payouts will appear here.</p>
            </div>
        );
    }

    const getStatusConfig = (status) => {
        if (status === 'APPROVED' || status === 'success') return { color: '#059669', bg: '#d1fae5', icon: <CheckCircle size={16} />, text: 'Paid' };
        if (status === 'FLAGGED_FOR_LAV' || status === 'FLAGGED') return { color: '#dc2626', bg: '#fee2e2', icon: <AlertTriangle size={16} />, text: 'Action Required' };
        return { color: '#d97706', bg: '#fef3c7', icon: <Clock size={16} />, text: 'Processing' };
    };

    return (
        <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#374151', marginBottom: '12px' }}>Payout History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {claims.map((claim) => {
                    const statusConfig = getStatusConfig(claim.status);

                    // Format trigger type (e.g., "HEAVY_RAIN" -> "Heavy Rain")
                    const formattedTrigger = claim.trigger_type ? claim.trigger_type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : 'System Trigger';

                    return (
                        <div key={claim.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#1f2937' }}>{formattedTrigger} Cover</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{formatDate(claim.created_at)} • ID: #{claim.id}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#1f2937' }}>{formatINR(claim.payout_amount)}</p>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: statusConfig.bg, color: statusConfig.color, padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    {statusConfig.icon}
                                    {statusConfig.text}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PayoutHistory;