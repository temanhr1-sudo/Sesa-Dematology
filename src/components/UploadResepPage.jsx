import { useState } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const UploadResepPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Menyimpan data pasien ke tabel patient_submissions
      const { error } = await supabase
        .from('patient_submissions')
        .insert([
          { 
            patient_name: formData.name, 
            whatsapp_number: formData.phone,
            submission_type: 'prescription',
            status: 'pending'
            // Catatan: Untuk file foto, nantinya perlu ditaruh di Supabase Storage.
            // Kolom age dan address bisa digabungkan ke kolom note, atau ditambahkan kolom baru di DB.
          }
        ]);

      if (error) throw error;
      
      setIsSuccess(true);
      setFormData({ name: '', age: '', phone: '', address: '' }); // Reset form
      
    } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('Terjadi kesalahan saat mengirim resep. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-softGray/20 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-softGray p-8 text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
          <h2 className="font-poppins font-bold text-2xl text-deepMagenta mb-2">Resep Berhasil Dikirim!</h2>
          <p className="font-inter text-slateGray mb-8">Apoteker kami akan segera memproses pesanan Anda dan menghubungi via WhatsApp.</p>
          <button 
            onClick={() => setIsSuccess(false)}
            className="w-full bg-primary hover:bg-darkPink text-white font-poppins font-semibold py-3 rounded-xl transition-colors"
          >
            Kirim Resep Lainnya
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-softGray/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-softGray p-8">
        
        <div className="text-center mb-8">
          <h2 className="font-poppins font-bold text-2xl text-deepMagenta">Upload Resep Dokter</h2>
          <p className="font-inter text-slateGray mt-2">Unggah foto resep Anda, apoteker kami akan menyiapkan pesanan Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Area Upload Foto (UI Visual Saja Untuk Saat Ini) */}
          <div className="border-2 border-dashed border-softPink rounded-2xl p-8 text-center hover:bg-roseTint/30 transition-colors cursor-pointer">
            <UploadCloud size={48} className="mx-auto text-primary mb-4" />
            <p className="font-poppins font-medium text-darkPink mb-1">Klik untuk upload foto resep</p>
            <p className="font-inter text-xs text-slateGray">Format yang didukung: JPG, PNG (Maks 5MB)</p>
          </div>

          {/* Form Biodata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-inter text-sm font-medium text-slateGray">Nama Lengkap</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Masukkan nama lengkap"
                className="w-full border border-softGray rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="font-inter text-sm font-medium text-slateGray">Umur</label>
              <input 
                type="number" 
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                placeholder="Contoh: 25"
                className="w-full border border-softGray rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-inter text-sm font-medium text-slateGray">Nomor WhatsApp</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="Contoh: 081234567890"
              className="w-full border border-softGray rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="font-inter text-sm font-medium text-slateGray">Alamat Pengiriman</label>
            <textarea 
              rows="3"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              placeholder="Masukkan alamat lengkap beserta kode pos"
              className="w-full border border-softGray rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm resize-none"
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-darkPink disabled:bg-softPink text-white font-poppins font-semibold py-4 rounded-xl transition-colors shadow-md mt-4 flex justify-center"
          >
            {isSubmitting ? 'Mengirim Data...' : 'Kirim Resep Sekarang'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default UploadResepPage;