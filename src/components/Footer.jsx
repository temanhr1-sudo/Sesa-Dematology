import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const IconInstagram = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const IconFacebook = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const IconTiktok = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
  </svg>
);
const IconTwitter = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const MapPlaceholder = () => (
  <div className="w-full h-full min-h-[140px] bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-2xl relative overflow-hidden flex items-center justify-center">
    <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 140">
      <line x1="50" y1="0" x2="50" y2="140" stroke="#4CAF50" strokeWidth="0.5"/>
      <line x1="100" y1="0" x2="100" y2="140" stroke="#4CAF50" strokeWidth="0.5"/>
      <line x1="150" y1="0" x2="150" y2="140" stroke="#4CAF50" strokeWidth="0.5"/>
      <line x1="0" y1="35" x2="200" y2="35" stroke="#4CAF50" strokeWidth="0.5"/>
      <line x1="0" y1="70" x2="200" y2="70" stroke="#4CAF50" strokeWidth="0.5"/>
      <line x1="0" y1="105" x2="200" y2="105" stroke="#4CAF50" strokeWidth="0.5"/>
      <path d="M0 70 Q60 65 100 72 Q140 78 200 68" stroke="#fff" strokeWidth="4" fill="none" opacity="0.8"/>
      <path d="M100 0 Q98 40 100 72 Q102 100 100 140" stroke="#fff" strokeWidth="3" fill="none" opacity="0.7"/>
    </svg>
    <div className="relative z-10 flex flex-col items-center">
      <div className="w-9 h-9 bg-[#EC6BA5] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(236,107,165,0.5)] border-2 border-white">
        <MapPin size={18} className="text-white" />
      </div>
      <div className="w-2 h-2 bg-[#EC6BA5] rounded-full mt-0.5 opacity-60" />
    </div>
  </div>
);

const Footer = () => {
  const menuLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/konsultasi', label: 'Konsultasi' },
    { to: '/booking', label: 'Booking Dokter' },
    { to: '/produk', label: 'Produk' },
    { to: '/artikel', label: 'Artikel' },
    { to: '/tentang-kami', label: 'Tentang Kami' },
  ];

  const serviceLinks = [
    { to: '/konsultasi', label: 'Konsultasi Dokter' },
    { to: '/konsultasi', label: 'Konsultasi Apoteker' },
    { to: '/upload-resep', label: 'Upload Resep' },
    { to: '/booking', label: 'Booking Dokter' },
    { to: '/produk', label: 'Produk Skincare' },
    { to: '#', label: 'Pengiriman Obat' },
  ];

  return (
    <footer className="bg-white border-t border-[#fce7f0] pt-14 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">

          {/* ── Brand — 2 col span ── */}
          <div className="lg:col-span-2">
            {/* LOGO dari public/images/Sesa.jpeg */}
            <Link to="/" className="flex items-center gap-2 mb-5">
              <img
                src="/images/Sesa.jpeg"
                alt="SESA Dermatology"
                className="h-[52px] w-[52px] object-contain"
              />
              <div className="flex flex-col leading-none">
                <span
                  className="font-poppins font-bold leading-none"
                  style={{ fontSize: 32, background: 'linear-gradient(135deg, #EC6BA5, #D4538E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}
                >
                  sesa
                </span>
                <span
                  className="font-poppins leading-none"
                  style={{ fontSize: 13, color: '#6A1E4D', letterSpacing: '0.5px', marginTop: 2 }}
                >
                  dermatology
                </span>
              </div>
            </Link>

            <p className="font-inter text-[13px] text-[#6B7280] mb-6 leading-[1.8] max-w-[280px]">
              Apotek & Klinik Kulit terpercaya untuk perawatan kulit sehat, cerah dan percaya diri.
            </p>

            <div className="flex items-center gap-2.5">
              {[IconInstagram, IconFacebook, IconTiktok, IconTwitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-[34px] h-[34px] rounded-full bg-[#FFF0F6] flex items-center justify-center text-[#EC6BA5] hover:bg-[#EC6BA5] hover:text-white transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* ── Menu ── */}
          <div>
            <h4 className="font-poppins font-bold text-[14px] text-slate-800 mb-5">Menu</h4>
            <ul className="space-y-3">
              {menuLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="font-inter text-[13px] text-[#6B7280] hover:text-[#EC6BA5] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Layanan ── */}
          <div>
            <h4 className="font-poppins font-bold text-[14px] text-slate-800 mb-5">Layanan</h4>
            <ul className="space-y-3">
              {serviceLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="font-inter text-[13px] text-[#6B7280] hover:text-[#EC6BA5] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Kontak + Lokasi ── */}
          <div>
            <h4 className="font-poppins font-bold text-[14px] text-slate-800 mb-5">Kontak</h4>
            <ul className="space-y-3.5 mb-6">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#EC6BA5] flex-shrink-0 mt-0.5" />
                <span className="font-inter text-[12px] text-[#6B7280] leading-[1.65]">
                  Jl. Siliwangi Kavling No 3 Kel Bojong Rawalumbu Kec Rawalumbu, Kota Bekasi Jawa Barat
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#EC6BA5] flex-shrink-0" />
                <span className="font-inter text-[13px] text-[#6B7280]">0813 9982 2063</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#EC6BA5] flex-shrink-0" />
                <span className="font-inter text-[13px] text-[#6B7280]">sesadermatology@gmail.com</span>
              </li>
            </ul>

            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={13} className="text-[#EC6BA5]" />
                <h4 className="font-poppins font-bold text-[13px] text-slate-800">Jam Operasional</h4>
              </div>
              <p className="font-inter text-[12px] text-[#6B7280]">Senin – Minggu : 08.00 – 21.00</p>
            </div>

            <div className="mb-3 rounded-2xl overflow-hidden h-[120px]">
              <MapPlaceholder />
            </div>

            <a
              href="https://maps.google.com/?q=Jl+Siliwangi+Kavling+No+3+Bekasi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#FFF0F6] hover:bg-[#fce7f0] text-[#EC6BA5] font-inter font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 border border-[#FBBDD4] text-[12px] sm:text-[13px]"
            >
              <MapPin size={14} /> Lihat di Google Maps
            </a>
          </div>

        </div>

        {/* ── Copyright ── */}
        <div className="border-t border-[#fce7f0] pt-7 text-center">
          <p className="font-inter text-[12px] text-[#9CA3AF]">
            © 2024 SESA Dermatology. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;