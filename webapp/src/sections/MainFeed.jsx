import { Link } from 'react-router-dom';
import { RiNewspaperLine } from 'react-icons/ri';
import NewsCard from '../components/common/NewsCard';
import CalendarWidget from '../components/common/CalendarWidget';
import Pagination from '../components/common/Pagination';
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

const POPULAR_TAGS = [
    'Modi', 'IPL 2026', 'Budget', 'Bollywood',
    'US-India', 'AI Policy', 'Cricket', 'Pakistan',
    'Economy', 'Health', 'SC Verdict', 'Climate',
];

export default function MainFeed({
    posts = [],
    moreViewsPosts = [],
    pagination = { page: 1, pages: 1, total: 0 },
    loading = false,
    activeTab,
    searchQ,
    onTabChange,
    onDateRange,
    onClearSearch,
    onPageChange,
}) {
    const gridPosts = posts.slice(0, 9);

    return (
        <section className="home-section">
            <div className="container">
                <div className="content-with-sidebar">
                    {/* ── Main column ──────────────────────────────── */}
                    <div>
                        {/* Search result banner */}
                        {searchQ && (
                            <div className="search-header">
                                <div className="search-header-text">
                                    Results for: "<strong>{searchQ}</strong>"
                                    {pagination.total ? ` — ${pagination.total} articles` : ''}
                                </div>
                                <button className="btn btn-ghost btn-sm" onClick={onClearSearch}>
                                    ✕ Clear
                                </button>
                            </div>
                        )}

                        {/* Category chips */}
                        {!searchQ && (
                            <div className="tag-chips">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={String(cat.value)}
                                        className={`tag-chip${activeTab === cat.value ? ' active' : ''}`}
                                        onClick={() => onTabChange(cat.value)}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Section header */}
                        <div className="section-header">
                            <div className="section-title">
                                <span>
                                    <RiNewspaperLine style={{ verticalAlign: 'middle', marginRight: 6 }} />
                                    Latest
                                </span>{' '}
                                News
                            </div>
                        </div>

                        {/* News grid */}
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
                            onPageChange={onPageChange}
                        />
                    </div>

                    {/* ── Sidebar ───────────────────────────────────── */}
                    <aside className="sidebar">
                        {/* Calendar filter */}
                        <CalendarWidget onRangeSelect={onDateRange} />

                        {/* Most Read */}
                        <div>
                            <div className="section-header" style={{ marginBottom: 'var(--space-4)' }}>
                                <div className="section-title" style={{ fontSize: 'var(--text-lg)' }}>
                                    Most <span>Read</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {moreViewsPosts.slice(0, 5).map((post, i) => (
                                    <div
                                        key={post._id}
                                        style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}
                                    >
                                        <span style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 'var(--text-xl)',
                                            color: 'var(--color-border-dark)',
                                            lineHeight: 1,
                                            flexShrink: 0,
                                            minWidth: 28,
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
                                                transition: 'color var(--transition-fast)',
                                            }}
                                            onMouseEnter={e => (e.target.style.color = 'var(--color-primary)')}
                                            onMouseLeave={e => (e.target.style.color = 'var(--color-text)')}
                                        >
                                            {post.title}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Popular Tags */}
                        <div>
                            <div className="section-header" style={{ marginBottom: 'var(--space-4)' }}>
                                <div className="section-title" style={{ fontSize: 'var(--text-lg)' }}>
                                    Popular <span>Tags</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                {POPULAR_TAGS.map(tag => (
                                    <Link
                                        key={tag}
                                        to={`/?search=${tag}`}
                                        className="badge badge-muted"
                                        style={{
                                            cursor: 'pointer',
                                            transition: 'all var(--transition-fast)',
                                            textDecoration: 'none',
                                        }}
                                        onMouseEnter={e => {
                                            e.target.style.background = 'var(--color-primary)';
                                            e.target.style.color = 'white';
                                        }}
                                        onMouseLeave={e => {
                                            e.target.style.background = '';
                                            e.target.style.color = '';
                                        }}
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
    );
}