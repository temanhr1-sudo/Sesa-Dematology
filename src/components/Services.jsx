import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════
   ICON CUSTOM — pixel-perfect sesuai mockup gambar
══════════════════════════════════════════════════════════════ */

/* 1. Konsultasi Dokter — chat bubble dengan 3 titik */
const IconDokter = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <path d="M22 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H8L12 24L16 20H22C23.1 20 24 19.1 24 18V6C24 4.9 23.1 4 22 4Z"
      fill="white"/>
    <circle cx="8"  cy="13" r="1.5" fill="#EC6BA5"/>
    <circle cx="13" cy="13" r="1.5" fill="#EC6BA5"/>
    <circle cx="18" cy="13" r="1.5" fill="#EC6BA5"/>
  </svg>
);

/* 2. Konsultasi Apoteker — orang + tanda plus medis */
const IconApoteker = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <circle cx="10" cy="7" r="4" fill="white"/>
    <path d="M2 22C2 17.58 5.58 14 10 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="20" cy="18" r="5" fill="white"/>
    <line x1="20" y1="15.5" x2="20" y2="20.5" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="17.5" y1="18" x2="22.5" y2="18" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

/* 3. Upload Resep — dokumen + panah naik */
const IconResep = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <rect x="3" y="2" width="16" height="20" rx="2" fill="#EC6BA5" opacity="0.2" stroke="#EC6BA5" strokeWidth="1.5"/>
    <line x1="7" y1="9"  x2="15" y2="9"  stroke="#EC6BA5" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="7" y1="13" x2="12" y2="13" stroke="#EC6BA5" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="20" cy="20" r="5" fill="#EC6BA5"/>
    <path d="M20 23V17M17.5 19.5L20 17L22.5 19.5"
      stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* 4. Booking Dokter — kalender dengan grid kotak */
const IconBooking = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <rect x="2" y="4" width="22" height="20" rx="3" fill="white" opacity="0.2" stroke="white" strokeWidth="1.5"/>
    <line x1="2"  y1="10" x2="24" y2="10" stroke="white" strokeWidth="1.5"/>
    <line x1="8"  y1="2"  x2="8"  y2="7"  stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="18" y1="2"  x2="18" y2="7"  stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="6"    y="14" width="3.5" height="3.5" rx="0.8" fill="white"/>
    <rect x="11.25" y="14" width="3.5" height="3.5" rx="0.8" fill="white" opacity="0.7"/>
    <rect x="16.5"  y="14" width="3.5" height="3.5" rx="0.8" fill="white" opacity="0.4"/>
  </svg>
);

/* 5. Produk Skincare — tas belanja */
const IconProduk = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <path d="M4 6H22L20 20H6L4 6Z" fill="white" opacity="0.2" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 6C9 3.79 10.79 2 13 2C15.21 2 17 3.79 17 6"
      stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="10" cy="13" r="1.2" fill="white"/>
    <circle cx="16" cy="13" r="1.2" fill="white"/>
  </svg>
);

const services = [
  {
    id: 1,
    icon: <IconDokter />,
    iconBg: 'bg-[#EC6BA5]',
    title: 'Konsultasi Dokter',
    description: 'Chat langsung dengan dokter kulit berpengalaman',
    linkText: 'Mulai Konsultasi',
    link: 'https://wa.me/62895416801490?text=Halo,%20saya%20ingin%20konsultasi%20dokter',
    linkColor: 'text-[#EC6BA5] hover:text-[#D4538E]',
    external: true,
  },
  {
    id: 2,
    icon: <IconApoteker />,
    iconBg: 'bg-[#8B5CF6]',
    title: 'Konsultasi Apoteker',
    description: 'Tanya obat, aturan pakai, efek samping, dan lainnya',
    linkText: 'Mulai Konsultasi',
    link: 'https://wa.me/62895416801490?text=Halo,%20saya%20ingin%20konsultasi%20apoteker',
    linkColor: 'text-[#8B5CF6] hover:text-[#7C3AED]',
    external: true,
  },
  {
    id: 3,
    icon: <IconResep />,
    iconBg: 'bg-[#FFF0F6]',
    title: 'Upload Resep',
    description: 'Kirim resep dokter, kami siapkan obatnya',
    linkText: 'Upload Sekarang',
    link: '/upload-resep',
    linkColor: 'text-[#EC6BA5] hover:text-[#D4538E]',
    external: false,
  },
  {
    id: 4,
    icon: <IconBooking />,
    iconBg: 'bg-[#F43F5E]',
    title: 'Booking Dokter',
    description: 'Pilih dokter dan jadwal sesuai kebutuhan Anda',
    linkText: 'Booking Sekarang',
    link: '/booking',
    linkColor: 'text-[#EC6BA5] hover:text-[#D4538E]',
    external: false,
  },
  {
    id: 5,
    icon: <IconProduk />,
    iconBg: 'bg-[#EC4899]',
    title: 'Produk Skincare',
    description: 'Dapatkan skincare & obat original dan terpercaya',
    linkText: 'Lihat Produk',
    link: '/produk',
    linkColor: 'text-[#EC6BA5] hover:text-[#D4538E]',
    external: false,
  },
];

const Services = () => (
  /*
   * FIX UTAMA:
   * ❌ Sebelumnya: -mt-10 z-20  → section ditarik ke atas, nabrak Hero
   * ✅ Sekarang  : tidak ada negative margin, section duduk normal di bawah Hero
   * Background putih + shadow atas sebagai pemisah visual yang clean
   */
  <section className="bg-white border-t border-[#F3F4F6]">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">

      {/* Desktop: 5 kolom grid | Mobile: scroll horizontal */}
      <div className="flex overflow-x-auto lg:grid lg:grid-cols-5 gap-4 pb-2 lg:pb-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

        {services.map((svc) => (
          <div
            key={svc.id}
            className="min-w-[230px] lg:min-w-0 bg-white rounded-2xl border border-[#F3F4F6] p-5 flex flex-col gap-3 hover:border-[#fce7f0] hover:shadow-[0_4px_20px_rgba(236,107,165,0.1)] transition-all duration-300 flex-shrink-0 lg:flex-shrink"
          >
            {/* Icon + Title berdampingan — sesuai mockup */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${svc.iconBg}`}>
                {svc.icon}
              </div>
              <h3 className="font-poppins font-bold text-[14px] text-[#1F2937] leading-tight">
                {svc.title}
              </h3>
            </div>

            {/* Deskripsi */}
            <p className="font-inter text-[12px] text-[#6B7280] leading-[1.65] flex-grow">
              {svc.description}
            </p>

            {/* CTA Link */}
            {svc.external ? (
              <a
                href={svc.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-inter font-semibold text-[12px] flex items-center gap-1 transition-colors mt-auto ${svc.linkColor}`}
              >
                {svc.linkText}
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            ) : (
              <Link
                to={svc.link}
                className={`font-inter font-semibold text-[12px] flex items-center gap-1 transition-colors mt-auto ${svc.linkColor}`}
              >
                {svc.linkText}
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        ))}

      </div>
    </div>
  </section>
);

export default Services;