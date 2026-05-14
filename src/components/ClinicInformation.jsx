import { useEffect, useState } from 'react'; // Tambahkan ini
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient'; // Pastikan path ini benar

/* ── Icons ── */
const WaIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const apotekerItems = [
  { label: 'Tanya Obat', icon: '💊' },
  { label: 'Aturan Pakai', icon: '📋' },
  { label: 'Interaksi Obat', icon: '⚗️' },
  { label: 'Efek Samping', icon: '🔍' },
  { label: 'Suplemen & Vitamin', icon: '🌿' },
];

const onlineItems = [
  'Jerawat & Flek',
  'Kulit Sensitif',
  'Rambut Rontok',
  'Perawatan Kulit Lainnya',
];

/* ══════════════════════════════════════
   DOCTOR CARD
══════════════════════════════════════ */
const DoctorCard = ({ doc }) => (
  <div className="bg-white rounded-2xl overflow-hidden border border-[#F3F4F6] hover:border-[#fce7f0] hover:shadow-md transition-all flex flex-col group h-full">
    <div
      className="w-full flex-shrink-0 relative overflow-hidden bg-roseTint"
      style={{ aspectRatio: '3/4', maxHeight: 195 }}
    >
      <img
        src={doc.image_url} // Diubah ke data Supabase
        alt={doc.name}
        className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
      />
    </div>
    <div className="p-3 flex flex-col flex-1">
      <h3 className="font-poppins font-bold text-[11px] text-slate-800 leading-snug mb-0.5 line-clamp-3">{doc.name}</h3>
      <p className="font-inter text-[10px] text-[#9CA3AF] mb-3">Dokter Spesialis Kulit</p>
      <div className="mt-auto flex flex-col items-center gap-1">
        <span className="bg-[#fce7f0] text-[#D4538E] font-inter font-semibold text-[9px] px-2.5 py-1 rounded-full w-full text-center">
          {doc.schedule} {/* Diubah ke data Supabase */}
        </span>
        <span className="font-inter text-[10px] text-slate-500 font-medium italic">SIP: {doc.credential}</span>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════
   PHONE CHAT MOCKUP
══════════════════════════════════════ */
const PhoneMockup = () => (
  <div style={{
    width: 112, height: 205,
    background: '#0f172a',
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.28), 0 0 0 1.5px #0f172a',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
  }}>
    <div style={{ background: '#0f172a', height: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', flexShrink: 0 }}>
      <span style={{ color: 'white', fontSize: 6.5, fontWeight: 600 }}>9:41</span>
      <div style={{ width: 28, height: 8, background: 'black', borderRadius: 99 }} />
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <div style={{ width: 8, height: 5, border: '1px solid rgba(255,255,255,0.5)', borderRadius: 1.5, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 1, top: 1, right: 2, bottom: 1, background: 'white', borderRadius: 1 }} />
        </div>
      </div>
    </div>
    <div style={{ flex: 1, background: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(135deg, #EC6BA5, #D4538E)', padding: '7px 8px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 7, fontWeight: 700, color: 'white' }}>S</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: 6, fontWeight: 700, color: 'white' }}>Sesa Dermatology</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#4ade80' }} />
            <span style={{ fontSize: 4.5, color: 'rgba(255,255,255,0.85)' }}>Online</span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, background: '#f8f9fa', padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
        <div style={{ marginLeft: 'auto', maxWidth: '80%', background: 'white', borderRadius: '10px 10px 2px 10px', padding: '4px 6px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: 5, color: '#475569', lineHeight: 1.55, margin: 0 }}>Halo dok, saya ingin konsultasi tentang jerawat.</p>
          <p style={{ fontSize: 4, color: '#94a3b8', margin: '2px 0 0', textAlign: 'right' }}>09:41</p>
        </div>
        <div style={{ marginRight: 'auto', maxWidth: '80%', background: '#FFF0F6', borderRadius: '10px 10px 10px 2px', padding: '4px 6px', boxShadow: '0 1px 4px rgba(236,107,165,0.1)' }}>
          <p style={{ fontSize: 5, color: '#1e293b', lineHeight: 1.55, margin: 0 }}>Halo! Silakan kirim foto area kulit yang ingin dikonsultasikan ya 😊</p>
          <p style={{ fontSize: 4, color: '#EC6BA5', margin: '2px 0 0' }}>09:42</p>
        </div>
      </div>
      <div style={{ background: 'white', borderTop: '1px solid #f1f5f9', padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 99, height: 14, display: 'flex', alignItems: 'center', paddingLeft: 6 }}>
          <span style={{ fontSize: 4, color: '#94a3b8' }}>Ketik pesan...</span>
        </div>
        <div style={{ width: 14, height: 14, background: 'linear-gradient(135deg,#EC6BA5,#D4538E)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="5" height="5" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
        </div>
      </div>
    </div>
    <div style={{ height: 14, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ width: 30, height: 2, background: 'rgba(255,255,255,0.25)', borderRadius: 99 }} />
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT (DYNAMIC DATA)
══════════════════════════════════════════════════════════ */
const ClinicInformation = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [pharmacist, setPharmacist] = useState(null);

  useEffect(() => {
    const fetchMedicalTeam = async () => {
      // Ambil Dokter
      const { data: doctorsData } = await supabase
        .from('staff')
        .select('*')
        .eq('role', 'Dokter')
        .order('created_at', { ascending: true })
        .limit(3); // Limit 3 sesuai UI Anda
      
      if (doctorsData) setDoctorsList(doctorsData);

      // Ambil Apoteker (Satu saja untuk card apoteker)
      const { data: pharmacistData } = await supabase
        .from('staff')
        .select('*')
        .eq('role', 'Apoteker')
        .limit(1)
        .single();
      
      if (pharmacistData) setPharmacist(pharmacistData);
    };

    fetchMedicalTeam();
  }, []);

  return (
    <section className="py-10 bg-[#FAFAFA]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

          {/* ════ KIRI — Jadwal Dokter ════ */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-poppins font-bold text-[20px] text-slate-800">Jadwal Dokter</h2>
              <Link to="/booking" className="text-[#EC6BA5] font-inter font-medium text-[13px] flex items-center gap-1 hover:text-[#D4538E] transition-colors">
                Lihat Semua <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {doctorsList.length > 0 ? (
                doctorsList.map((doc) => <DoctorCard key={doc.id} doc={doc} />)
              ) : (
                <div className="col-span-3 text-center py-10 text-slate-400 text-sm">Belum ada data dokter.</div>
              )}
            </div>
          </div>

          {/* ════ KANAN — Apoteker + Online ════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* ── CARD KONSULTASI APOTEKER ── */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-poppins font-bold text-[16px] text-slate-800">Konsultasi Apoteker</h2>
                <Link to="/konsultasi" className="text-[#9CA3AF] font-inter font-medium text-[11px] flex items-center gap-0.5 hover:text-[#EC6BA5] transition-colors">
                  Lihat Semua <ArrowRight size={11} />
                </Link>
              </div>

              <div className="rounded-2xl overflow-hidden flex flex-row flex-1 group"
                style={{
                  minHeight: 270,
                  background: 'white',
                  border: '1.5px solid #ede9fe',
                  boxShadow: '0 4px 24px rgba(139,92,246,0.08)',
                }}
              >
                {/* Kiri: foto dinamis dari Admin */}
                <div className="relative flex-shrink-0 overflow-hidden" style={{ width: '42%', background: 'linear-gradient(160deg, #f3e8ff 0%, #ede9fe 100%)' }}>
                  <img
                    src={pharmacist ? pharmacist.image_url : "https://randomuser.me/api/portraits/women/68.jpg"}
                    alt="Apoteker SESA"
                    className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-16"
                    style={{ background: 'linear-gradient(to top, rgba(139,92,246,0.2), transparent)' }}
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-poppins font-bold"
                    style={{ background: 'rgba(139,92,246,0.85)', color: 'white', backdropFilter: 'blur(4px)' }}>
                    Apoteker
                  </div>
                </div>

                <div className="flex-1 flex flex-col" style={{ padding: '16px 14px 14px' }}>
                  <p className="font-poppins font-semibold text-[11px] text-[#7C3AED] mb-3 uppercase tracking-wide">
                    {pharmacist ? pharmacist.name : 'Layanan Apoteker'}
                  </p>
                  <ul className="flex flex-col gap-2 flex-1 mb-4">
                    {apotekerItems.map(({ label }) => (
                      <li key={label} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#f3e8ff' }}>
                          <CheckCircle2 size={11} className="text-[#8B5CF6]" />
                        </div>
                        <span className="font-inter text-[12px] font-medium text-slate-700 leading-snug">{label}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://wa.me/62895416801490?text=Halo,%20saya%20ingin%20konsultasi%20dengan%20apoteker"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-white font-inter font-semibold text-[12px] rounded-xl py-2.5 transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', boxShadow: '0 4px 14px rgba(139,92,246,0.35)' }}
                  >
                    <WaIcon size={14} /> Chat Apoteker
                  </a>
                </div>
              </div>
            </div>

            {/* ── CARD KONSULTASI ONLINE ── */}
            <div className="flex flex-col">
              <div className="flex items-center mb-4 h-[28px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#EC6BA5]" style={{ boxShadow: '0 0 6px rgba(236,107,165,0.6)' }} />
                  <span className="font-poppins font-bold text-[11px] text-[#EC6BA5] tracking-[0.12em] uppercase">Konsultasi Online</span>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden flex flex-row relative"
                style={{
                  minHeight: 270,
                  background: 'linear-gradient(135deg, #fff0f6 0%, #ffe4f0 100%)',
                  border: '1.5px solid #fbbdd4',
                  boxShadow: '0 4px 24px rgba(236,107,165,0.1)',
                }}
              >
                <div className="absolute pointer-events-none" style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(236,107,165,0.08)', top: -30, right: -20 }} />
                <div className="flex flex-col justify-between relative z-10" style={{ flex: 1, padding: '16px 12px 14px 16px', minWidth: 0 }}>
                  <div>
                    <h3 className="font-poppins font-bold text-slate-800 leading-snug mb-4" style={{ fontSize: 13.5 }}>
                      Tanya Masalah Kulitmu<br />Langsung ke Dokter
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {onlineItems.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(236,107,165,0.15)' }}>
                            <CheckCircle2 size={11} className="text-[#EC6BA5]" />
                          </div>
                          <span className="font-inter text-[12px] font-medium text-slate-700 leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href="https://wa.me/62895416801490?text=Halo,%20saya%20ingin%20konsultasi%20masalah%20kulit"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-white font-inter font-semibold text-[12px] rounded-xl py-2.5 mt-4 transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #EC6BA5, #D4538E)', boxShadow: '0 4px 14px rgba(236,107,165,0.38)' }}
                  >
                    <WaIcon size={14} /> Konsultasi via WhatsApp
                  </a>
                </div>
                <div className="relative z-10 flex-shrink-0 flex items-end justify-center" style={{ width: 120, paddingRight: 8, paddingTop: 8 }}>
                  <div className="transition-transform duration-500 hover:-translate-y-1" style={{ marginBottom: 16 }}>
                    <PhoneMockup />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicInformation;