import { ShieldCheck, HeartPulse, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16 mb-20">
          <div className="w-full md:w-1/2 relative">
            <div className="absolute inset-0 bg-roseTint rounded-full blur-3xl opacity-50 transform -translate-x-10 translate-y-10"></div>
            <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop" alt="Klinik Sesa" className="relative z-10 w-full rounded-3xl shadow-lg border-8 border-white object-cover aspect-video md:aspect-[4/3]" />
          </div>
          
          <div className="w-full md:w-1/2">
            <span className="font-poppins text-primary font-semibold tracking-widest text-sm uppercase mb-3 block">Tentang SESA</span>
            <h1 className="font-poppins font-bold text-3xl md:text-4xl text-slate-800 mb-6 leading-tight">
              Komitmen Kami untuk <br/><span className="text-primary font-serif italic font-normal">Kesehatan Kulit Anda</span>
            </h1>
            <p className="font-inter text-slate-600 leading-relaxed mb-6">
              SESA Dermatology hadir sebagai solusi komprehensif untuk segala kebutuhan perawatan kulit Anda. Kami percaya bahwa setiap orang berhak memiliki kulit yang sehat dan terawat untuk tampil lebih percaya diri.
            </p>
            <p className="font-inter text-slate-600 leading-relaxed">
              Didukung oleh tim dokter spesialis kulit berpengalaman dan apoteker profesional, kami menyediakan layanan konsultasi medis, resep obat akurat, serta rangkaian produk skincare orisinal yang telah teruji klinis.
            </p>
          </div>
        </div>

        {/* Nilai-nilai Kami */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-softGray mb-20">
          <h2 className="font-poppins font-bold text-2xl text-center text-slate-800 mb-10">Mengapa Memilih SESA?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-roseTint rounded-full flex items-center justify-center text-primary mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-poppins font-bold text-slate-800 mb-2">Aman & Terpercaya</h3>
              <p className="font-inter text-sm text-slate-600">Seluruh tindakan dan produk di bawah pengawasan dokter spesialis berlisensi.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-roseTint rounded-full flex items-center justify-center text-primary mb-4">
                <HeartPulse size={32} />
              </div>
              <h3 className="font-poppins font-bold text-slate-800 mb-2">Pendekatan Personal</h3>
              <p className="font-inter text-sm text-slate-600">Perawatan dirancang khusus menyesuaikan jenis dan kondisi unik kulit setiap pasien.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-roseTint rounded-full flex items-center justify-center text-primary mb-4">
                <Award size={32} />
              </div>
              <h3 className="font-poppins font-bold text-slate-800 mb-2">Produk Original</h3>
              <p className="font-inter text-sm text-slate-600">Jaminan 100% keaslian untuk seluruh produk skincare dan obat yang kami sediakan.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;