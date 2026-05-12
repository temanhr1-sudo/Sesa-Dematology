import { Link } from 'react-router-dom';
import { ArrowRight, Clock, CalendarDays } from 'lucide-react';

const doctors = [
  {
    id: 1,
    name: 'dr. Resina Hajar Haerani Harahap, S.Farm, M.Farm',
    specialization: 'Dokter Spesialis Kulit',
    days: 'Senin – Sabtu',
    hours: '09.00 – 16.00',
    imageUrl: 'https://images.unsplash.com/photo-1594824436998-f2b3e40df88c?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'dr. Emmanuel Ricky Cristyanto',
    specialization: 'Dokter Spesialis Kulit',
    days: 'Selasa – Sabtu',
    hours: '10.00 – 17.00',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'dr. Putri Amelia, Sp.DV',
    specialization: 'Dokter Spesialis Kulit',
    days: 'Rabu – Minggu',
    hours: '10.00 – 18.00',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop',
  },
];

const DoctorSchedule = () => (
  <section className="py-14 bg-[#FAFAFA]">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-poppins font-bold text-[22px] lg:text-[26px] text-slate-800">Jadwal Dokter</h2>
        <Link
          to="/booking"
          className="text-[#EC6BA5] font-inter font-medium hover:text-[#D4538E] flex items-center gap-1.5 text-[13px] transition-colors"
        >
          Lihat Semua <ArrowRight size={14} />
        </Link>
      </div>

      {/* Doctor grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-[#F3F4F6] hover:shadow-[0_8px_32px_rgba(236,107,165,0.12)] hover:border-[#fce7f0] transition-all duration-300 flex flex-col group"
          >
            {/* Photo */}
            <div className="h-[240px] overflow-hidden bg-[#FFF0F6] relative">
              <img
                src={doc.imageUrl}
                alt={doc.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/60 to-transparent" />
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-poppins font-bold text-slate-800 text-[14px] leading-snug mb-1">
                {doc.name}
              </h3>
              <p className="font-inter text-[12px] text-[#9CA3AF] mb-5">{doc.specialization}</p>

              {/* Schedule tags */}
              <div className="mt-auto space-y-2.5">
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} className="text-[#EC6BA5] flex-shrink-0" />
                  <span className="bg-[#FFF0F6] text-[#D4538E] font-inter font-semibold text-[11px] px-3 py-1 rounded-full">
                    {doc.days}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#9CA3AF] flex-shrink-0" />
                  <span className="text-slate-600 font-inter font-medium text-[12px]">{doc.hours}</span>
                </div>
              </div>

              {/* Book button */}
              <Link
                to="/booking"
                className="mt-5 w-full bg-white hover:bg-[#FFF0F6] text-[#EC6BA5] border border-[#EC6BA5] font-inter font-semibold py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-colors text-[12px]"
              >
                <CalendarDays size={14} /> Booking Sekarang
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  </section>
);

export default DoctorSchedule;