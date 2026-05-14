import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UploadCloud, FileText, User, Phone, MapPin, CheckCircle, Loader2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const UploadResepPage = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    whatsapp: '',
    address: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Mohon upload foto resep dokter terlebih dahulu.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload file resep ke Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `resep_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images') // Menggunakan bucket yang ada agar praktis
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
      const fileUrl = urlData.publicUrl;

      // 2. Simpan data pasien ke tabel patient_submissions
      const { error: dbError } = await supabase
        .from('patient_submissions')
        .insert([
          {
            patient_name: formData.patientName,
            whatsapp_number: formData.whatsapp,
            submission_type: `Tebus Resep - Alamat: ${formData.address}`,
            status: 'pending' // Admin akan melihat URL foto dari dashboard jika kita update kueri admin, tapi untuk kemudahan WA, kita akan gunakan sistem notifikasi WA.
          }
        ]);

      if (dbError) throw dbError;

      // 3. Notifikasi via WhatsApp ke Admin
      const adminWA = "62895416801490"; 
      const message = `Halo Admin SESA! 👋\nSaya ingin menebus Resep Dokter.\n\n` +
        `*👤 Data Pasien:*\n` +
        `- Nama: ${formData.patientName}\n` +
        `- No. WA: ${formData.whatsapp}\n` +
        `- Alamat Pengiriman: ${formData.address}\n\n` +
        `*📄 Link Resep (Aman):*\n${fileUrl}\n\n` +
        `Mohon info total biaya obat dan ongkos kirimnya ya. Terima kasih! 🙏`;

      const encodedMessage = encodeURIComponent(message);
      
      setIsSuccess(true);
      
      // Buka WA di tab baru
      window.open(`https://wa.me/${adminWA}?text=${encodedMessage}`, '_blank');

    } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('Gagal mengupload resep. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFAFA] px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-softGray p-8 text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
          <h2 className="font-poppins font-bold text-2xl text-slate-800 mb-2">Resep Berhasil Dikirim!</h2>
          <p className="font-inter text-slateGray mb-8">Apoteker kami akan mengecek resep Anda dan segera membalas via WhatsApp untuk konfirmasi pengiriman.</p>
          <button onClick={() => {setIsSuccess(false); setFile(null); setFormData({patientName:'', whatsapp:'', address:''});}} className="w-full bg-primary hover:bg-darkPink text-white font-poppins font-semibold py-3 rounded-xl transition-colors">
            Kirim Resep Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="font-poppins font-bold text-3xl md:text-4xl text-slate-800 mb-4">Tebus Resep & Pengiriman</h1>
          <p className="font-inter text-slateGray max-w-xl mx-auto">Upload foto resep dokter kulit Anda. Apoteker kami akan menyiapkan obatnya dan mengirimkannya langsung ke rumah Anda.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-softGray p-6 md:p-10">
          <div className="flex items-start gap-3 bg-blue-50 text-blue-800 p-4 rounded-xl mb-8">
            <Info size={24} className="flex-shrink-0 mt-0.5" />
            <p className="font-inter text-sm leading-relaxed">
              Layanan ini khusus untuk resep asli dari dokter Klinik SESA Dermatology. Pastikan foto resep terlihat jelas dan terbaca.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Upload Area */}
            <div className="space-y-3">
              <label className="font-poppins font-semibold text-slate-800 flex items-center gap-2">
                <FileText size={18} className="text-primary"/> Upload Foto Resep
              </label>
              
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${file ? 'border-primary bg-roseTint/20' : 'border-softGray bg-[#FAFAFA] hover:border-slate-400'}`}>
                <input 
                  type="file" 
                  id="resep-upload" 
                  accept="image/png, image/jpeg, image/jpg, application/pdf" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <label htmlFor="resep-upload" className="cursor-pointer flex flex-col items-center justify-center gap-3">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${file ? 'bg-primary text-white' : 'bg-white shadow-sm text-slate-400'}`}>
                    {file ? <CheckCircle size={28} /> : <UploadCloud size={28} />}
                  </div>
                  <div>
                    <p className="font-inter font-medium text-slate-800 mb-1">
                      {file ? file.name : "Klik untuk pilih foto resep"}
                    </p>
                    <p className="font-inter text-xs text-slate-500">
                      Format: JPG, PNG, atau PDF. Maksimal 5MB.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="border-t border-softGray pt-8">
              <h3 className="font-poppins font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <User size={18} className="text-primary"/> Data Pengiriman
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="font-inter text-sm font-medium text-slate-700">Nama Pasien</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={18} className="text-slate-400" /></div>
                    <input type="text" name="patientName" required value={formData.patientName} onChange={handleInputChange} className="w-full border border-softGray rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm" placeholder="Sesuai nama di resep" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-inter text-sm font-medium text-slate-700">Nomor WhatsApp</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone size={18} className="text-slate-400" /></div>
                    <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange} className="w-full border border-softGray rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm" placeholder="Untuk konfirmasi apoteker" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-inter text-sm font-medium text-slate-700">Alamat Pengiriman (Lengkap)</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none"><MapPin size={18} className="text-slate-400" /></div>
                  <textarea name="address" required value={formData.address} onChange={handleInputChange} rows="3" className="w-full border border-softGray rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm resize-none" placeholder="Jl. Sudirman No.5, Kec. Kebayoran Baru, Jakarta Selatan..."></textarea>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isUploading}
              className="w-full bg-primary hover:bg-darkPink disabled:bg-softPink text-white font-poppins font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-4"
            >
              {isUploading ? <><Loader2 className="animate-spin" size={20} /> Memproses...</> : 'Kirim Resep & Cek Ongkir'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadResepPage;