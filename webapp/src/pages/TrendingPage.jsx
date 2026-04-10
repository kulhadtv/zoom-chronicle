import { useState, useEffect } from 'react';
import { RiFireLine } from 'react-icons/ri';
import { postsAPI } from '../api/axios';
import NewsCard from '../components/common/NewsCard';

export default function TrendingPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        postsAPI.getTrending()
            .then(res => setPosts(res?.data?.posts || DUMMY))
            .catch(() => setPosts(DUMMY))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main>
            <div style={{ background: 'linear-gradient(135deg,#e8232a,#b91c22)', padding: 'var(--space-10) 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <RiFireLine size={48} color="white" />
                        <div>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', color: 'white', lineHeight: 1, letterSpacing: '0.02em' }}>Trending Now</h1>
                            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.06em', marginTop: 'var(--space-2)' }}>Most-read stories right now</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)' }}>
                {loading
                    ? <div className="news-grid">{Array.from({ length: 6 }).map((_, i) => <div key={i}><div className="skeleton" style={{ height: 200, marginBottom: 12 }} /><div className="skeleton" style={{ height: 18, width: '80%', marginBottom: 8 }} /></div>)}</div>
                    : <div className="news-grid">{posts.map(p => <NewsCard key={p._id} post={p} />)}</div>
                }
            </div>
        </main>
    );
}

const DUMMY = Array.from({ length: 9 }, (_, i) => ({
    _id: String(i + 1), slug: `trending-${i + 1}`,
    title: ['Sensex hits record 85,000', 'IPL thriller: MI beats CSK', 'SC privacy verdict shakes Big Tech', 'PM to visit 3 nations', 'Budget 2027 hints leaked', 'Ranveer Netflix deal', 'Dengue alert: 12 states', 'India tops global economy list', 'AI policy bill tabled in Parliament'][i],
    category: ['Business', 'Sports', 'National', 'Politics', 'Business', 'Entertainment', 'Health', 'Business', 'Technology'][i],
    author: { name: 'ZC Desk' }, createdAt: new Date(Date.now() - i * 3600000),
    views: [22100, 18400, 15200, 12800, 11300, 9800, 8400, 7200, 6100][i],
    likes: Array([310, 244, 188, 156, 132, 110, 94, 82, 71][i]),
}));