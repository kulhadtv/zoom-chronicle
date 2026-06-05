import "../styles/pages/postDetails.css";
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    RiTimeLine, RiEyeLine,
    RiShareLine, RiTwitterXFill,
    RiFacebookFill, RiWhatsappLine, RiLinkM,
} from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { NewsCard } from '../components/common/NewsCard';
import CalendarWidget from '../components/common/CalendarWidget';
import { postsAPI } from '../api/axios';

const timeAgo = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function PostDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [post, setPost] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const res = await postsAPI.getBySlug(slug);
            console.log('Fetched post:', res);
            const p = res?.data?.post || res?.data;
            console.log('Post data:', p);
            setPost(p);
            if (p?.category) fetchRelated(p.category, p._id);
        } catch {
            setPost([]);
            fetchRelated('National', null);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelated = async (category, excludeId) => {
        try {
            const res = await postsAPI.getByCategory(category.toLowerCase(), { limit: 3 });
            const posts = (res?.data?.posts || []).filter(p => p._id !== excludeId).slice(0, 3);
            console.log('Fetched related posts:', posts);
            setRelated(posts.length ? posts : []);
        } catch(err) {
            setRelated([]);
            console.error('Error fetching related posts:', err);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="post-detail">
            <div className="container">
                <div className="skeleton" style={{ height: 32, width: '60%', marginBottom: 24 }} />
                <div className="skeleton" style={{ height: 500, marginBottom: 24 }} />
                <div className="skeleton" style={{ height: 18, marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 18, width: '90%', marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 18, width: '75%' }} />
            </div>
        </div>
    );


    return (
        <article className="post-detail">
            <div className="container">
                <div className="post-layout">
                    {/* ─── MAIN CONTENT ─── */}
                    <div>
                        {/* Breadcrumb */}
                        <nav className="breadcrumb">
                            <Link to="/">Home</Link>
                            <span className="breadcrumb-sep">›</span>
                            {post.category && (
                                <>
                                    <Link to={`/category/${post.category.toLowerCase()}`}>{post.category}</Link>
                                    <span className="breadcrumb-sep">›</span>
                                </>
                            )}
                            <span className="breadcrumb-current">{post.title?.slice(0, 50)}…</span>
                        </nav>

                        {/* Header */}
                        <header className="post-header">
                            {post.category && (
                                <div className="post-category">
                                    <span className="badge badge-primary">{post.category}</span>
                                </div>
                            )}
                            <h1 className="post-title">{post.title}</h1>
                            {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}

                            {/* Meta bar */}
                            <div className="post-meta-bar">
                                <div className="post-meta-item"><RiTimeLine size={14} />{timeAgo(post.createdAt)}</div>
                                {post.views != null && <div className="post-meta-item"><RiEyeLine size={14} />{post.views} views</div>}
                            </div>
                        </header>

                        {/* Cover image */}
                        <div className="post-cover">
                            {post.images?.[0] || post.thumbnail
                                ? <img src={post.images?.[0] || post.thumbnail} alt={post.title} />
                                : <div className="post-cover-placeholder">📰</div>
                            }
                        </div>

                        {/* Body */}
                        <div
                            className="post-body"
                            dangerouslySetInnerHTML={{ __html: post.content || '<p>' +  + '</p>' }}
                        />

                        {/* Tags */}
                        {post.tags?.length > 0 && (
                            <div className="post-tags">
                                {post.tags.map(tag => (
                                    <Link key={tag} to={`/?search=${tag}`} className="post-tag">#{tag}</Link>
                                ))}
                            </div>
                        )}

                        {/* Like / Share */}
                        <div className="post-actions">

                            <span className="share-label"><RiShareLine size={14} /> Share:</span>
                            <div className="share-btns">
                                <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`}
                                    target="_blank" rel="noreferrer" className="share-btn"><RiTwitterXFill /></a>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                                    target="_blank" rel="noreferrer" className="share-btn"><RiFacebookFill /></a>
                                <a href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
                                    target="_blank" rel="noreferrer" className="share-btn"><RiWhatsappLine /></a>
                                <button className="share-btn" onClick={copyLink} title={copied ? 'Copied!' : 'Copy link'}>
                                    <RiLinkM />
                                </button>
                            </div>
                        </div>

                        {/* Related posts */}
                        {related.length > 0 && (
                            <section className="related-section">
                                <div className="section-header">
                                    <div className="section-title">Related <span>Stories</span></div>
                                </div>
                                <div className="related-grid">
                                    {related.map(rp => <NewsCard key={rp._id} post={rp} />)}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* ─── SIDEBAR ─── */}
                    <aside className="sidebar">
                        <CalendarWidget />
                       
                    </aside>
                </div>
            </div>
        </article>
    );
}

