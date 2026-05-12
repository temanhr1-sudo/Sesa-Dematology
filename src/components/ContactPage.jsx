import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-poppins font-bold text-3xl md:text-4xl text-slate-800 mb-4">Hubungi Kami</h1>
          <p className="font-inter text-slateGray leading-relaxed">
            Punya pertanyaan seputar layanan kami atau ingin membuat janji temu? Tim SESA siap membantu Anda.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Info Card */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-softGray h-full">
              <h3 className="font-poppins font-bold text-xl text-slate-800 mb-6">Informasi Kontak</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-roseTint flex items-center justify-center text-primary flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-sm text-slate-800 mb-1">Lokasi Klinik</h4>
                    <p className="font-inter text-sm text-slate-600 leading-relaxed">Jl. Siliwangi Kavling No 3 Kel Bojong Rawalumbu Kec Rawalumbu Kota Bekasi Jawa Barat</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-roseTint flex items-center justify-center text-primary flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-sm text-slate-800 mb-1">WhatsApp / Telepon</h4>
                    <p className="font-inter text-sm text-slate-600">0813 9982 2063</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-roseTint flex items-center justify-center text-primary flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-sm text-slate-800 mb-1">Email</h4>
                    <p className="font-inter text-sm text-slate-600">sesadermatology@gmail.com</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-roseTint flex items-center justify-center text-primary flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-sm text-slate-800 mb-1">Jam Operasional</h4>
                    <p className="font-inter text-sm text-slate-600">Senin - Minggu: 08.00 - 21.00 WIB</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Map Area */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-softGray h-full min-h-[400px] relative">
              {/* Placeholder Embed Map - Ganti 'src' dengan iframe embed link dari Google Maps yang sebenarnya */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126907.03534575891!2d106.91508249726563!3d-6.284047600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d8546ad633d%3A0x79e8de8965402078!2sRawalumbu%2C%20Kota%20Bks%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1715498800000!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0, position: 'absolute', inset: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="SESA Dermatology Map"
              ></iframe>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;