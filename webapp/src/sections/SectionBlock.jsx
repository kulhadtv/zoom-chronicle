import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../api/axios';
import { NewsCardH } from '../components/common/NewsCard';
import { SectionNewsCard } from '../components/common/SectionNewsCard';

export default function SectionBlock({ category }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        postsAPI
            .getByCategory(category.toLowerCase(), { limit: 4 })
            .then(res => {
                setPosts(res?.data?.posts?.length ? res.data.posts : []);
            })
            .catch(() => setPosts([]));
    }, [category]);

    return (
        <section
            className="home-section featured-section"
            style={{ background: category === 'Business' ? 'var(--color-bg-soft)' : '' }}
        >
            <div className="container">
                <div className="section-header">
                    <div className="section-title">
                        <span>{category}</span>
                    </div>
                    <Link to={`/category/${category.toLowerCase()}`} className="btn btn-outline btn-sm">
                        More {category}
                    </Link>
                </div>

                {posts.length === 0 ? (
                    <p style={{ padding: '20px 0' }}>No {category} posts available</p>
                ) : (
                    <div className="featured-layout">
                        <div className="featured-main">
                            {posts[0] && <SectionNewsCard post={posts[0]} />}
                        </div>
                        <div className="featured-sidebar">
                            <div className="featured-sidebar-title">Also in {category}</div>
                            {posts.slice(1, 4).map(p => (
                                <NewsCardH key={p._id} post={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}