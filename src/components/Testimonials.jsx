import { Quote } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      id: 1,
      name: "Dinda A.",
      role: "Pasien",
      text: "Pelayanan sangat ramah, dokternya baik dan penjelasannya detail. Kulit saya jadi jauh lebih baik setelah konsultasi di Sesa Dermatology!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Rizky M.",
      role: "Pasien",
      text: "Obatnya original dan cepat sampai. Konsultasi online juga sangat membantu karena bisa dari rumah.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Sabrina L.",
      role: "Pasien",
      text: "Tempat terbaik untuk perawatan kulit. Dokternya profesional dan hasilnya memuaskan!",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h2 className="font-poppins font-bold text-2xl lg:text-3xl text-slate-800 mb-10">Apa Kata Mereka</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-3xl p-8 shadow-sm border border-softGray relative flex flex-col h-full">
              
              {/* Quote Icon Background */}
              <Quote size={48} className="absolute top-6 right-6 text-roseTint opacity-50" fill="currentColor" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#F59E0B] text-lg">★</span>
                ))}
              </div>

              <p className="font-inter text-sm text-slate-700 leading-relaxed mb-8 flex-grow">
                "{review.text}"
              </p>

              <div className="flex items-center gap-3">
                <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-poppins font-bold text-slate-800 text-sm">{review.name}</h4>
                  <span className="font-inter text-xs text-slateGray">{review.role}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;