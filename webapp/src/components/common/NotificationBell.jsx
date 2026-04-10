import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { RiBellLine, RiBellFill, RiCloseLine } from 'react-icons/ri';
import { postsAPI } from '../../api/axios';
import "../../styles/notificationBell.css"

const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [ringing, setRinging] = useState(false);
    const panelRef = useRef(null);
    const prevCount = useRef(0);

    const fetchLatest = async () => {
        try {
            const res = await postsAPI.getAll({ limit: 6, sort: 'newest' });
            const newPosts = res?.data?.posts || [];
            if (prevCount.current > 0 && newPosts.length > prevCount.current) {
                setRinging(true);
                setTimeout(() => setRinging(false), 700);
            }
            prevCount.current = newPosts.length;
            setPosts(newPosts);
        } catch {
            /* Use placeholder if API not ready */
            setPosts(PLACEHOLDER_POSTS);
        }
    };

    useEffect(() => {
        fetchLatest();
        const interval = setInterval(fetchLatest, 60000); // poll every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
        };
        if (open) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const last24h = posts.filter(p => {
        const diff = Date.now() - new Date(p.createdAt || Date.now());
        return diff < 86400000;
    });
    const count = last24h.length || posts.length;

    return (
        <div className="bell-widget" ref={panelRef}>
            {/* Panel */}
            {open && (
                <div className="bell-panel">
                    <div className="bell-panel-header">
                        <div className="bell-panel-title">
                            <span className="live-dot" />
                            Latest 24h News
                        </div>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setOpen(false)}>
                            <RiCloseLine size={16} />
                        </button>
                    </div>

                    <div className="bell-panel-body">
                        {(last24h.length ? last24h : posts).map((post) => (
                            <Link
                                key={post._id || post.id}
                                to={`/post/${post.slug || post._id}`}
                                className="notif-card"
                                onClick={() => setOpen(false)}
                            >
                                <div className="notif-img">
                                    {post.images?.[0] || post.thumbnail ? (
                                        <img src={post.images?.[0] || post.thumbnail} alt={post.title} />
                                    ) : (
                                        <div className="notif-img-placeholder">📰</div>
                                    )}
                                </div>
                                <div className="notif-info">
                                    <div className="notif-title">{post.title}</div>
                                    <div className="notif-meta">
                                        <span className="notif-cat">{post.category || 'News'}</span>
                                        <span>·</span>
                                        <span>{timeAgo(post.createdAt || Date.now())}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <Link to="/" className="bell-panel-footer" onClick={() => setOpen(false)}>
                        View all latest news →
                    </Link>
                </div>
            )}

            {/* Bell button */}
            <button
                className={`bell-btn${ringing ? ' ringing' : ''}`}
                onClick={() => setOpen(o => !o)}
                aria-label="News notifications"
            >
                {open ? <RiBellFill size={22} className="bell-icon" /> : <RiBellLine size={22} className="bell-icon" />}
                {count > 0 && <span className="bell-badge">{count > 9 ? '9+' : count}</span>}
            </button>
        </div>
    );
}

/* Placeholder when API not yet connected */
const PLACEHOLDER_POSTS = [
    { _id: '1', title: 'Supreme Court issues landmark ruling on electoral bonds case', category: 'National', createdAt: new Date(Date.now() - 3600000), slug: 'sc-ruling' },
    { _id: '2', title: 'India GDP growth projected at 7.2% for FY2026, beats estimates', category: 'Business', createdAt: new Date(Date.now() - 7200000), slug: 'india-gdp' },
    { _id: '3', title: 'IPL 2026: Mumbai Indians clinch thriller against CSK in last over', category: 'Sports', createdAt: new Date(Date.now() - 10800000), slug: 'ipl-mi-csk' },
    { _id: '4', title: 'Sensex crosses 85,000 for first time — here is what experts say', category: 'Business', createdAt: new Date(Date.now() - 14400000), slug: 'sensex-85k' },
    { _id: '5', title: 'Anushka Sharma returns to screen with new Bollywood project', category: 'Entertainment', createdAt: new Date(Date.now() - 18000000), slug: 'anushka-return' },
];