import { RiTimeLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { timeAgo } from "./NewsCard";
import "../../styles/home.css";
import "../../styles/sectionNewsCard.css";

export function SectionNewsCard({ post }) {
    return (
        <Link to={`/post/${post.slug || post._id}`} className="news-card-hero fixed">
            
            {post.images?.[0] || post.thumbnail ? (
                <img
                    src={post.images?.[0] || post.thumbnail}
                    alt={post.title}
                />
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        background: 'var(--color-bg-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '4rem'
                    }}
                >
                    📰
                </div>
            )}

            {/* <div className="hero-overlay" /> */}

            <div className="hero-content">
                {post.category && (
                    <div className="hero-cat">
                        <span className="badge badge-primary">
                            {post.category}
                        </span>
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