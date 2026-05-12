import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CalendarDays, Clock, User, Phone, CheckCircle } from 'lucide-react';

const BookingPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    patientName: '',
    whatsapp: ''
  });

  // Fetch daftar dokter dari Supabase untuk opsi dropdown
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('id, name, specialization, schedule');
        
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Pastikan tabel patient_submissions di Supabase sudah siap menerima data booking
      const { error } = await supabase
        .from('patient_submissions')
        .insert([
          {
            patient_name: formData.patientName,
            whatsapp_number: formData.whatsapp,
            submission_type: `booking: ${formData.date} Jam ${formData.time}`, // Memanfaatkan kolom type untuk menyimpan detail jadwal sementara
            doctor_id: formData.doctorId,
            status: 'pending'
          }
        ]);

      if (error) throw error;
      
      setIsSuccess(true);
      setFormData({ doctorId: '', date: '', time: '', patientName: '', whatsapp: '' });
      
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Gagal melakukan booking. Pastikan database Supabase sudah dikonfigurasi dengan benar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFAFA] px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-softGray p-8 text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
          <h2 className="font-poppins font-bold text-2xl text-slate-800 mb-2">Booking Berhasil!</h2>
          <p className="font-inter text-slateGray mb-8">Admin kami akan segera menghubungi Anda via WhatsApp untuk konfirmasi jadwal.</p>
          <button 
            onClick={() => setIsSuccess(false)}
            className="w-full bg-primary hover:bg-darkPink text-white font-poppins font-semibold py-3 rounded-xl transition-colors"
          >
            Buat Booking Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-softGray p-6 md:p-10">
        
        <div className="text-center mb-10">
          <h1 className="font-poppins font-bold text-3xl text-slate-800 mb-2">Booking Jadwal Dokter</h1>
          <p className="font-inter text-slateGray">Silakan isi formulir di bawah ini untuk mengatur jadwal konsultasi Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Pilihan Dokter */}
          <div className="space-y-2">
            <label className="font-inter text-sm font-medium text-slate-700">Pilih Dokter Spesialis</label>
            {isLoadingDoctors ? (
              <div className="w-full border border-softGray rounded-xl px-4 py-3 text-slate-400 text-sm">Memuat daftar dokter...</div>
            ) : (
              <select 
                name="doctorId" 
                value={formData.doctorId} 
                onChange={handleInputChange} 
                required
                className="w-full border border-softGray rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm bg-white"
              >
                <option value="" disabled>-- Pilih Dokter --</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - {doc.specialization} ({doc.schedule})
                  </option>
                ))}
              </select>
            )}
            {doctors.length === 0 && !isLoadingDoctors && (
              <p className="text-xs text-red-500 mt-1">Belum ada data dokter di database. Silakan tambahkan via Supabase.</p>
            )}
          </div>

          {/* Jadwal (Tanggal & Waktu) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 relative">
              <label className="font-inter text-sm font-medium text-slate-700">Tanggal Kunjungan</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarDays size={18} className="text-slate-400" />
                </div>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-softGray rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2 relative">
              <label className="font-inter text-sm font-medium text-slate-700">Estimasi Waktu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={18} className="text-slate-400" />
                </div>
                <input 
                  type="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-softGray rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-softGray pt-6 mt-2">
             <h3 className="font-poppins font-semibold text-lg text-slate-800 mb-4">Data Pasien</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-inter text-sm font-medium text-slate-700">Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      required
                      placeholder="Nama lengkap pasien"
                      className="w-full border border-softGray rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-inter text-sm font-medium text-slate-700">Nomor WhatsApp</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="tel" 
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      required
                      placeholder="Contoh: 081234567890"
                      className="w-full border border-softGray rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm"
                    />
                  </div>
                </div>
             </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || doctors.length === 0}
            className="w-full bg-primary hover:bg-darkPink disabled:bg-softPink text-white font-poppins font-semibold py-4 rounded-xl transition-colors shadow-md mt-6 flex justify-center items-center"
          >
            {isSubmitting ? 'Memproses Booking...' : 'Konfirmasi Booking'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default BookingPage;