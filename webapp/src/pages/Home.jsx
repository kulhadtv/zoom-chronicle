import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { RiArrowLeftSLine, RiArrowRightSLine, RiFireLine, RiNewspaperLine } from 'react-icons/ri';
import '../styles/home.css';
import { postsAPI } from '../api/axios';
import NewsCard, { HeroCard, NewsCardH } from '../components/common/NewsCard';
import CalendarWidget from '../components/common/CalendarWidget';
import Pagination from '../components/common/Pagination';
import { SectionNewsCard } from '../components/common/SectionNewsCard';

const CATEGORIES = [
    { label: 'All', value: null },
    { label: '🔥 Trending', value: 'trending' },
    { label: 'National', value: 'national' },
    { label: 'Politics', value: 'politics' },
    { label: 'World', value: 'world' },
    { label: 'Business', value: 'business' },
    { label: 'Sports', value: 'sports' },
    { label: 'Bollywood', value: 'entertainment' },
    { label: 'Tech', value: 'technology' },
];

export default function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQ = searchParams.get('search') || '';

    const [posts, setPosts] = useState([]);
    const [moreViewsPosts, setMoreViewsPosts] = useState([]);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingTrending, setLoadingTrending] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [activeTab, setActiveTab] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const [slide, setSlide] = useState(0);

    /* fetch posts */
    const fetchPosts = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = { page, limit: 9 };
            if (activeTab && activeTab !== 'trending') params.category = activeTab;
            if (searchQ) params.search = searchQ;
            if (dateRange) { params.startDate = dateRange.start; params.endDate = dateRange.end; }

            let res;
            if (activeTab === 'trending') {
                res = await postsAPI.getTrending();
                setPosts(res?.data?.posts || []);
                setPagination({ page: 1, pages: 1, total: 0 });
            } else {
                res = await postsAPI.getAll(params);
                setPosts(res?.data?.posts || []);
                setPagination(res?.data?.pagination || { page: 1, pages: 1 });
            }
        } catch {
            console.error("Posts API error:", err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, [activeTab, searchQ, dateRange]);

    const fetchTrending = async () => {
        try {
            const res = await postsAPI.getTrending();
            const posts = res?.data?.posts;

            setTrending(posts?.length ? posts.slice(0, 4) : []);
        } catch (err) {
            console.error("Trending API error:", err);
            setTrending([]);
        } finally {
            setLoadingTrending(false);
        }
    };

    const fetchMoreViews = async () => {
        try {
            const res = await postsAPI.getMoreViewsPosts();
            const posts = res?.data?.moreViewsPosts;
            setMoreViewsPosts(posts?.length ? posts : []);
        } catch (err) {
            console.error("More Views API error:", err);
            setMoreViewsPosts([]);
        }
    };

    useEffect(() => { fetchPosts(1); }, [fetchPosts]);
    useEffect(() => { fetchTrending(); }, []);
    useEffect(() => { fetchMoreViews(); }, []);

    /* auto-advance hero */
    useEffect(() => {
        if (!posts.length) return; // ✅ prevent running on empty data

        const t = setInterval(() => {
            setSlide(s => {
                const next = s + 1;
                return next >= posts.length ? 0 : next; // ✅ clamp index
            });
        }, 5000);

        return () => clearInterval(t);
    }, [posts.length]);

    useEffect(() => {
        setSlide(0);
    }, [posts]);

    const safePosts = posts.length ? posts : [];

    const heroPost = safePosts[slide] || safePosts[0];
    const topPosts = safePosts.slice(0, 5);
    const gridPosts = safePosts.slice(0, 9);

    return (
        <main>
            {/* ─── HERO CAROUSEL ─── */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-carousel">
                        {(safePosts.map((post, i) => (
                            <div key={post._id} className={`hero-slide${i === slide ? ' active' : ''}`}>
                                <HeroCard post={post} />
                            </div>
                        )))}
                        <button className="hero-arrow hero-arrow-left" onClick={() =>
                            setSlide(s => (s - 1 + safePosts.length) % safePosts.length)
                        }>
                            <RiArrowLeftSLine size={20} />
                        </button>
                        <button className="hero-arrow hero-arrow-right" onClick={() =>
                            setSlide(s => (s + 1) % safePosts.length)
                        }>
                            <RiArrowRightSLine size={20} />
                        </button>
                        <div className="hero-dots">
                            {Array.from({ length: safePosts.length }).map((_, i) => (
                                <button
                                    key={i}
                                    className={`hero-dot${i === slide ? ' active' : ''}`}
                                    onClick={() => setSlide(i)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── TRENDING STRIP ─── */}
            <section className="home-section" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)', background: 'var(--color-bg-soft)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
                <div className="container">
                    <div className="section-header" style={{ marginBottom: 'var(--space-5)' }}>
                        <div className="section-title"><span><RiFireLine style={{ verticalAlign: 'middle', marginRight: 6 }} />Trending</span> Now</div>
                        <Link to="/trending" className="btn btn-outline btn-sm">View All</Link>
                    </div>
                    <div className="trending-strip">
                        {loadingTrending ? (
                            <p>Loading trending...</p>
                        ) : trending.length === 0 ? (
                            <p>No trending posts available</p>
                        ) : (
                            trending.map((post, i) => (
                                <Link key={post._id} to={`/post/${post.slug || post._id}`} className="trending-item">
                                    <div className="trending-num">0{i + 1}</div>
                                    <div className="trending-info">
                                        <div className="trending-cat">{post.category}</div>
                                        <div className="trending-title">{post.title}</div>
                                    </div>
                                </Link>
                            )))
                        }
                    </div>
                </div>
            </section>

            {/* ─── MAIN FEED ─── */}
            <section className="home-section">
                <div className="container">
                    <div className="content-with-sidebar">
                        <div>
                            {/* Search result banner */}
                            {searchQ && (
                                <div className="search-header">
                                    <div className="search-header-text">
                                        Results for: "<strong>{searchQ}</strong>"
                                        {pagination.total ? ` — ${pagination.total} articles` : ''}
                                    </div>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setSearchParams({})}>✕ Clear</button>
                                </div>
                            )}

                            {/* Category chips */}
                            {!searchQ && (
                                <div className="tag-chips">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={String(cat.value)}
                                            className={`tag-chip${activeTab === cat.value ? ' active' : ''}`}
                                            onClick={() => { setActiveTab(cat.value); setDateRange(null); }}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Section header */}
                            <div className="section-header">
                                <div className="section-title">
                                    <span><RiNewspaperLine style={{ verticalAlign: 'middle', marginRight: 6 }} />Latest</span> News
                                </div>
                            </div>

                            {/* Grid */}
                            {loading ? (
                                <div className="news-grid">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i}>
                                            <div className="skeleton" style={{ height: 200, marginBottom: 12 }} />
                                            <div className="skeleton" style={{ height: 18, width: '80%', marginBottom: 8 }} />
                                            <div className="skeleton" style={{ height: 14, width: '60%' }} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="news-grid">
                                    {gridPosts.map(post => <NewsCard key={post._id} post={post} />)}
                                </div>
                            )}

                            <Pagination
                                page={pagination.page}
                                pages={pagination.pages}
                                onPageChange={(p) => fetchPosts(p)}
                            />
                        </div>

                        {/* ─── SIDEBAR ─── */}
                        <aside className="sidebar">
                            {/* Calendar */}
                            <CalendarWidget onRangeSelect={(range) => { setDateRange(range); setActiveTab(null); }} />

                            {/* Most Read */}
                            <div>
                                <div className="section-header" style={{ marginBottom: 'var(--space-4)' }}>
                                    <div className="section-title" style={{ fontSize: 'var(--text-lg)' }}>Most <span>Read</span></div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {moreViewsPosts.slice(0, 5).map((post, i) => (
                                        <div key={post._id} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                                            <span style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: 'var(--text-xl)',
                                                color: 'var(--color-border-dark)',
                                                lineHeight: 1,
                                                flexShrink: 0,
                                                minWidth: 28
                                            }}>
                                                {String(i + 1).padStart(2, '0')}
                                            </span>

                                            <Link
                                                to={`/post/${post.slug || post._id}`}
                                                style={{
                                                    fontFamily: 'var(--font-heading)',
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 600,
                                                    color: 'var(--color-text)',
                                                    lineHeight: 1.35,
                                                    transition: 'color var(--transition-fast)'
                                                }}
                                                onMouseEnter={e => e.target.style.color = 'var(--color-primary)'}
                                                onMouseLeave={e => e.target.style.color = 'var(--color-text)'}
                                            >
                                                {post.title} {/* ✅ FIX HERE */}
                                            </Link>
                                        </div>
                                    ))}

                                </div>
                            </div>

                            {/* Tags cloud */}
                            <div>
                                <div className="section-header" style={{ marginBottom: 'var(--space-4)' }}>
                                    <div className="section-title" style={{ fontSize: 'var(--text-lg)' }}>Popular <span>Tags</span></div>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                    {['Modi', 'IPL 2026', 'Budget', 'Bollywood', 'US-India', 'AI Policy', 'Cricket', 'Pakistan', 'Economy', 'Health', 'SC Verdict', 'Climate'].map(tag => (
                                        <Link
                                            key={tag}
                                            to={`/?search=${tag}`}
                                            className="badge badge-muted"
                                            style={{ cursor: 'pointer', transition: 'all var(--transition-fast)', textDecoration: 'none' }}
                                            onMouseEnter={e => { e.target.style.background = 'var(--color-primary)'; e.target.style.color = 'white'; }}
                                            onMouseLeave={e => { e.target.style.background = ''; e.target.style.color = ''; }}
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* ─── FEATURED SECTIONS ─── */}
            {['Sports', 'Business', 'Entertainment', 'Technology'].map(cat => (
                <SectionBlock key={cat} category={cat} />
            ))}
        </main>
    );
}

function SectionBlock({ category }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        postsAPI.getByCategory(category.toLowerCase(), { limit: 4 })
            .then(res => {
                if (res?.data?.posts?.length) {
                    setPosts(res.data.posts);
                } else {
                    setPosts([]);
                }
            })
            .catch(() => setPosts([]));
    }, [category]);

    const items = posts;

    return (
        <section className="home-section featured-section" style={{ background: category === 'Business' ? 'var(--color-bg-soft)' : '' }}>
            <div className="container">
                <div className="section-header">
                    <div className="section-title"><span>{category}</span></div>
                    <Link to={`/category/${category.toLowerCase()}`} className="btn btn-outline btn-sm">
                        More {category}
                    </Link>
                </div>

                {items.length === 0 ? (
                    <p style={{ padding: '20px 0' }}>No {category} posts available</p>
                ) : (
                    <div className="featured-layout">
                        <div className="featured-main ">
                            {items[0] && <SectionNewsCard post={items[0]} />}
                        </div>
                        <div className="featured-sidebar">
                            <div className="featured-sidebar-title">Also in {category}</div>
                            {items.slice(1, 4).map(p => (
                                <NewsCardH key={p._id} post={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}