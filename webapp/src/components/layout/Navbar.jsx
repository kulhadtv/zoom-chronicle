import { useState, useEffect, use } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
    RiSearchLine, RiCloseLine,
    RiUser3Line, RiShieldLine,
} from 'react-icons/ri';
import "../../styles/navbar.css"
import { useAuth } from '../../context/AuthContext';
import { postsAPI } from '../../api/axios';

const CATEGORIES = [
    { label: 'Trending', path: '/trending', icon: '🔥' },
    { label: 'National', path: '/category/national', icon: '🇮🇳' },
    { label: 'Politics', path: '/category/politics', icon: '🏛️' },
    { label: 'World', path: '/category/world', icon: '🌍' },
    { label: 'Business', path: '/category/business', icon: '📈' },
    { label: 'Sports', path: '/category/sports', icon: '⚽' },
    { label: 'Bollywood', path: '/category/entertainment', icon: '🎬' },
    { label: 'Technology', path: '/category/technology', icon: '💻' },
    { label: 'Health', path: '/category/health', icon: '❤️' },
];


export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [slugs, setSlugs] = useState([]);
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();


    const getAllSlugs = async () => {
        try {
            const res = await postsAPI.getSlugs();
            const slugs = res?.data?.latestSlugs || [];
            setSlugs(slugs);
        } catch (err) {
            console.error("Slug API error:", err);
            setSlugs([]);
        }
    };
    useEffect(() => {
        getAllSlugs();
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);



    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/?search=${encodeURIComponent(search.trim())}`);
            setSearch('');
            setMobileOpen(false);
        }
    };

    return (
        <>
            {/* ── Ticker ── */}
            <div className="ticker-bar">
                <div className="ticker-label">
                    <span className="ticker-dot" />
                    LIVE
                </div>
                <div className="ticker-track">
                    <div className="ticker-items">
                        {slugs.map((item, i) => (
                            <span key={i} className="ticker-item">
                                {item.slug}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main Navbar ── */}
            <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
                <div className="container navbar-inner">

                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <img src="/zoomchronicle.png" alt="Zoom Chronicle" />
                        <div>
                            <div className="navbar-logo-text">Zoom Chronicle</div>
                            <div className="navbar-logo-sub">Aapka Apna News</div>
                        </div>
                    </Link>

                    {/* Nav links */}
                    <nav className="navbar-nav">
                        <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>Home</NavLink>
                        <NavLink to="/trending" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Trending</NavLink>
                        <NavLink to="/category/national" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>National</NavLink>
                        <NavLink to="/category/politics" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Politics</NavLink>
                        <NavLink to="/category/world" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>World</NavLink>
                        <NavLink to="/category/sports" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Sports</NavLink>
                        <NavLink to="/category/entertainment" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Bollywood</NavLink>
                    </nav>

                    {/* Actions */}
                    <div className="navbar-actions">
                        <form onSubmit={handleSearch} className="search-box">
                            <div className="search-input-wrap">
                                <RiSearchLine size={15} className="search-icon" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search news…"
                                />
                            </div>
                        </form>

                        {isAdmin && (
                            <Link to="/admin" className="btn btn-primary btn-sm">
                                <RiShieldLine size={14} />
                                Admin
                            </Link>
                        )}
                        {user && !isAdmin && (
                            <button onClick={logout} className="btn btn-ghost btn-sm">
                                <RiUser3Line size={14} />
                                Logout
                            </button>
                        )}
                        {/* {!user && (
                            <Link to="/admin/login" className="btn btn-outline btn-sm">
                                Login
                            </Link>
                        )} */}

                        <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                            <span /><span /><span />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Category Nav ── */}
            <div className="cat-nav">
                <div className="container cat-nav-inner">
                    {CATEGORIES.map(cat => (
                        <NavLink
                            key={cat.path}
                            to={cat.path}
                            className={({ isActive }) => `cat-link${isActive ? ' active' : ''}`}
                        >
                            <span>{cat.icon}</span>
                            {cat.label}
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* ── Mobile Menu ── */}
            {mobileOpen && (
                <div className="mobile-menu">
                    <div className="mobile-menu-header">
                        <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
                            <img src="/zoomchronicle.png" alt="Zoom Chronicle" />
                            <div className="navbar-logo-text">Zoom Chronicle</div>
                        </Link>
                        <button className="btn btn-ghost btn-icon" onClick={() => setMobileOpen(false)}>
                            <RiCloseLine size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSearch} style={{ marginBottom: 'var(--space-6)' }}>
                        <div className="search-input-wrap" style={{ borderRadius: 'var(--radius-md)', width: '100%' }}>
                            <RiSearchLine size={16} className="search-icon" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search news…" />
                        </div>
                    </form>

                    <nav className="mobile-nav-links">
                        {[
                            { to: '/', label: 'Home' },
                            { to: '/trending', label: '🔥 Trending' },
                            { to: '/category/national', label: '🇮🇳 National' },
                            { to: '/category/politics', label: '🏛️ Politics' },
                            { to: '/category/world', label: '🌍 World' },
                            { to: '/category/business', label: '📈 Business' },
                            { to: '/category/sports', label: '⚽ Sports' },
                            { to: '/category/entertainment', label: '🎬 Bollywood' },
                            { to: '/category/technology', label: '💻 Technology' },
                        ].map(item => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="mobile-nav-link"
                                onClick={() => setMobileOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link to="/admin" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                                🛡️ Admin Panel
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </>
    );
}