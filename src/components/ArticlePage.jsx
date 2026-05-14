import { useEffect, useState } from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (data) setArticles(data);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-poppins font-bold text-3xl md:text-4xl text-slate-800 mb-4">Artikel & Edukasi Kulit</h1>
          <p className="font-inter text-slateGray leading-relaxed">Temukan tips perawatan, panduan memilih produk, dan informasi medis terpercaya.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Memuat artikel...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-slate-400">Belum ada artikel yang diterbitkan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-softGray hover:shadow-md transition-shadow flex flex-col h-full group">
                <div className="w-full h-56 overflow-hidden relative">
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary font-poppins font-semibold text-xs px-3 py-1.5 rounded-full z-10">{article.category}</span>
                  <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs font-inter text-slateGray mb-3">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary"/> {new Date(article.created_at).toLocaleDateString('id-ID')}</span>
                    <span className="flex items-center gap-1.5"><User size={14} className="text-primary"/> {article.author}</span>
                  </div>
                  <h3 className="font-poppins font-bold text-lg text-slate-800 mb-3 line-clamp-2">{article.title}</h3>
                  <p className="font-inter text-sm text-slate-600 mb-6 line-clamp-3 flex-grow">{article.excerpt}</p>
                  <Link to={`/artikel/${article.id}`} className="flex items-center gap-2 text-primary font-inter font-medium text-sm hover:text-darkPink transition-colors mt-auto w-max">Baca Selengkapnya <ArrowRight size={16} /></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ArticlePage;