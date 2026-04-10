import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import NotificationBell from './components/common/NotificationBell';
import HomePage from './pages/Home';
import PostDetail from './pages/Postdetail';
import CategoryPage from './pages/CategoryPage';
import TrendingPage from './pages/TrendingPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoutes';
import AdminDashboard from './pages/admin/AdminDashboard';
import { AdminPost } from './pages/admin/AdminPost';
import AdminUsers from './pages/admin/AdminUser';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminPostForm from './pages/admin/AdminPostForm';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <NotificationBell />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ── Public pages ── */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/post/:slug" element={<PublicLayout><PostDetail /></PublicLayout>} />
        <Route path="/category/:category" element={<PublicLayout><CategoryPage /></PublicLayout>} />
        <Route path="/trending" element={<PublicLayout><TrendingPage /></PublicLayout>} />

        {/* ── Admin auth ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Admin panel (protected) ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="posts" element={<AdminPost />} />
          <Route path="posts/new" element={<AdminPostForm />} />
          <Route path="posts/:id/edit" element={<AdminPostForm />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={
          <PublicLayout>
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)', textAlign: 'center', padding: 'var(--space-8)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-5xl)', color: 'var(--color-primary)' }}>404</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>Page not found</div>
              <a href="/" className="btn btn-primary">← Go Home</a>
            </div>
          </PublicLayout>
        } />
      </Routes>
    </AuthProvider>
  );
}