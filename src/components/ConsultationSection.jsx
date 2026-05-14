import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   CUSTOM ICONS — pixel-perfect sesuai mockup gambar 2
═══════════════════════════════════════════════════ */

/* 1. Konsultasi Dokter — chat bubble dengan 3 titik */
const IconKonsultasiDokter = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <rect width="26" height="26" rx="6" fill="none"/>
    <path d="M22 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H8L12 24L16 20H22C23.1 20 24 19.1 24 18V6C24 4.9 23.1 4 22 4Z" fill="#EC6BA5" stroke="#EC6BA5" strokeWidth="0.5" strokeLinejoin="round"/>
    <circle cx="8" cy="13" r="1.5" fill="white"/>
    <circle cx="13" cy="13" r="1.5" fill="white"/>
    <circle cx="18" cy="13" r="1.5" fill="white"/>
  </svg>
);

/* 2. Konsultasi Apoteker — orang + simbol medis */
const IconKonsultasiApoteker = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <circle cx="10" cy="7" r="4" fill="#8B5CF6"/>
    <path d="M2 22C2 17.58 5.58 14 10 14" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="20" cy="18" r="5" fill="#8B5CF6"/>
    <line x1="20" y1="15.5" x2="20" y2="20.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="17.5" y1="18" x2="22.5" y2="18" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

/* 3. Upload Resep — dokumen dengan tanda panah atas */
const IconUploadResep = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <rect x="3" y="2" width="16" height="20" rx="2" fill="#EC6BA5" opacity="0.15" stroke="#EC6BA5" strokeWidth="1.5"/>
    <line x1="7" y1="9" x2="15" y2="9" stroke="#EC6BA5" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="7" y1="13" x2="12" y2="13" stroke="#EC6BA5" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="20" cy="20" r="5" fill="#EC6BA5"/>
    <path d="M20 23V17M17.5 19.5L20 17L22.5 19.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* 4. Booking Dokter — kalender dengan grid */
const IconBookingDokter = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <rect x="2" y="4" width="22" height="20" rx="3" fill="#EC6BA5" opacity="0.12" stroke="#EC6BA5" strokeWidth="1.5"/>
    <line x1="2" y1="10" x2="24" y2="10" stroke="#EC6BA5" strokeWidth="1.5"/>
    <line x1="8" y1="2" x2="8" y2="7" stroke="#EC6BA5" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="18" y1="2" x2="18" y2="7" stroke="#EC6BA5" strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="6" y="14" width="3.5" height="3.5" rx="0.8" fill="#EC6BA5"/>
    <rect x="11.25" y="14" width="3.5" height="3.5" rx="0.8" fill="#EC6BA5" opacity="0.6"/>
    <rect x="16.5" y="14" width="3.5" height="3.5" rx="0.8" fill="#EC6BA5" opacity="0.3"/>
  </svg>
);

/* 5. Produk Skincare — tas belanja */
const IconProdukSkincare = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <path d="M4 6H22L20 20H6L4 6Z" fill="#EC6BA5" opacity="0.15" stroke="#EC6BA5" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 6C9 3.79 10.79 2 13 2C15.21 2 17 3.79 17 6" stroke="#EC6BA5" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="10" cy="13" r="1.2" fill="#EC6BA5"/>
    <circle cx="16" cy="13" r="1.2" fill="#EC6BA5"/>
  </svg>
);

const features = [
  {
    id: 'konsul-dokter',
    icon: <IconKonsultasiDokter />,
    iconBg: 'bg-[#FFF0F6]',
    title: 'Konsultasi Dokter',
    desc: 'Chat langsung dengan dokter kulit berpengalaman',
    link: 'https://wa.me/62895416801490?text=Halo,%20saya%20ingin%20konsultasi%20dokter',
    linkLabel: 'Mulai Konsultasi',
    linkColor: 'text-[#EC6BA5] hover:text-[#D4538E]',
    external: true,
  },
  {
    id: 'konsul-apoteker',
    icon: <IconKonsultasiApoteker />,
    iconBg: 'bg-[#F3E8FF]',
    title: 'Konsultasi Apoteker',
    desc: 'Tanya obat, aturan pakai, efek samping, dan lainnya',
    link: 'https://wa.me/62895416801490?text=Halo,%20saya%20ingin%20konsultasi%20apoteker',
    linkLabel: 'Mulai Konsultasi',
    linkColor: 'text-[#8B5CF6] hover:text-[#7C3AED]',
    external: true,
  },
  {
    id: 'upload-resep',
    icon: <IconUploadResep />,
    iconBg: 'bg-[#FFF0F6]',
    title: 'Upload Resep',
    desc: 'Kirim resep dokter, kami siapkan obatnya',
    link: '/upload-resep',
    linkLabel: 'Upload Sekarang',
    linkColor: 'text-[#EC6BA5] hover:text-[#D4538E]',
    external: false,
  },
  {
    id: 'booking-dokter',
    icon: <IconBookingDokter />,
    iconBg: 'bg-[#FFF0F6]',
    title: 'Booking Dokter',
    desc: 'Pilih dokter dan jadwal sesuai kebutuhan Anda',
    link: '/booking',
    linkLabel: 'Booking Sekarang',
    linkColor: 'text-[#EC6BA5] hover:text-[#D4538E]',
    external: false,
  },
  {
    id: 'produk-skincare',
    icon: <IconProdukSkincare />,
    iconBg: 'bg-[#FFF0F6]',
    title: 'Produk Skincare',
    desc: 'Dapatkan skincare & obat original dan terpercaya',
    link: '/produk',
    linkLabel: 'Lihat Produk',
    linkColor: 'text-[#EC6BA5] hover:text-[#D4538E]',
    external: false,
  },
];

const ConsultationSection = () => (
  /* FIX: bg-white + shadow atas agar tidak "menabrak" hero — section ini
     di-render tepat di bawah hero, diberi border-top & shadow agar terlihat
     sebagai section terpisah, bukan overlapping */
  <section className="bg-white border-t border-[#F3F4F6] shadow-[0_-1px_0_0_#F3F4F6]">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {features.map((feat) => (
          <div
            key={feat.id}
            className="bg-white rounded-2xl border border-[#F3F4F6] p-5 hover:border-[#fce7f0] hover:shadow-[0_4px_20px_rgba(236,107,165,0.1)] transition-all duration-300 flex flex-col gap-3"
          >
            {/* Icon bubble */}
            <div className={`w-11 h-11 ${feat.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              {feat.icon}
            </div>

            {/* Title */}
            <h3 className="font-poppins font-bold text-[14px] text-[#1F2937] leading-tight">
              {feat.title}
            </h3>

            {/* Desc */}
            <p className="font-inter text-[12px] text-[#6B7280] leading-[1.65] flex-grow">
              {feat.desc}
            </p>

            {/* CTA */}
            {feat.external ? (
              <a
                href={feat.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-inter font-semibold text-[12px] flex items-center gap-1 transition-colors mt-auto ${feat.linkColor}`}
              >
                {feat.linkLabel} <ArrowRight size={12} />
              </a>
            ) : (
              <Link
                to={feat.link}
                className={`font-inter font-semibold text-[12px] flex items-center gap-1 transition-colors mt-auto ${feat.linkColor}`}
              >
                {feat.linkLabel} <ArrowRight size={12} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ConsultationSection;