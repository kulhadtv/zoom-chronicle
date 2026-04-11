import { useState, useEffect } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { HeroCard } from '../components/common/NewsCard';


export default function HeroSection({ posts = [] }) {
    const [slide, setSlide] = useState(0);

    useEffect(() => { setSlide(0); }, [posts]);

    useEffect(() => {
        if (!posts.length) return;
        const t = setInterval(() => {
            setSlide(s => (s + 1 >= posts.length ? 0 : s + 1));
        }, 5000);
        return () => clearInterval(t);
    }, [posts.length]);

    if (!posts.length) return null;

    const prev = () => setSlide(s => (s - 1 + posts.length) % posts.length);
    const next = () => setSlide(s => (s + 1) % posts.length);

    return (
        <section className="hero-section">
            <div className="container">
                <div className="hero-carousel">
                    {posts.map((post, i) => (
                        <div key={post._id} className={`hero-slide${i === slide ? ' active' : ''}`}>
                            <HeroCard post={post} />
                        </div>
                    ))}

                    <button className="hero-arrow hero-arrow-left" onClick={prev} aria-label="Previous">
                        <RiArrowLeftSLine size={20} />
                    </button>
                    <button className="hero-arrow hero-arrow-right" onClick={next} aria-label="Next">
                        <RiArrowRightSLine size={20} />
                    </button>

                    <div className="hero-dots">
                        {posts.map((_, i) => (
                            <button
                                key={i}
                                className={`hero-dot${i === slide ? ' active' : ''}`}
                                onClick={() => setSlide(i)}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}