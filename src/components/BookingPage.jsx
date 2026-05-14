import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Calendar, Clock, User, Phone, Stethoscope, CheckCircle, Loader2, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookingPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    doctorId: '',
    doctorName: '',
    date: '',
    time: '',
    patientName: '',
    whatsapp: ''
  });

  // Mengambil daftar dokter dari database
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .eq('role', 'Dokter')
          .order('name', { ascending: true });

        if (error) throw error;
        setDoctors(data || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Jika dropdown dokter berubah, kita simpan ID dan Nama dokternya
    if (name === 'doctorId') {
      const selectedDoctor = doctors.find(doc => doc.id.toString() === value);
      setFormData(prev => ({ 
        ...prev, 
        doctorId: value,
        doctorName: selectedDoctor ? selectedDoctor.name : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Simpan ke database Admin
      const { error: dbError } = await supabase
        .from('patient_submissions')
        .insert([
          {
            patient_name: formData.patientName,
            whatsapp_number: formData.whatsapp,
            submission_type: `Booking: dr. ${formData.doctorName} (${formData.date} - ${formData.time})`,
            status: 'pending'
          }
        ]);

      if (dbError) throw dbError;

      // 2. Format WhatsApp ke Admin
      const adminWA = "6281399822063"; 
      const message = `Halo Admin SESA! 👋\nSaya ingin konfirmasi Booking Jadwal Dokter.\n\n` +
        `*🩺 Detail Jadwal:*\n` +
        `- Dokter: dr. ${formData.doctorName}\n` +
        `- Tanggal: ${formData.date}\n` +
        `- Jam: ${formData.time}\n\n` +
        `*👤 Data Pasien:*\n` +
        `- Nama: ${formData.patientName}\n` +
        `- No. WA: ${formData.whatsapp}\n\n` +
        `Apakah jadwal ini masih tersedia? Terima kasih! 🙏`;

      const encodedMessage = encodeURIComponent(message);
      
      setIsSuccess(true);
      window.open(`https://wa.me/${adminWA}?text=${encodedMessage}`, '_blank');

    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Terjadi kesalahan saat memproses booking. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tampilan Sukses
  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFAFA] px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-softGray p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#EC6BA5] to-[#D4538E]"></div>
          <CheckCircle size={72} className="mx-auto text-[#10b981] mb-6" />
          <h2 className="font-poppins font-bold text-2xl text-slate-800 mb-3">Booking Terkirim!</h2>
          <p className="font-inter text-slate-600 mb-8 leading-relaxed">
            Permintaan jadwal Anda bersama <strong>dr. {formData.doctorName}</strong> telah kami terima. Admin kami akan segera mengonfirmasi ketersediaan jadwal melalui WhatsApp.
          </p>
          <button 
            onClick={() => {
              setIsSuccess(false); 
              setFormData({doctorId:'', doctorName:'', date:'', time:'', patientName:'', whatsapp:''});
            }} 
            className="w-full bg-[#FAFAFA] hover:bg-softGray text-slate-800 font-poppins font-semibold py-3.5 rounded-xl transition-colors border border-softGray"
          >
            Buat Jadwal Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-poppins font-bold text-3xl md:text-4xl text-slate-800 mb-4 tracking-tight">Reservasi Jadwal Dokter</h1>
          <p className="font-inter text-slate-600 text-sm md:text-base leading-relaxed">
            Pilih dokter spesialis terbaik kami dan tentukan waktu kunjungan yang paling nyaman untuk Anda. Perawatan kulit profesional dimulai dari sini.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* KOLOM KIRI: Form Booking Utama */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-[#fce7f0] p-6 md:p-10">
              
              {/* Bagian 1: Pilihan Dokter & Waktu */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6 border-b border-softGray pb-4">
                  <div className="w-8 h-8 rounded-full bg-roseTint flex items-center justify-center text-primary font-bold">1</div>
                  <h3 className="font-poppins font-bold text-xl text-slate-800">Detail Kunjungan</h3>
                </div>

                <div className="space-y-6">
                  {/* Select Dokter */}
                  <div className="space-y-2">
                    <label className="font-inter text-sm font-medium text-slate-700">Pilih Dokter Spesialis</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Stethoscope size={18} className="text-[#EC6BA5]" />
                      </div>
                      <select 
                        name="doctorId" 
                        required 
                        value={formData.doctorId} 
                        onChange={handleInputChange} 
                        className="w-full bg-[#FAFAFA] border border-softGray rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#EC6BA5] focus:ring-1 focus:ring-[#EC6BA5] font-inter text-sm appearance-none cursor-pointer"
                      >
                        <option value="" disabled>-- Pilih Dokter --</option>
                        {isLoadingDoctors ? (
                          <option disabled>Memuat daftar dokter...</option>
                        ) : doctors.length > 0 ? (
                          doctors.map(doc => (
                            <option key={doc.id} value={doc.id}>{doc.name}</option>
                          ))
                        ) : (
                          <option disabled>Belum ada jadwal dokter tersedia</option>
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <ArrowRight size={16} className="text-slate-400 rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Tanggal & Waktu */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-inter text-sm font-medium text-slate-700">Tanggal Kunjungan</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Calendar size={18} className="text-[#EC6BA5]" />
                        </div>
                        <input 
                          type="date" 
                          name="date" 
                          required 
                          value={formData.date} 
                          onChange={handleInputChange} 
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full bg-[#FAFAFA] border border-softGray rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#EC6BA5] focus:ring-1 focus:ring-[#EC6BA5] font-inter text-sm" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-inter text-sm font-medium text-slate-700">Estimasi Jam</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Clock size={18} className="text-[#EC6BA5]" />
                        </div>
                        <input 
                          type="time" 
                          name="time" 
                          required 
                          value={formData.time} 
                          onChange={handleInputChange} 
                          className="w-full bg-[#FAFAFA] border border-softGray rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#EC6BA5] focus:ring-1 focus:ring-[#EC6BA5] font-inter text-sm" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian 2: Data Pasien */}
              <div>
                <div className="flex items-center gap-3 mb-6 border-b border-softGray pb-4">
                  <div className="w-8 h-8 rounded-full bg-roseTint flex items-center justify-center text-primary font-bold">2</div>
                  <h3 className="font-poppins font-bold text-xl text-slate-800">Data Pasien</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="font-inter text-sm font-medium text-slate-700">Nama Lengkap</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={18} className="text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        name="patientName" 
                        required 
                        value={formData.patientName} 
                        onChange={handleInputChange} 
                        className="w-full bg-[#FAFAFA] border border-softGray rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#EC6BA5] focus:ring-1 focus:ring-[#EC6BA5] font-inter text-sm" 
                        placeholder="Sesuai KTP" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-inter text-sm font-medium text-slate-700">Nomor WhatsApp</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone size={18} className="text-slate-400" />
                      </div>
                      <input 
                        type="tel" 
                        name="whatsapp" 
                        required 
                        value={formData.whatsapp} 
                        onChange={handleInputChange} 
                        className="w-full bg-[#FAFAFA] border border-softGray rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#EC6BA5] focus:ring-1 focus:ring-[#EC6BA5] font-inter text-sm" 
                        placeholder="Contoh: 08123456789" 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#EC6BA5] to-[#D4538E] hover:from-[#D4538E] hover:to-[#be407b] text-white font-poppins font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-70"
                >
                  {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Memproses...</> : 'Konfirmasi via WhatsApp'}
                </button>
              </div>
            </form>
          </div>

          {/* KOLOM KANAN: Informasi Tambahan */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Card Cara Kerja */}
            <div className="bg-white rounded-3xl shadow-sm border border-softGray p-6">
              <h4 className="font-poppins font-bold text-lg text-slate-800 mb-5">Cara Booking</h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="mt-0.5 text-[#EC6BA5]"><CheckCircle size={18} /></div>
                  <div>
                    <p className="font-inter font-semibold text-sm text-slate-800">1. Isi Formulir</p>
                    <p className="font-inter text-xs text-slate-500 mt-1">Lengkapi data diri dan tentukan jadwal yang Anda inginkan.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-0.5 text-[#EC6BA5]"><Phone size={18} /></div>
                  <div>
                    <p className="font-inter font-semibold text-sm text-slate-800">2. Verifikasi WhatsApp</p>
                    <p className="font-inter text-xs text-slate-500 mt-1">Admin kami akan merespon untuk memastikan dokter tersedia di jam tersebut.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-0.5 text-[#EC6BA5]"><MapPin size={18} /></div>
                  <div>
                    <p className="font-inter font-semibold text-sm text-slate-800">3. Datang ke Klinik</p>
                    <p className="font-inter text-xs text-slate-500 mt-1">Tunjukkan bukti chat WA ke resepsionis saat Anda tiba di klinik SESA.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Card Jaminan */}
            <div className="bg-gradient-to-br from-[#EC6BA5] to-[#D4538E] rounded-3xl shadow-md p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck size={24} className="text-white opacity-90" />
                <h4 className="font-poppins font-bold text-lg">Privasi Terjaga</h4>
              </div>
              <p className="font-inter text-sm opacity-90 leading-relaxed">
                Seluruh rekam medis dan data konsultasi Anda dijamin kerahasiaannya sesuai standar prosedur klinik dermatologi internasional.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingPage;