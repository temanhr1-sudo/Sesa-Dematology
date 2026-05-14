import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
      if (data) setArticle(data);
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Memuat artikel...</div>;
  if (!article) return <div className="min-h-screen flex items-center justify-center text-red-400">Artikel tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/artikel" className="inline-flex items-center gap-2 text-slateGray hover:text-primary font-inter font-medium text-sm mb-8 transition-colors">
          <ArrowLeft size={18} /> Kembali ke Kumpulan Artikel
        </Link>

        <div className="mb-10 text-center md:text-left">
          <span className="inline-block bg-roseTint text-primary font-poppins font-semibold text-xs px-4 py-2 rounded-full mb-4">{article.category}</span>
          <h1 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-slate-800 mb-6 leading-tight">{article.title}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-sm font-inter text-slate-600">
            <span className="flex items-center gap-2"><Calendar size={16} className="text-primary"/> {new Date(article.created_at).toLocaleDateString('id-ID')}</span>
            <span className="flex items-center gap-2"><User size={16} className="text-primary"/> {article.author}</span>
          </div>
        </div>

        <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-12 shadow-sm border border-softGray">
          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="font-inter text-slate-700 text-base md:text-lg text-justify prose prose-pink max-w-none" dangerouslySetInnerHTML={{ __html: article.content }}></div>
      </div>
    </div>
  );
};
export default ArticleDetail;