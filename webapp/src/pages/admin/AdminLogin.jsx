import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiLockPasswordLine, RiMailLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import "../../styles/pages/adminLogin.css"
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(form);
            navigate('/admin');
        } catch (err) {
            setError(err?.message || 'Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-card">
                <div className="login-brand">
                    <img src="/zoomchronicle.png" alt="Zoom Chronicle" className="login-logo" />
                    <div className="login-title">Zoom Chronicle</div>
                    <div className="login-subtitle">Admin Panel</div>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="login-error">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <RiMailLine size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                            <input
                                type="email"
                                className="form-input"
                                style={{ paddingLeft: 42 }}
                                placeholder="admin@zoomchronicle.in"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <RiLockPasswordLine size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                            <input
                                type={showPw ? 'text' : 'password'}
                                className="form-input"
                                style={{ paddingLeft: 42, paddingRight: 42 }}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(v => !v)}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                            >
                                {showPw ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: 'var(--space-4)' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <div className="login-divider" style={{ marginTop: 'var(--space-6)' }}>— or —</div>
                <div className="login-back">
                    <Link to="/">← Back to Zoom Chronicle</Link>
                </div>
            </div>
        </div>
    );
}