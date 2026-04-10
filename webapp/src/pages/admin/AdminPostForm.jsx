import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    RiArrowLeftLine, RiFileTextLine, RiImageLine, RiPriceTag3Line,
    RiSettings3Line, RiSaveLine, RiSendPlane2Line, RiCloseLine,
    RiBold, RiItalic, RiH1, RiH2, RiListUnordered, RiListOrdered,
    RiDoubleQuotesL, RiLinkM, RiImageAddLine, RiEyeLine, RiLoader4Line,
    RiCheckLine, RiAlertLine, RiRefreshLine,
} from 'react-icons/ri';
import '../../styles/pages/adminPostForm.css';
import { postsAPI } from '../../api/axios';

const CATEGORIES = [
    { value: 'trending', label: '🔥 Trending' },
    { value: 'bollywood', label: '🎥 Bollywood' },
    { value: 'hollywood', label: '🎬 Hollywood' },
    { value: 'news', label: '📰 News' },
    { value: 'entertainment', label: '🎭 Entertainment' },
    { value: 'sports', label: '⚽ Sports' },
    { value: 'politics', label: '🏛️ Politics' },
    { value: 'technology', label: '💻 Technology' },
    { value: 'lifestyle', label: '🌿 Lifestyle' },
    { value: 'business', label: '📈 Business' },
    { value: 'health', label: '❤️ Health' },
    { value: 'science', label: '🔬 Science' },
    { value: 'travel', label: '✈️ Travel' },
    { value: 'food', label: '🍔 Food' },
    { value: 'fashion', label: '👗 Fashion' },
    { value: 'art', label: '🎨 Art' },
    { value: 'music', label: '🎵 Music' },
    { value: 'education', label: '📚 Education' },
    { value: 'environment', label: '🌱 Environment' }
];

const slugify = (str) =>
    str.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80);

const wordCount = (str) =>
    str.trim().split(/\s+/).filter(Boolean).length;

const readTime = (str) =>
    Math.max(1, Math.round(wordCount(str) / 200));

