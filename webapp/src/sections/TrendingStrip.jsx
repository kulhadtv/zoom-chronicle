import { Link } from 'react-router-dom';
import { RiFireLine } from 'react-icons/ri';

export default function TrendingStrip({ trending = [], loadingTrending = false }) {
    return (
        <section
            className="home-section"
            style={{
                paddingTop: 'var(--space-8)',
                paddingBottom: 'var(--space-8)',
                background: 'var(--color-bg-soft)',
                borderTop: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
            }}
        >
            <div className="container">
                <div className="section-header" style={{ marginBottom: 'var(--space-5)' }}>
                    <div className="section-title">
                        <span>
                            <RiFireLine style={{ verticalAlign: 'middle', marginRight: 6 }} />
                            Trending
                        </span>{' '}
                        Now
                    </div>
                    <Link to="/trending" className="btn btn-outline btn-sm">View All</Link>
                </div>

                <div className="trending-strip">
                    {loadingTrending ? (
                        <p>Loading trending...</p>
                    ) : trending.length === 0 ? (
                        <p>No trending posts available</p>
                    ) : (
                        trending.map((post, i) => (
                            <Link
                                key={post._id}
                                to={`/post/${post.slug || post._id}`}
                                className="trending-item"
                            >
                                <div className="trending-num">0{i + 1}</div>
                                <div className="trending-info">
                                    <div className="trending-cat">{post.category}</div>
                                    <div className="trending-title">{post.title}</div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}