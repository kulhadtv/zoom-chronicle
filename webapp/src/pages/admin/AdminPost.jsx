import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RiAddLine, RiEditLine, RiDeleteBinLine, RiSearchLine,
  RiCheckLine, RiAlertLine, RiCloseLine
} from 'react-icons/ri';
import Pagination from '../../components/common/Pagination';
import { postsAPI } from '../../api/axios';

export function AdminPost() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagi] = useState({ page: 1, pages: 1, total: 0 });
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null); // { type, msg }
  const [deleteModal, setDeleteModal] = useState({ show: false, postId: null, postTitle: '' });

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await postsAPI.getPostForAdmin({ page, limit: 15, search });
      setPosts(res?.data?.posts || []);
      setPagi(res?.data?.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      setPosts([]);
      setPagi({ page: 1, pages: 3, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(1); }, [search]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const openDeleteModal = (postId, postTitle) => {
    setDeleteModal({ show: true, postId, postTitle });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, postId: null, postTitle: '' });
  };

  const confirmDelete = async () => {
    const { postId } = deleteModal;
    setDeleting(postId);
    closeDeleteModal();
    try {
      await postsAPI.delete(postId);
      setPosts(p => p.filter(x => x._id !== postId));
      setPagi(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      showToast('success', 'Post deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('error', 'Delete failed. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handlePageChange = (newPage) => {
    fetchPosts(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div className={`form-toast ${toast.type}`}>
          {toast.type === 'success' ? <RiCheckLine size={16} /> : <RiAlertLine size={16} />}
          {toast.msg}
        </div>
      )}

      {deleteModal.show && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div
            className="modal max-w-sm rounded-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🗑️</span>
                <div className="modal-title text-base">Delete Post</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={closeDeleteModal}>
                <RiCloseLine size={15} />
              </button>
            </div>

            <div className="modal-body px-5 py-4 gap-2">
              <p className="text-sm text-muted">
                Are you sure you want to permanently delete:
              </p>
              <p className="delete-post-title-preview">
                "{deleteModal.postTitle}"
              </p>
              <p className="text-xs text-muted mt-1">
                This action cannot be undone.
              </p>
            </div>

            <div className="modal-footer px-5 py-3">
              <button className="btn btn-outline btn-sm" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={confirmDelete}
                disabled={deleting === deleteModal.postId}
              >
                {deleting === deleteModal.postId ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <div className="admin-table-title">
            All Posts
            <span className="admin-table-count">({pagination.total})</span>
          </div>

          <div className="admin-table-actions-row">
            <div className="search-input-wrap" style={{ borderRadius: 'var(--radius-md)' }}>
              <RiSearchLine size={14} className="search-icon" />
              <input
                placeholder="Search posts…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: 180 }}
              />
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/admin/posts/new')}
            >
              <RiAddLine size={14} /> New Post
            </button>
          </div>
        </div>

        {/* Scrollable table wrapper for mobile */}
        <div className="admin-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7}>
                      <div className="skeleton" style={{ height: 18, borderRadius: 6 }} />
                    </td>
                  </tr>
                ))
                : posts.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="table-empty-cell">
                        No posts found{search ? ` for "${search}"` : ''}
                      </td>
                    </tr>
                  )
                  : posts.map(p => (
                    <tr key={p._id}>
                      <td className="post-title-cell">
                        <div className="post-title-text">{p.title}</div>
                      </td>
                      <td>
                        <span className="badge badge-soft" style={{ textTransform: 'capitalize' }}>
                          {p.category || '—'}
                        </span>
                      </td>
                      <td>
                        <span className={`pill pill-${p.status || 'published'}`}>
                          {p.status || 'published'}
                        </span>
                      </td>
                      <td className="stat-cell">
                        {(p.views || 0).toLocaleString()}
                      </td>
                      <td className="stat-cell">
                        {p.likes?.length ?? p.likes ?? 0}
                      </td>
                      <td className="date-cell">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
                          : '—'
                        }
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="tbl-btn tbl-btn-edit"
                            onClick={() => navigate(`/admin/posts/${p._id}/edit`)}
                          >
                            <RiEditLine size={11} /> Edit
                          </button>
                          <button
                            className="tbl-btn tbl-btn-delete"
                            onClick={() => openDeleteModal(p._id, p.title)}
                            disabled={deleting === p._id}
                          >
                            <RiDeleteBinLine size={11} />
                            {deleting === p._id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="admin-pagination-wrap">
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Page info */}
      {!loading && posts.length > 0 && (
        <div className="admin-page-info">
          Page {pagination.page} of {pagination.pages} · {pagination.total} total posts
        </div>
      )}
    </div>
  );
}