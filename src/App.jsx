import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ReactGA from 'react-ga4'; 

import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './components/Home';
import Catalog from './components/Catalog';
import ProductDetail from './components/ProductDetail';
import CheckoutPage from './components/CheckoutPage';
import UploadResepPage from './components/UploadResepPage';
import BookingPage from './components/BookingPage';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import ArticlePage from './components/ArticlePage';
import ArticleDetail from './components/ArticleDetail';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ConsultationPage from './components/ConsultationPage';
import TrackingPage from './components/TrackingPage';

// ID GOOGLE ANALYTICS RESMI
ReactGA.initialize('G-B7BQVM3YRT');

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);

  return null; 
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnalyticsTracker />
      {!isAdminRoute && <Navbar />}
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produk" element={<Catalog />} />
          <Route path="/produk/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/upload-resep" element={<UploadResepPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/lacak-pesanan" element={<TrackingPage />} />
          
          <Route path="/artikel" element={<ArticlePage />} />
          <Route path="/artikel/:id" element={<ArticleDetail />} />
          
          <Route path="/tentang-kami" element={<AboutPage />} />
          <Route path="/kontak" element={<ContactPage />} />
          <Route path="/konsultasi" element={<ConsultationPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppLayout />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;