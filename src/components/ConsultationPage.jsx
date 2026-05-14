import { Stethoscope, ImagePlus, MessageCircle, ArrowRight } from 'lucide-react';

const ConsultationPage = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-poppins text-primary font-semibold tracking-widest text-sm uppercase mb-3 block">Layanan Teledermatologi</span>
          <h1 className="font-poppins font-bold text-3xl md:text-4xl text-slate-800 mb-6">Konsultasi Dokter Spesialis Online</h1>
          <p className="font-inter text-slateGray leading-relaxed">
            Dapatkan diagnosa akurat dan resep perawatan kulit langsung dari dokter spesialis kami, tanpa perlu keluar rumah.
          </p>
        </div>

        {/* Alur Konsultasi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative">
          {/* Garis konektor untuk desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-roseTint -z-10"></div>
          
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-softGray relative">
            <div className="w-16 h-16 bg-roseTint rounded-full flex items-center justify-center text-primary mx-auto mb-6 shadow-inner">
              <Stethoscope size={28} />
            </div>
            <div className="absolute top-8 right-8 text-6xl font-black text-slate-50 opacity-50 -z-10">1</div>
            <h3 className="font-poppins font-bold text-lg text-slate-800 mb-3">Sampaikan Keluhan</h3>
            <p className="font-inter text-sm text-slate-600">Hubungi admin kami via WhatsApp dan ceritakan detail keluhan kulit atau rambut Anda.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-softGray relative">
            <div className="w-16 h-16 bg-roseTint rounded-full flex items-center justify-center text-primary mx-auto mb-6 shadow-inner">
              <ImagePlus size={28} />
            </div>
            <div className="absolute top-8 right-8 text-6xl font-black text-slate-50 opacity-50 -z-10">2</div>
            <h3 className="font-poppins font-bold text-lg text-slate-800 mb-3">Kirim Foto Kondisi</h3>
            <p className="font-inter text-sm text-slate-600">Kirimkan foto area kulit yang bermasalah dengan pencahayaan yang jelas agar dokter dapat menganalisa.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-softGray relative">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-pink-200">
              <MessageCircle size={28} />
            </div>
            <div className="absolute top-8 right-8 text-6xl font-black text-slate-50 opacity-50 -z-10">3</div>
            <h3 className="font-poppins font-bold text-lg text-slate-800 mb-3">Terima Solusi & Resep</h3>
            <p className="font-inter text-sm text-slate-600">Dokter akan memberikan diagnosa medis, anjuran perawatan, serta resep obat jika diperlukan.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-roseTint rounded-[2rem] p-8 md:p-12 text-center border border-softPink">
          <h2 className="font-poppins font-bold text-2xl text-slate-800 mb-4">Mulai Konsultasi Sekarang</h2>
          <p className="font-inter text-slate-700 mb-8 max-w-xl mx-auto">
            Tim dokter kami siap membantu memberikan solusi terbaik untuk perjalanan menuju kulit sehat Anda.
          </p>
          <a 
            href="https://wa.me/6281234567890" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-darkPink text-white font-poppins font-semibold px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Chat Admin via WhatsApp <ArrowRight size={20} />
          </a>
        </div>

      </div>
    </div>
  );
};

export default ConsultationPage;