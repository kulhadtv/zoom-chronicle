import { useState, useEffect } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { HeroCard } from '../components/common/NewsCard';


export default function HeroSection({ posts = [] }) {
    const [slide, setSlide] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    useEffect(() => { setSlide(0); }, [posts]);

    useEffect(() => {
        if (!posts.length) return;
        const t = setInterval(() => {
            setSlide(s => (s + 1 >= posts.length ? 0 : s + 1));
        }, 5000);
        return () => clearInterval(t);
    }, [posts.length]);

    useEffect(() => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        const prev = () => setSlide(s => (s - 1 + posts.length) % posts.length);
        const next = () => setSlide(s => (s + 1) % posts.length);

        if (isLeftSwipe) {
            next();
        } else if (isRightSwipe) {
            prev();
        }
    }, [touchStart, touchEnd, posts.length]);

    if (!posts.length) return null;

    const prev = () => setSlide(s => (s - 1 + posts.length) % posts.length);
    const next = () => setSlide(s => (s + 1) % posts.length);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        setTouchEnd(e.changedTouches[0].clientX);
    };

    return (
        <section className="hero-section">
            <div className="container">
                <div className="hero-carousel" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
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