import { Link } from 'react-router-dom';
import {
    RiTwitterXFill, RiFacebookFill, RiInstagramLine,
    RiYoutubeFill, RiWhatsappLine,
} from 'react-icons/ri';
import "../../styles/footer.css"

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">

                    {/* Brand */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <img src="/zoomchronicle.png" alt="Zoom Chronicle" />
                            <div>
                                <div className="footer-logo-text">Zoom Chronicle</div>
                                <div className="footer-logo-sub">Aapka Apna News</div>
                            </div>
                        </div>
                        <p className="footer-desc">
                            Your trusted source for breaking news, in-depth analysis, and stories
                            that matter — from across India and around the world.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-icon" aria-label="Twitter"><RiTwitterXFill /></a>
                            <a href="#" className="social-icon" aria-label="Facebook"><RiFacebookFill /></a>
                            <a href="#" className="social-icon" aria-label="Instagram"><RiInstagramLine /></a>
                            <a href="#" className="social-icon" aria-label="YouTube"><RiYoutubeFill /></a>
                            <a href="#" className="social-icon" aria-label="WhatsApp"><RiWhatsappLine /></a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <div className="footer-col-title">Categories</div>
                        <div className="footer-links">
                            {['National', 'Politics', 'World', 'Business', 'Sports', 'Bollywood', 'Technology', 'Health'].map(c => (
                                <Link key={c} to={`/category/${c.toLowerCase()}`} className="footer-link">{c}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <div className="footer-col-title">Quick Links</div>
                        <div className="footer-links">
                            <Link to="/" className="footer-link">Home</Link>
                            <Link to="/trending" className="footer-link">Trending News</Link>
                            <Link to="/archive" className="footer-link">News Archive</Link>
                            <Link to="/about" className="footer-link">About Us</Link>
                            <Link to="/contact" className="footer-link">Contact</Link>
                            <Link to="/advertise" className="footer-link">Advertise</Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <div className="footer-col-title">Contact</div>
                        <div className="footer-links">
                            <span className="footer-link">📧 news@zoomchronicle.in</span>
                            <span className="footer-link">📞 +91 98765 43210</span>
                            <span className="footer-link">📍 Mumbai, Maharashtra</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-copyright">
                        © {new Date().getFullYear()} Zoom Chronicle. All rights reserved.
                    </div>
                    <div className="footer-bottom-links">
                        <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
                        <Link to="/terms" className="footer-bottom-link">Terms of Use</Link>
                        <Link to="/sitemap" className="footer-bottom-link">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}