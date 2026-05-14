import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const WaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const Navbar = () => {
  const { cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate(); // Fungsi untuk pindah halaman
  
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // State untuk kotak pencarian
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Diperbaiki: dari item.qty ke item.quantity sesuai CartContext
  const waLink = "https://wa.me/62895416801490?text=Halo%20SESA%20Dermatology,%20saya%20ingin%20berkonsultasi.";

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/konsultasi', label: 'Konsultasi' },
    { to: '/booking', label: 'Booking Dokter' },
    { to: '/produk', label: 'Produk' },
    { to: '/artikel', label: 'Artikel' },
    { to: '/tentang-kami', label: 'Tentang Kami' },
    { to: '/kontak', label: 'Kontak' },
  ];

  // Fungsi Eksekusi Pencarian
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/produk?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
      setMobileOpen(false); // Tutup menu mobile jika pencarian dari mobile
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-[#fce7f0] shadow-[0_1px_0_0_#fce7f0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-[72px]">

          {/* ── LOGO ── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/images/Sesa.jpeg"
              alt="SESA Dermatology"
              className="h-[48px] w-[48px] object-contain rounded-full"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="flex flex-col leading-none">
              <span
                className="font-poppins font-bold leading-none"
                style={{ fontSize: 30, background: 'linear-gradient(135deg, #EC6BA5, #D4538E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}
              >
                sesa
              </span>
              <span
                className="font-poppins leading-none"
                style={{ fontSize: 12, color: '#6A1E4D', letterSpacing: '0.5px', marginTop: 1 }}
              >
                dermatology
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
            {navLinks.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`font-inter text-[14px] font-medium transition-colors pb-0.5 ${
                    active
                      ? 'text-[#EC6BA5] border-b-2 border-[#EC6BA5]'
                      : 'text-[#6B7280] hover:text-[#EC6BA5]'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex items-center gap-3 xl:gap-4">
            {/* Icon buttons — desktop */}
            <div className="hidden md:flex items-center gap-3">
              
              {/* INTERAKTIF: Kotak Pencarian */}
              {showSearch ? (
                <form onSubmit={handleSearchSubmit} className="relative flex items-center animate-in fade-in zoom-in-95 duration-200">
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari produk..."
                    className="border border-[#EC6BA5] rounded-full pl-4 pr-8 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#EC6BA5] w-48 xl:w-56 font-inter transition-all bg-white"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowSearch(false)} 
                    className="absolute right-2.5 text-slate-400 hover:text-[#EC6BA5] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setShowSearch(true)} 
                  aria-label="Cari" 
                  className="text-[#9CA3AF] hover:text-[#EC6BA5] transition-colors p-1"
                >
                  <Search size={20} />
                </button>
              )}

              <Link
                to="/checkout"
                aria-label="Keranjang"
                className="relative text-[#9CA3AF] hover:text-[#EC6BA5] transition-colors p-1"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#D4538E] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              <Link to="/admin" aria-label="Akun" className="text-[#9CA3AF] hover:text-[#EC6BA5] transition-colors p-1">
                <User size={20} />
              </Link>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#EC6BA5] hover:bg-[#D4538E] text-white font-inter font-semibold px-5 py-[10px] rounded-full transition-all shadow-[0_4px_14px_rgba(236,107,165,0.35)] flex items-center gap-2 text-[13px] whitespace-nowrap"
            >
              <WaIcon />
              Chat WhatsApp
            </a>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-[#9CA3AF] hover:text-[#EC6BA5] transition-colors ml-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#fce7f0] px-5 py-4 flex flex-col gap-1 shadow-md absolute w-full left-0 animate-in slide-in-from-top-2">
          
          {/* Pencarian Mobile */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk SESA..."
              className="w-full bg-[#f8f9fa] border border-[#fce7f0] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#EC6BA5] font-inter"
            />
            <Search size={16} className="absolute left-4 text-slate-400" />
          </form>

          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`font-inter text-[15px] font-medium py-3 border-b border-[#fce7f0] last:border-0 flex items-center justify-between ${
                location.pathname === to ? 'text-[#EC6BA5]' : 'text-[#4B5563]'
              }`}
            >
              {label}
            </Link>
          ))}
          
          <div className="flex gap-3 mt-3 border-t border-[#fce7f0] pt-4">
            <Link
              to="/checkout"
              onClick={() => setMobileOpen(false)}
              className="flex-1 bg-[#f8f9fa] text-slate-700 font-inter font-semibold px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-[14px] border border-softGray relative"
            >
              <ShoppingBag size={18} /> Keranjang
              {totalItems > 0 && (
                <span className="bg-[#D4538E] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none absolute top-1.5 right-4">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex-shrink-0 bg-[#f8f9fa] text-slate-700 font-inter font-semibold w-12 rounded-xl flex items-center justify-center border border-softGray"
            >
              <User size={18} />
            </Link>
          </div>
          
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 bg-[#EC6BA5] text-white font-inter font-semibold px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-[14px]"
          >
            <WaIcon /> Chat WhatsApp
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;