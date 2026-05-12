import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArticlePage = () => {
  const articles = [
    {
      id: 1,
      title: "5 Langkah Basic Skincare Routine untuk Kulit Berjerawat",
      excerpt: "Pahami urutan skincare yang benar agar jerawat cepat mereda dan tidak meninggalkan bekas membandel.",
      date: "10 Mei 2026",
      author: "dr. Amalia Putri",
      category: "Skincare 101",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Mitos atau Fakta: Apakah Sunscreen Perlu Dipakai di Dalam Ruangan?",
      excerpt: "Sinar UVA ternyata bisa menembus kaca jendela. Ketahui mengapa perlindungan sinar matahari tetap wajib meski Anda di rumah.",
      date: "08 Mei 2026",
      author: "Tim Sesa",
      category: "Edukasi",
      image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Kandungan Skincare yang Tidak Boleh Dicampur",
      excerpt: "Mencampur Retinol dengan AHA/BHA bisa membuat kulit iritasi parah. Simak panduan lengkap layering skincare di sini.",
      date: "05 Mei 2026",
      author: "dr. Emmanuel Ricky",
      category: "Tips Kulit",
      image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-poppins font-bold text-3xl md:text-4xl text-slate-800 mb-4">Artikel & Edukasi Kulit</h1>
          <p className="font-inter text-slateGray leading-relaxed">
            Temukan tips perawatan, panduan memilih produk, dan informasi medis terpercaya langsung dari ahlinya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-softGray hover:shadow-md transition-shadow flex flex-col h-full group">
              <div className="w-full h-56 overflow-hidden relative">
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary font-poppins font-semibold text-xs px-3 py-1.5 rounded-full z-10">
                  {article.category}
                </span>
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs font-inter text-slateGray mb-3">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary"/> {article.date}</span>
                  <span className="flex items-center gap-1.5"><User size={14} className="text-primary"/> {article.author}</span>
                </div>
                
                <h3 className="font-poppins font-bold text-lg text-slate-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                
                <p className="font-inter text-sm text-slate-600 mb-6 line-clamp-3 flex-grow">
                  {article.excerpt}
                </p>
                
                <Link to="#" className="flex items-center gap-2 text-primary font-inter font-medium text-sm hover:text-darkPink transition-colors mt-auto w-max">
                  Baca Selengkapnya <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ArticlePage;