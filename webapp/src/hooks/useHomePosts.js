import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { postsAPI } from '../api/axios';

export function useHomePosts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQ = searchParams.get('search') || '';

    const [posts, setPosts] = useState([]);
    const [moreViewsPosts, setMoreViewsPosts] = useState([]);
    const [trending, setTrending] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingTrending, setLoadingTrending] = useState(true);

    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [activeTab, setActiveTab] = useState(null);
    const [dateRange, setDateRange] = useState(null);

    /* ── Main posts ─────────────────────────────────────────────── */
    const fetchPosts = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = { page, limit: 9 };
            if (activeTab && activeTab !== 'trending') params.category = activeTab;
            if (searchQ) params.search = searchQ;
            if (dateRange) {
                params.startDate = dateRange.start;
                params.endDate = dateRange.end;
            }

            if (activeTab === 'trending') {
                const res = await postsAPI.getTrending();
                setPosts(res?.data?.posts || []);
                setPagination({ page: 1, pages: 1, total: 0 });
            } else {
                const res = await postsAPI.getAll(params);
                setPosts(res?.data?.posts || []);
                setPagination(res?.data?.pagination || { page: 1, pages: 1 });
            }
        } catch (err) {
            console.error('Posts API error:', err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, [activeTab, searchQ, dateRange]);

    /* ── Trending sidebar ───────────────────────────────────────── */
    const fetchTrending = useCallback(async () => {
        try {
            const res = await postsAPI.getTrending();
            const data = res?.data?.posts;
            setTrending(data?.length ? data.slice(0, 4) : []);
        } catch (err) {
            console.error('Trending API error:', err);
            setTrending([]);
        } finally {
            setLoadingTrending(false);
        }
    }, []);

    /* ── Most-viewed sidebar ────────────────────────────────────── */
    const fetchMoreViews = useCallback(async () => {
        try {
            const res = await postsAPI.getMoreViewsPosts();
            const data = res?.data?.moreViewsPosts;
            setMoreViewsPosts(data?.length ? data : []);
        } catch (err) {
            console.error('More Views API error:', err);
            setMoreViewsPosts([]);
        }
    }, []);

    /* ── Effects ────────────────────────────────────────────────── */
    useEffect(() => { fetchPosts(1); }, [fetchPosts]);
    useEffect(() => { fetchTrending(); }, [fetchTrending]);
    useEffect(() => { fetchMoreViews(); }, [fetchMoreViews]);

    /* ── Handlers ───────────────────────────────────────────────── */
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setDateRange(null);
    };

    const handleDateRange = (range) => {
        setDateRange(range);
        setActiveTab(null);
    };

    const clearSearch = () => setSearchParams({});

    return {
        // data
        posts,
        trending,
        moreViewsPosts,
        pagination,
        // flags
        loading,
        loadingTrending,
        // filters
        activeTab,
        dateRange,
        searchQ,
        // actions
        fetchPosts,
        handleTabChange,
        handleDateRange,
        clearSearch,
    };
}