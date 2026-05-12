import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Komponen Halaman
import Home from './components/Home';
import Catalog from './components/Catalog';
import ProductDetail from './components/ProductDetail';
import CheckoutPage from './components/CheckoutPage';
import UploadResepPage from './components/UploadResepPage';
import BookingPage from './components/BookingPage';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';

// Komponen Halaman Baru
import ArticlePage from './components/ArticlePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';

// Komponen Proteksi Rute Admin
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isAdminRoute && <Navbar />}
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produk" element={<Catalog />} />
          <Route path="/produk/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/upload-resep" element={<UploadResepPage />} />
          <Route path="/booking" element={<BookingPage />} />
          
          {/* Rute Baru */}
          <Route path="/artikel" element={<ArticlePage />} />
          <Route path="/tentang-kami" element={<AboutPage />} />
          <Route path="/kontak" element={<ContactPage />} />
          
          {/* Rute Konsultasi yang mengarah langsung ke WhatsApp untuk sementara, atau bisa kamu buat halaman khusus nantinya */}
          <Route path="/konsultasi" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
              <h2 className="font-poppins font-bold text-2xl text-slate-800 mb-4">Mengarahkan ke WhatsApp...</h2>
              <p className="font-inter text-slateGray">Silakan klik tombol di bawah jika tidak diarahkan secara otomatis.</p>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="mt-6 bg-primary text-white px-6 py-3 rounded-full">
                Buka WhatsApp Sesa
              </a>
            </div>
          } />

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