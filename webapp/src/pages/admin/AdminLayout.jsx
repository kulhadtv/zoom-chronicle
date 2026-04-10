import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    RiDashboardLine, RiArticleLine, RiUserLine, RiAddLine,
    RiLogoutBoxLine, RiMenuLine, RiCloseLine, RiHomeLine,
} from 'react-icons/ri';
import "../../styles/pages/admin.css";
import "../../styles/pages/admin-responsive.css";
import { useAuth } from '../../context/AuthContext';

const NAV = [
    { section: 'Overview' },
    { to: '/admin', label: 'Dashboard', icon: RiDashboardLine, end: true },
    { section: 'Content' },
    { to: '/admin/posts', label: 'All Posts', icon: RiArticleLine },
    { to: '/admin/posts/new', label: 'New Post', icon: RiAddLine },
    { section: 'Users' },
    { to: '/admin/users', label: 'Manage Users', icon: RiUserLine },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    console.log("user", user.email);

    const handleLogout = () => { logout(); navigate('/'); };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/admin') return 'Dashboard';
        if (path === '/admin/users') return 'Manage Users';
        if (path === '/admin/posts/new') return 'New Post';
        if (path.includes('/edit')) return 'Edit Post';
        if (path === '/admin/posts') return 'All Posts';
        return 'Admin Panel';
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
                <div className="admin-sidebar-brand">
                    <img src="/zoomchronicle.png" alt="ZC" />
                    <div>
                        <div className="admin-brand-text">Zoom Chronicle</div>
                        <div className="admin-brand-sub">Admin</div>
                    </div>
                </div>

                <nav className="admin-nav">
                    {NAV.map((item, i) =>
                        item.section
                            ? <div key={i} className="admin-nav-section">{item.section}</div>
                            : (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon size={16} />
                                    {item.label}
                                </NavLink>
                            )
                    )}
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div className="admin-user-avatar">
                            {(user?.name || user?.email || 'A')[0].toUpperCase()}
                        </div>
                        <div className="admin-user-name-wrap">
                            <div className="admin-user-name">
                                {user?.name || user?.email || 'Admin'}
                            </div>
                            <div className="admin-user-role">{user?.role || 'admin'}</div>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Logout"
                            className="admin-logout-btn"
                        >
                            <RiLogoutBoxLine size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        {/* Hamburger — only visible on mobile via CSS */}
                        <button
                            className="sidebar-toggle-btn"
                            onClick={() => setSidebarOpen(o => !o)}
                            aria-label="Toggle sidebar"
                        >
                            {sidebarOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
                        </button>

                        <div className="admin-topbar-title">
                            {getPageTitle()}
                        </div>
                    </div>

                    <div className="admin-topbar-right">
                        <NavLink to="/" className="btn btn-ghost btn-sm">
                            <RiHomeLine size={14} />
                            <span className="admin-view-site-label">View Site</span>
                        </NavLink>
                    </div>
                </header>

                <div className="admin-content">
                    <Outlet />
                </div>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}