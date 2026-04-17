// src/components/layout/Header.js
import { useLanguage } from '../../context/LanguageContext';
import { useWorker } from '../../context/WorkerContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart2, Moon, Sun } from 'lucide-react'; 

const Header = () => {
    const { lang, toggleLang, t } = useLanguage();
    const { worker } = useWorker();
    const { theme, autoMode, setManualTheme, enableAutoMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const isLanding = location.pathname === '/';

    return (
        <header style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--header-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 'bold', fontSize: '2rem', color: 'var(--text-primary)' }}>GigShield</div>
                {!isLanding && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Theme Toggle Button */}
                    <button 
                        onClick={() => {
                            setManualTheme(theme === 'dark' ? 'light' : 'dark');
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Language Toggle [cite: 1296-1303] */}
                    <button onClick={toggleLang} style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '4px 10px', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 'bold', color: '#1D4ED8' }}>
                        {lang === 'en' ? 'தமிழ்' : 'English'}
                    </button>
                    {/* Admin/Insurer Icon [cite: 952-956] */}
                    <button onClick={() => navigate('/insurer')} style={{ background: 'none', border: 'none', color: 'var(--accent-color)' }}>
                        <BarChart2 size={20} />
                    </button>
                    {/* Cleaned Name/Status [cite: 1132-1140, 1539] */}
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{worker?.name || 'Guest'}</p>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#059669' }}>Active</p>
                    </div>
                </div>
                )}
            </div>
        </header>
    );
};

export default Header;
