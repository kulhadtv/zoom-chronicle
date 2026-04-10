import { useState, useEffect } from 'react';
import {
    RiSearchLine,
    RiEditLine, RiCheckLine, RiCloseLine,
} from 'react-icons/ri';
import { adminAPI } from '../../api/axios';

const ROLES = ['user', 'editor', 'admin'];

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(null);
    const [busy, setBusy] = useState(null);

    useEffect(() => {
        adminAPI.getAllUsers()
            .then(res => setUsers(res?.data?.users || []))
            .catch(() => setUsers([]))
            .finally(() => setLoading(false));
    }, []);

    const filtered = users.filter(u =>
        !search ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const handleRoleChange = async (userId, newRole) => {
        setBusy(userId);
        try {
            await adminAPI.updateRole(userId, newRole);
            setUsers(us => us.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch { alert('Role update failed. Try again.'); }
        finally { setBusy(null); setEditing(null); }
    };

    const handleDeactivate = async (userId) => {
        if (!window.confirm('Deactivate this user?')) return;
        setBusy(userId);
        try {
            await adminAPI.deactivate(userId);
            setUsers(us => us.map(u => u._id === userId ? { ...u, isActive: false } : u));
        } catch { alert('Action failed.'); }
        finally { setBusy(null); }
    };

    const handleActivate = async (userId) => {
        setBusy(userId);
        try {
            await adminAPI.activate(userId);
            setUsers(us => us.map(u => u._id === userId ? { ...u, isActive: true } : u));
        } catch { alert('Action failed.'); }
        finally { setBusy(null); }
    };

    return (
        <div>
            <div className="admin-table-wrap">
                <div className="admin-table-header">
                    <div className="admin-table-title">Manage Users ({filtered.length})</div>
                    <div className="search-input-wrap" style={{ borderRadius: 'var(--radius-md)' }}>
                        <RiSearchLine size={14} className="search-icon" />
                        <input
                            placeholder="Search by name or email…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: 220 }}
                        />
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}><td colSpan={6}><div className="skeleton" style={{ height: 16 }} /></td></tr>
                            ))
                            : filtered.map(u => (
                                <tr key={u._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <div style={{
                                                width: 34, height: 34, borderRadius: '50%',
                                                background: 'var(--color-primary-soft)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontFamily: 'var(--font-heading)', fontWeight: 700,
                                                color: 'var(--color-primary)', flexShrink: 0, fontSize: 'var(--text-sm)'
                                            }}>
                                                {(u.name || u.email || 'U')[0].toUpperCase()}
                                            </div>
                                            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-text)' }}>
                                                {u.name || 'Unnamed User'}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                                        {u.email}
                                    </td>
                                    <td>
                                        {editing?.id === u._id ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <select
                                                    className="form-select"
                                                    style={{ padding: '4px 10px', width: 'auto', fontSize: 'var(--text-xs)' }}
                                                    value={editing.role}
                                                    onChange={e => setEditing(ed => ({ ...ed, role: e.target.value }))}
                                                >
                                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                                <button
                                                    className="tbl-btn tbl-btn-activate"
                                                    onClick={() => handleRoleChange(u._id, editing.role)}
                                                    disabled={busy === u._id}
                                                >
                                                    <RiCheckLine size={11} />
                                                </button>
                                                <button className="tbl-btn" style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                                                    onClick={() => setEditing(null)}>
                                                    <RiCloseLine size={11} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <span className={`pill pill-${u.role || 'user'}`}>{u.role || 'user'}</span>
                                                <button
                                                    className="tbl-btn tbl-btn-edit"
                                                    onClick={() => setEditing({ id: u._id, role: u.role || 'user' })}
                                                >
                                                    <RiEditLine size={11} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`pill ${u.isActive !== false ? 'pill-active' : 'pill-inactive'}`}>
                                            {u.isActive !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            {u.isActive !== false
                                                ? <button className="tbl-btn tbl-btn-delete" onClick={() => handleDeactivate(u._id)} disabled={busy === u._id}>
                                                    Deactivate
                                                </button>
                                                : <button className="tbl-btn tbl-btn-activate" onClick={() => handleActivate(u._id)} disabled={busy === u._id}>
                                                    Activate
                                                </button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
