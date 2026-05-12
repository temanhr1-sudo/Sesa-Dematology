import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, MessageCircle, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Inline SVG logo icon matching the brand
const SesaLogoIcon = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="21" cy="21" rx="21" ry="21" fill="url(#logo_bg)" opacity="0.12"/>
    <ellipse cx="21" cy="21" rx="18" ry="18" fill="url(#logo_bg2)" opacity="0.08"/>
    {/* Pill / capsule */}
    <ellipse cx="26" cy="26" rx="9" ry="5" transform="rotate(-35 26 26)" fill="url(#logo_pill_l)" />
    <ellipse cx="26" cy="26" rx="9" ry="5" transform="rotate(-35 26 26)" fill="url(#logo_pill_r)" style={{clipPath:'inset(0 50% 0 0)'}}/>
    {/* Cross */}
    <rect x="13" y="9" width="5" height="14" rx="2.5" fill="url(#logo_cross)"/>
    <rect x="9" y="13" width="13" height="5" rx="2.5" fill="url(#logo_cross)"/>
    {/* Leaves */}
    <path d="M24 10 Q28 7 30 12 Q26 14 24 10Z" fill="url(#logo_leaf)"/>
    <path d="M27 9 Q32 8 31 14 Q27 13 27 9Z" fill="url(#logo_leaf)" opacity="0.7"/>
    {/* Ring */}
    <ellipse cx="21" cy="22" rx="16" ry="10" stroke="url(#logo_ring)" strokeWidth="2" fill="none" transform="rotate(-20 21 22)"/>
    <defs>
      <linearGradient id="logo_bg" x1="0" y1="0" x2="42" y2="42"><stop stopColor="#EC6BA5"/><stop offset="1" stopColor="#6A1E4D"/></linearGradient>
      <linearGradient id="logo_bg2" x1="0" y1="0" x2="42" y2="42"><stop stopColor="#FB83CF"/><stop offset="1" stopColor="#EC6BA5"/></linearGradient>
      <linearGradient id="logo_cross" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#EC6BA5"/><stop offset="1" stopColor="#D4538E"/></linearGradient>
      <linearGradient id="logo_pill_l" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#FB83CF"/><stop offset="1" stopColor="#EC6BA5"/></linearGradient>
      <linearGradient id="logo_pill_r" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#8C1A52"/><stop offset="1" stopColor="#6A1E4D"/></linearGradient>
      <linearGradient id="logo_leaf" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EC6BA5"/><stop offset="1" stopColor="#FB83CF"/></linearGradient>
      <linearGradient id="logo_ring" x1="0" y1="0" x2="42" y2="42"><stop stopColor="#EC6BA5" stopOpacity="0.6"/><stop offset="1" stopColor="#6A1E4D" stopOpacity="0.3"/></linearGradient>
    </defs>
  </svg>
);

const Navbar = () => {
  const { cart } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const waLink = "https://wa.me/6281399822063?text=Halo%20SESA%20Dermatology,%20saya%20ingin%20berkonsultasi.";

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/konsultasi', label: 'Konsultasi' },
    { to: '/booking', label: 'Booking Dokter' },
    { to: '/produk', label: 'Produk' },
    { to: '/artikel', label: 'Artikel' },
    { to: '/tentang-kami', label: 'Tentang Kami' },
    { to: '/kontak', label: 'Kontak' },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-[0_1px_0_0_#fce7f0] border-b border-[#fce7f0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-[72px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <SesaLogoIcon />
            <div className="flex flex-col leading-none">
              <span className="font-poppins font-bold text-[22px] leading-none tracking-tight text-[#D4538E]">sesa</span>
              <span className="font-poppins text-[11px] leading-none text-[#6A1E4D] tracking-wide">dermatology</span>
            </div>
          </Link>

          {/* Desktop Nav */}
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

          {/* Right Actions */}
          <div className="flex items-center gap-3 xl:gap-4">
            {/* Icon buttons — desktop only */}
            <div className="hidden md:flex items-center gap-3">
              <button aria-label="Cari" className="text-[#9CA3AF] hover:text-[#EC6BA5] transition-colors">
                <Search size={20} />
              </button>
              <Link to="/checkout" aria-label="Keranjang" className="relative text-[#9CA3AF] hover:text-[#EC6BA5] transition-colors">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D4538E] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none">
                    {totalItems}
                  </span>
                )}
              </Link>
              <Link to="/admin" aria-label="Akun" className="text-[#9CA3AF] hover:text-[#EC6BA5] transition-colors">
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
              {/* WhatsApp icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
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

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#fce7f0] px-5 py-4 flex flex-col gap-1 shadow-md">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`font-inter text-[15px] font-medium py-2.5 border-b border-[#fce7f0] last:border-0 ${
                location.pathname === to ? 'text-[#EC6BA5]' : 'text-[#4B5563]'
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 bg-[#EC6BA5] text-white font-inter font-semibold px-5 py-3 rounded-full flex items-center justify-center gap-2 text-[14px]"
          >
            Chat WhatsApp
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;