export default function AdminPostForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id && id !== 'new';

    /* ── form state ── */
    const [form, setForm] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        status: 'published',
    });
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [images, setImages] = useState([]);     // File objects
    const [previews, setPreviews] = useState([]);     // data URLs
    const [existingImgs, setExistingImgs] = useState([]); // URLs from API
    const [dragOver, setDragOver] = useState(false);

    /* ── ui state ── */
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null); // { type, msg }
    const [slugEdited, setSlugEdited] = useState(false);

    const contentRef = useRef(null);
    const fileInputRef = useRef(null);

    /* ── load post for edit ── */
    useEffect(() => {
        if (!isEdit) return;
        postsAPI.getById(id)
            .then(res => {
                const p = res?.data?.post || res?.data;
                if (!p) return;
                setForm({
                    title: p.title || '',
                    slug: p.slug || '',
                    excerpt: p.excerpt || '',
                    content: p.content || '',
                    category: p.category || '',
                    status: p.status || 'published',
                });
                setTags(p.tags || []);
                setExistingImgs(p.images || []);
                setSlugEdited(true);
            })
            .catch(() => showToast('error', 'Could not load post data.'))
            .finally(() => setLoading(false));
    }, [id]);

    /* ── auto-generate slug from title ── */
    useEffect(() => {
        if (!slugEdited && form.title) {
            setForm(f => ({ ...f, slug: slugify(f.title) }));
        }
    }, [form.title, slugEdited]);

    /* ── generate image previews ── */
    useEffect(() => {
        if (!images.length) { setPreviews([]); return; }
        const urls = [];
        let done = 0;
        images.forEach((file, i) => {
            const reader = new FileReader();
            reader.onload = e => {
                urls[i] = e.target.result;
                if (++done === images.length) setPreviews([...urls]);
            };
            reader.readAsDataURL(file);
        });
    }, [images]);

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    /* ── field change ── */
    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    /* ── toolbar actions ── */
    const insertAt = (before, after = '') => {
        const ta = contentRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const sel = ta.value.slice(start, end);
        const newVal = ta.value.slice(0, start) + before + sel + after + ta.value.slice(end);
        set('content', newVal);
        setTimeout(() => {
            ta.focus();
            ta.setSelectionRange(start + before.length, start + before.length + sel.length);
        }, 0);
    };

    const TOOLBAR = [
        { icon: <RiBold size={14} />, title: 'Bold', action: () => insertAt('<strong>', '</strong>') },
        { icon: <RiItalic size={14} />, title: 'Italic', action: () => insertAt('<em>', '</em>') },
        null,
        { icon: <RiH1 size={14} />, title: 'Heading 2', action: () => insertAt('<h2>', '</h2>') },
        { icon: <RiH2 size={14} />, title: 'Heading 3', action: () => insertAt('<h3>', '</h3>') },
        null,
        { icon: <RiListUnordered size={14} />, title: 'Bullet list', action: () => insertAt('<ul>\n  <li>', '</li>\n</ul>') },
        { icon: <RiListOrdered size={14} />, title: 'Numbered list', action: () => insertAt('<ol>\n  <li>', '</li>\n</ol>') },
        null,
        { icon: <RiDoubleQuotesL size={14} />, title: 'Blockquote', action: () => insertAt('<blockquote>', '</blockquote>') },
        { icon: <RiLinkM size={14} />, title: 'Link', action: () => insertAt('<a href="">', '</a>') },
    ];

    /* ── tags ── */
    const addTag = (raw) => {
        const t = raw.trim().replace(/[^a-zA-Z0-9\s]/g, '').trim();
        if (t && !tags.includes(t) && tags.length < 10) setTags(ts => [...ts, t]);
        setTagInput('');
    };
    const removeTag = (t) => setTags(ts => ts.filter(x => x !== t));
    const onTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); }
        if (e.key === 'Backspace' && !tagInput && tags.length) setTags(ts => ts.slice(0, -1));
    };

    /* ── image handling ── */
    const addImages = (files) => {
        const valid = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 5 - images.length);
        setImages(prev => [...prev, ...valid].slice(0, 5));
    };
    const removeNewImage = (i) => { setImages(prev => prev.filter((_, j) => j !== i)); };
    const removeExistImg = (url) => setExistingImgs(prev => prev.filter(u => u !== url));

    /* ── drag & drop ── */
    const onDrop = (e) => {
        e.preventDefault(); setDragOver(false);
        addImages(e.dataTransfer.files);
    };

    /* ── submit ── */
    const handleSubmit = async (statusOverride) => {
        const submitStatus = statusOverride || form.status;
        if (!form.title.trim()) { setError('Title is required.'); return; }
        if (!form.category) { setError('Please select a category.'); return; }
        if (!form.content.trim()) { setError('Content cannot be empty.'); return; }
        setError('');
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('title', form.title.trim());
            fd.append('slug', form.slug || slugify(form.title));
            fd.append('excerpt', form.excerpt.trim());
            fd.append('content', form.content.trim());
            fd.append('category', form.category);
            fd.append('status', submitStatus);
            tags.forEach(t => fd.append('tags[]', t));
            images.forEach(img => fd.append('images', img));
            existingImgs.forEach(url => fd.append('existingImages[]', url));

            if (isEdit) await postsAPI.update(id, fd);
            else await postsAPI.create(fd);

            showToast('success', isEdit ? 'Post updated successfully!' : 'Post published successfully!');
            setTimeout(() => navigate('/admin/posts'), 1200);
        } catch (err) {
            setError(err?.message || 'Save failed. Please check your connection and try again.');
        } finally {
            setSaving(false);
        }
    };

    /* ─────────────────────────────────────────
       LOADING SKELETON
    ───────────────────────────────────────── */
    if (loading) return (
        <div className="post-form-page">
            <div className="post-form-header">
                <div className="skeleton" style={{ width: 200, height: 28, borderRadius: 8 }} />
            </div>
            <div className="post-form-layout">
                <div className="post-form-main">
                    {[80, 48, 48, 320, 80].map((h, i) => (
                        <div key={i} className="form-card">
                            <div className="form-card-body">
                                <div className="skeleton" style={{ height: h }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="post-form-meta">
                    {[160, 120, 100].map((h, i) => (
                        <div key={i} className="skeleton" style={{ height: h, borderRadius: 12 }} />
                    ))}
                </div>
            </div>
        </div>
    );

    /* ─────────────────────────────────────────
       MAIN RENDER
    ───────────────────────────────────────── */
    return (
        <div className="post-form-page">

            {/* ── Toast ── */}
            {toast && (
                <div className={`form-toast ${toast.type}`}>
                    {toast.type === 'success' ? <RiCheckLine size={16} /> : <RiAlertLine size={16} />}
                    {toast.msg}
                </div>
            )}

            {/* ── Page Header ── */}
            <div className="post-form-header">
                <div className="post-form-header-left">
                    <button className="post-form-back" onClick={() => navigate('/admin/posts')}>
                        <RiArrowLeftLine size={16} />
                    </button>
                    <div>
                        <div className="post-form-title">
                            {isEdit ? 'Edit Post' : 'Create New Post'}
                        </div>
                        <div className="post-form-subtitle">
                            {isEdit ? `Editing: ${form.title.slice(0, 50) || 'Untitled'}` : 'Fill in the details below to publish a new article'}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={() => window.open(`/post/${form.slug}`, '_blank')}
                        disabled={!form.slug || !isEdit}
                    >
                        <RiEyeLine size={14} /> Preview
                    </button>
                </div>
            </div>

            {/* ── Error Banner ── */}
            {error && (
                <div className="form-error-banner" style={{ marginBottom: 'var(--space-5)' }}>
                    <RiAlertLine size={18} />
                    {error}
                    <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex' }} onClick={() => setError('')}>
                        <RiCloseLine size={16} />
                    </button>
                </div>
            )}

            <div className="post-form-layout">

                {/* ═══════════════════════════════════
            LEFT — MAIN CONTENT
        ═══════════════════════════════════ */}
                <div className="post-form-main">

                    {/* ── Title & Slug ── */}
                    <div className="form-card">
                        <div className="form-card-header">
                            <div className="form-card-icon"><RiFileTextLine size={15} /></div>
                            <div className="form-card-label">Article Details</div>
                        </div>
                        <div className="form-card-body">
                            <div className="form-group">
                                <label className="form-label">Title <span style={{ color: 'var(--color-primary)' }}>*</span></label>
                                <input
                                    className="title-input"
                                    placeholder="Enter a compelling headline…"
                                    value={form.title}
                                    onChange={e => set('title', e.target.value)}
                                    maxLength={160}
                                />
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)', textAlign: 'right' }}>
                                    {form.title.length}/160
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">URL Slug</label>
                                <div className="slug-row">
                                    <input
                                        className="slug-input"
                                        placeholder="url-slug"
                                        value={form.slug}
                                        onChange={e => { setSlugEdited(true); set('slug', slugify(e.target.value)); }}
                                    />
                                    <button
                                        type="button"
                                        className="slug-gen-btn"
                                        onClick={() => { setSlugEdited(false); set('slug', slugify(form.title)); }}
                                    >
                                        <RiRefreshLine size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                                        Auto
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Excerpt / Summary</label>
                                <textarea
                                    className="form-textarea"
                                    style={{ minHeight: 90 }}
                                    placeholder="A short summary shown on news cards and in search results (max 300 chars)…"
                                    value={form.excerpt}
                                    maxLength={300}
                                    onChange={e => set('excerpt', e.target.value)}
                                />
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)', textAlign: 'right' }}>
                                    {form.excerpt.length}/300
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Content Editor ── */}
                    <div className="form-card">
                        <div className="form-card-header">
                            <div className="form-card-icon"><RiFileTextLine size={15} /></div>
                            <div className="form-card-label">Article Content</div>
                            <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)' }}>
                                HTML supported
                            </div>
                        </div>
                        <div className="form-card-body" style={{ padding: 0, gap: 0 }}>
                            <div className="editor-wrap" style={{ border: 'none', borderRadius: 0 }}>
                                {/* Toolbar */}
                                <div className="editor-toolbar">
                                    {TOOLBAR.map((btn, i) =>
                                        btn === null
                                            ? <div key={`div-${i}`} className="toolbar-divider" />
                                            : (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    className="toolbar-btn"
                                                    title={btn.title}
                                                    onClick={btn.action}
                                                >
                                                    {btn.icon}
                                                </button>
                                            )
                                    )}
                                </div>

                                {/* Textarea */}
                                <textarea
                                    ref={contentRef}
                                    className="editor-textarea"
                                    placeholder="Write your full article here…&#10;&#10;You can use HTML tags like <h2>, <p>, <strong>, <em>, <blockquote>, <ul>, <li>, <a href=&quot;&quot;>…&#10;&#10;Or use the toolbar above to insert formatting."
                                    value={form.content}
                                    onChange={e => set('content', e.target.value)}
                                />

                                <div className="editor-footer">
                                    <span className="editor-hint">💡 Use toolbar or type HTML tags directly</span>
                                    <span className="editor-word-count">
                                        {wordCount(form.content)} words · ~{readTime(form.content)} min read
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Images ── */}
                    <div className="form-card">
                        <div className="form-card-header">
                            <div className="form-card-icon"><RiImageLine size={15} /></div>
                            <div className="form-card-label">Media / Images</div>
                            <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)' }}>
                                {images.length + existingImgs.length}/5 images
                            </div>
                        </div>
                        <div className="form-card-body">

                            {/* Existing images (edit mode) */}
                            {existingImgs.length > 0 && (
                                <>
                                    <div className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Current Images</div>
                                    <div className="image-previews">
                                        {existingImgs.map((url, i) => (
                                            <div key={url} className={`image-preview-item${i === 0 ? ' is-cover' : ''}`}>
                                                <img src={url} alt={`Image ${i + 1}`} />
                                                <button type="button" className="image-remove-btn" onClick={() => removeExistImg(url)}>
                                                    <RiCloseLine size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="divider" style={{ margin: 'var(--space-2) 0' }} />
                                </>
                            )}

                            {/* Dropzone */}
                            {(images.length + existingImgs.length) < 5 && (
                                <label
                                    className={`image-dropzone${dragOver ? ' drag-over' : ''}`}
                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={onDrop}
                                >
                                    <div className="dropzone-icon"><RiImageAddLine size={22} /></div>
                                    <div className="dropzone-text">
                                        <span>Click to upload</span> or drag & drop
                                    </div>
                                    <div className="dropzone-hint">PNG, JPG, WEBP — max 5 images total · First image = cover photo</div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={e => addImages(e.target.files)}
                                    />
                                </label>
                            )}

                            {/* New image previews */}
                            {previews.length > 0 && (
                                <>
                                    <div className="form-label" style={{ marginBottom: 'var(--space-2)' }}>New Uploads</div>
                                    <div className="image-previews">
                                        {previews.map((src, i) => (
                                            <div
                                                key={i}
                                                className={`image-preview-item${existingImgs.length === 0 && i === 0 ? ' is-cover' : ''}`}
                                            >
                                                <img src={src} alt={`Preview ${i + 1}`} />
                                                <button type="button" className="image-remove-btn" onClick={() => removeNewImage(i)}>
                                                    <RiCloseLine size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                </div>

                {/* ═══════════════════════════════════
            RIGHT — META SIDEBAR
        ═══════════════════════════════════ */}
                <div className="post-form-meta">

                    {/* ── Publish ── */}
                    <div className="form-card">
                        <div className="form-card-header">
                            <div className="form-card-icon"><RiSendPlane2Line size={15} /></div>
                            <div className="form-card-label">Publish</div>
                        </div>
                        <div className="form-card-body">
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <div className="meta-status-btns">
                                    <button
                                        type="button"
                                        className={`status-btn${form.status === 'published' ? ' active-published' : ''}`}
                                        onClick={() => set('status', 'published')}
                                    >
                                        ✅ Published
                                    </button>
                                    <button
                                        type="button"
                                        className={`status-btn${form.status === 'draft' ? ' active-draft' : ''}`}
                                        onClick={() => set('status', 'draft')}
                                    >
                                        📝 Draft
                                    </button>
                                </div>
                            </div>

                            <div className="divider" />

                            <button
                                type="button"
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={() => handleSubmit()}
                                disabled={saving}
                            >
                                {saving
                                    ? <><RiLoader4Line size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</>
                                    : <><RiSendPlane2Line size={15} /> {isEdit ? 'Update Post' : 'Publish Now'}</>
                                }
                            </button>

                            {form.status === 'published' && !isEdit && (
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    onClick={() => handleSubmit('draft')}
                                    disabled={saving}
                                >
                                    <RiSaveLine size={15} /> Save as Draft
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── Category ── */}
                    <div className="form-card">
                        <div className="form-card-header">
                            <div className="form-card-icon"><RiSettings3Line size={15} /></div>
                            <div className="form-card-label">Category</div>
                        </div>
                        <div className="form-card-body">
                            <div className="form-group">
                                <select
                                    className="form-select"
                                    value={form.category}
                                    onChange={e => set('category', e.target.value)}
                                >
                                    <option value="">— Select a category —</option>
                                    {CATEGORIES.map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ── Tags ── */}
                    <div className="form-card">
                        <div className="form-card-header">
                            <div className="form-card-icon"><RiPriceTag3Line size={15} /></div>
                            <div className="form-card-label">Tags</div>
                            <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)' }}>
                                {tags.length}/10
                            </div>
                        </div>
                        <div className="form-card-body">
                            <div
                                className="tags-wrap"
                                onClick={() => document.getElementById('tag-input')?.focus()}
                            >
                                {tags.map(t => (
                                    <span key={t} className="tag-pill">
                                        #{t}
                                        <button type="button" className="tag-pill-remove" onClick={() => removeTag(t)}>
                                            ×
                                        </button>
                                    </span>
                                ))}
                                <input
                                    id="tag-input"
                                    className="tag-input"
                                    placeholder={tags.length === 0 ? 'Add tags…' : ''}
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={onTagKeyDown}
                                    onBlur={() => tagInput && addTag(tagInput)}
                                    disabled={tags.length >= 10}
                                />
                            </div>
                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)' }}>
                                Press <kbd style={{ background: 'var(--color-bg-muted)', padding: '1px 5px', borderRadius: 3, border: '1px solid var(--color-border)' }}>Enter</kbd> or <kbd style={{ background: 'var(--color-bg-muted)', padding: '1px 5px', borderRadius: 3, border: '1px solid var(--color-border)' }}>,</kbd> to add a tag
                            </div>

                            {/* Suggested tags based on category */}
                            {form.category && SUGGESTED_TAGS[form.category]?.length > 0 && (
                                <div>
                                    <div className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Suggestions</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                        {SUGGESTED_TAGS[form.category]
                                            .filter(t => !tags.includes(t))
                                            .slice(0, 6)
                                            .map(t => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    className="badge badge-muted"
                                                    style={{ cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                                                    onClick={() => addTag(t)}
                                                >
                                                    + {t}
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Article Stats (edit only) ── */}
                    {form.content && (
                        <div className="form-card">
                            <div className="form-card-header">
                                <div className="form-card-icon">📊</div>
                                <div className="form-card-label">Article Stats</div>
                            </div>
                            <div className="form-card-body" style={{ gap: 'var(--space-3)' }}>
                                {[
                                    { label: 'Word Count', value: wordCount(form.content).toLocaleString() },
                                    { label: 'Read Time', value: `~${readTime(form.content)} min` },
                                    { label: 'Characters', value: form.content.length.toLocaleString() },
                                ].map(s => (
                                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{s.label}</span>
                                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text)' }}>{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

const SUGGESTED_TAGS = {
    national: ['India', 'Modi', 'Government', 'Policy', 'Supreme Court'],
    politics: ['BJP', 'Congress', 'Parliament', 'Election', 'Democracy'],
    world: ['USA', 'China', 'Pakistan', 'UN', 'Geopolitics'],
    business: ['Sensex', 'GDP', 'RBI', 'Startup', 'Economy'],
    sports: ['Cricket', 'IPL', 'FIFA', 'Olympics', 'Virat Kohli'],
    entertainment: ['Bollywood', 'Netflix', 'OTT', 'Movies', 'SRK'],
    technology: ['AI', 'Startup', 'App', '5G', 'Meta'],
    health: ['WHO', 'Hospital', 'Diet', 'Mental Health', 'Fitness'],
};