import '../styles/home.css';
import { useHomePosts } from '../hooks/useHomePosts';
import HeroSection from '../sections/HeroSection';
import TrendingStrip from '../sections/TrendingStrip';
import MainFeed from '../sections/MainFeed';
import SectionBlock from '../sections/SectionBlock';

const FEATURED_CATEGORIES = ['Sports', 'Business', 'Entertainment', 'Technology'];

/**
 * HomePage
 * Thin orchestrator — all data lives in useHomePosts,
 * all UI lives in the section components.
 */
export default function HomePage() {
    const {
        posts,
        trending,
        moreViewsPosts,
        pagination,
        loading,
        loadingTrending,
        activeTab,
        searchQ,
        fetchPosts,
        handleTabChange,
        handleDateRange,
        clearSearch,
    } = useHomePosts();

    return (
        <main>
            <HeroSection posts={posts} />

            <TrendingStrip trending={trending} loadingTrending={loadingTrending} />

            <MainFeed
                posts={posts}
                moreViewsPosts={moreViewsPosts}
                pagination={pagination}
                loading={loading}
                activeTab={activeTab}
                searchQ={searchQ}
                onTabChange={handleTabChange}
                onDateRange={handleDateRange}
                onClearSearch={clearSearch}
                onPageChange={(p) => fetchPosts(p)}
            />

            {FEATURED_CATEGORIES.map(cat => (
                <SectionBlock key={cat} category={cat} />
            ))}
        </main>
    );
}