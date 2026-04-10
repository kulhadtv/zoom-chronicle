import { Link } from 'react-router-dom';
import { RiHeartLine, RiEyeLine, RiTimeLine } from 'react-icons/ri';
import '../../styles/newsCard.css';

const IMG_HEIGHTS = { sm: 160, md: 200, lg: 240 };

export const timeAgo = (date) => {
    if (!date) return '';
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

/* ── Standard vertical card ── */
export function NewsCard({ post, size = 'md' }) {
    const imgH = IMG_HEIGHTS[size] || 200;
    return (
        <Link to={`/post/${post.slug || post._id}`} className="news-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="news-card-img" style={{ height: imgH }}>
                {post.images?.[0] || post.thumbnail
                    ? <img src={post.images?.[0] || post.thumbnail} alt={post.title} style={{ height: imgH }} />
                    : <div className="news-card-img-placeholder" style={{ height: imgH }}>📰</div>
                }
                {post.category && (
                    <div className="news-card-cat">
                        <span className="badge badge-primary">{post.category}</span>
                    </div>
                )}
            </div>
            <div className="news-card-body">
                <h3 className="news-card-title">{post.title}</h3>
                {post.excerpt && <p className="news-card-excerpt">{post.excerpt}</p>}
                <div className="news-card-meta">
                    <div className="news-card-stats">
                        <span className="stat-item"><RiTimeLine size={11} /> {timeAgo(post.createdAt)}</span>
                        {post.views != null && <span className="stat-item"><RiEyeLine size={11} /> {post.views}</span>}
                        {post.likes != null && <span className="stat-item"><RiHeartLine size={11} /> {post.likes?.length ?? post.likes}</span>}
                    </div>
                </div>
            </div>
        </Link>
    );
}

/* ── Hero card (big featured) ── */
export function HeroCard({ post }) {

    return (
        <Link to={`/post/${post.slug || post._id}`} className="news-card-hero">
            {post.images?.[0] || post.thumbnail
                ? <img src={post.images?.[0] || post.thumbnail} alt={post.title} />
                : <div style={{ width: '100%', height: '100%', background: 'var(--color-bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>📰</div>
            }
            <div className="hero-overlay" />
            <div className="hero-content">
                {post.category && (
                    <div className="hero-cat">
                        <span className="badge badge-primary">{post.category}</span>
                    </div>
                )}
                <h2 className="hero-title">{post.title}</h2>
                <div className="hero-meta">
                    <RiTimeLine size={12} />
                    <span>{timeAgo(post.createdAt)}</span>
                </div>
            </div>
        </Link>
    );
}

/* ── Horizontal card (sidebar / list) ── */
export function NewsCardH({ post }) {
    return (
        <Link to={`/post/${post.slug || post._id}`} className="news-card-h">
            <div className="news-card-h-img">
                {post.images?.[0] || post.thumbnail
                    ? <img src={post.images?.[0] || post.thumbnail} alt={post.title} />
                    : <div style={{ width: '100%', height: '100%', background: 'var(--color-bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📰</div>
                }
            </div>
            <div className="news-card-h-body">
                <div className="news-card-h-title">{post.title}</div>
                <div className="news-card-h-meta">
                    {post.category && <span className="badge badge-soft" style={{ fontSize: '10px' }}>{post.category}</span>}
                    <RiTimeLine size={10} />
                    <span>{timeAgo(post.createdAt)}</span>
                </div>
            </div>
        </Link>
    );
}

export default NewsCard;