import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RiSearchLine } from 'react-icons/ri';
import CalendarWidget from '../components/common/CalendarWidget';
import { postsAPI } from '../api/axios';
import NewsCard from '../components/common/NewsCard';
import Pagination from '../components/common/Pagination';
import "../styles/pages/categoryPage.css"

const CAT_META = {
    national: { label: 'National', icon: '🇮🇳', desc: 'Top stories from across India' },
    politics: { label: 'Politics', icon: '🏛️', desc: 'Latest political news and analysis' },
    world: { label: 'World', icon: '🌍', desc: 'International news and global affairs' },
    business: { label: 'Business', icon: '📈', desc: 'Markets, economy and corporate news' },
    sports: { label: 'Sports', icon: '⚽', desc: 'Cricket, IPL, football and more' },
    entertainment: { label: 'Bollywood', icon: '🎬', desc: 'Movies, celebrities and entertainment' },
    technology: { label: 'Technology', icon: '💻', desc: 'Tech trends, AI and digital world' },
    health: { label: 'Health', icon: '❤️', desc: 'Health, wellness and medical news' },
};

export default function CategoryPage() {
    const { category } = useParams();
    const meta = CAT_META[category] || { label: category, icon: '📰', desc: '' };
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagi] = useState({ page: 1, pages: 1, total: 0 });
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState(null);

    const fetchPosts = async (page = 1) => {
        setLoading(true);
        try {
            const params = { page, limit: 12 };
            if (search) params.search = search;
            if (dateRange) { params.startDate = dateRange.start; params.endDate = dateRange.end; }
            const res = await postsAPI.getByCategory(category, params);
            setPosts(res?.data?.posts || []);
            setPagi(res?.data?.pagination || { page: 1, pages: 1, total: 0 });
        } catch {
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { setSearch(''); setDateRange(null); fetchPosts(1); }, [category]);
    useEffect(() => { fetchPosts(1); }, [search, dateRange]);

    return (
        <main className="category-page">
            {/* Banner */}
            <div className="cat-banner">
                <div className="container">
                    <div className="cat-banner-inner">
                        <span className="cat-banner-icon">{meta.icon}</span>
                        <div>
                            <h1 className="cat-banner-title">{meta.label}</h1>
                            <p className="cat-banner-desc">{meta.desc}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-16)' }}>
                <div className="cat-layout">
                    {/* Main */}
                    <div>
                        {/* Search */}
                        <div className="cat-search-bar">
                            <div className="search-input-wrap" style={{ borderRadius: 'var(--radius-md)', width: '100%' }}>
                                <RiSearchLine size={16} className="search-icon" />
                                <input
                                    placeholder={`Search in ${meta.label}…`}
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            {pagination.total > 0 && (
                                <span className="cat-count">{pagination.total} articles</span>
                            )}
                        </div>

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
                        ) : posts.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">🔍</div>
                                <div className="empty-title">No articles found</div>
                                <div className="empty-desc">Try a different search or date range.</div>
                                <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setDateRange(null); }}>
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div className="news-grid">
                                {posts.map(p => <NewsCard key={p._id} post={p} />)}
                            </div>
                        )}

                        <Pagination page={pagination.page} pages={pagination.pages} onPageChange={fetchPosts} />
                    </div>

                    {/* Sidebar */}
                    <aside className="sidebar">
                        <CalendarWidget onRangeSelect={setDateRange} />
                        <div>
                            <div className="section-header" style={{ marginBottom: 'var(--space-4)' }}>
                                <div className="section-title" style={{ fontSize: 'var(--text-lg)' }}>Other <span>Sections</span></div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {Object.entries(CAT_META).filter(([k]) => k !== category).map(([k, v]) => (
                                    <Link key={k} to={`/category/${k}`} className="other-cat-link">
                                        <span>{v.icon}</span>
                                        <span>{v.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

