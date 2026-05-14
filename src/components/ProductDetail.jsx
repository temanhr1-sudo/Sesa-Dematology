import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, ShoppingBag, Star, User, Loader2, CheckCircle2, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk form ulasan baru
  const [newReview, setNewReview] = useState({ user_name: '', rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      setIsLoading(true);
      try {
        // 1. Ambil data produk
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;
        setProduct(productData);

        // 2. Ambil data ulasan (reviews) untuk produk ini
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', id)
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);

      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.name,
      category: product.category,
      price: product.price,
      imageUrl: product.image_url,
    });
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert([
        {
          product_id: id,
          user_name: newReview.user_name,
          rating: newReview.rating,
          comment: newReview.comment
        }
      ]);

      if (error) throw error;

      // Reset form dan ambil data review terbaru
      setNewReview({ user_name: '', rating: 5, comment: '' });
      
      const { data: updatedReviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });
        
      if (updatedReviews) setReviews(updatedReviews);
      alert('Terima kasih! Ulasan Anda berhasil dikirim.');

    } catch (error) {
      console.error('Gagal mengirim ulasan:', error);
      alert('Gagal mengirim ulasan. Pastikan RLS pada tabel reviews sudah dimatikan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Kalkulasi rata-rata rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 5.0; // Default jika belum ada ulasan

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 size={40} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center text-center p-4">
        <h2 className="font-poppins font-bold text-2xl text-slate-800 mb-2">Produk Tidak Ditemukan</h2>
        <p className="font-inter text-slateGray mb-6">Produk yang Anda cari mungkin telah dihapus atau link tidak valid.</p>
        <Link to="/produk" className="bg-primary hover:bg-darkPink text-white px-6 py-3 rounded-xl font-medium transition-colors">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb / Back button */}
        <Link to="/produk" className="inline-flex items-center gap-2 text-slateGray hover:text-primary font-inter font-medium text-sm mb-8 transition-colors">
          <ArrowLeft size={18} /> Kembali ke Katalog
        </Link>

        {/* ================= Bagian Atas: Detail Produk ================= */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-softGray mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            
            {/* Foto Produk */}
            <div className="bg-softGray/20 rounded-2xl p-8 flex items-center justify-center aspect-square relative border border-softGray">
              {product.badge && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-[#EC6BA5] to-[#D4538E] text-white font-poppins font-bold text-xs px-4 py-1.5 rounded-full shadow-md z-10">
                  {product.badge}
                </span>
              )}
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" style={{ mixBlendMode: 'multiply' }} />
              ) : (
                <span className="text-slate-400 font-inter">Tidak ada foto</span>
              )}
            </div>

            {/* Info Produk */}
            <div className="flex flex-col justify-center">
              <span className="text-primary font-poppins font-semibold tracking-wider text-sm uppercase mb-2">
                {product.category}
              </span>
              <h1 className="font-poppins font-bold text-3xl md:text-4xl text-slate-800 mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* Rating Review Singkat */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center text-[#F59E0B]">
                  <Star size={18} className="fill-current" />
                </div>
                <span className="font-inter font-bold text-slate-800 text-lg">{averageRating}</span>
                <span className="font-inter text-slateGray text-sm">
                  ({reviews.length} Ulasan)
                </span>
              </div>

              <div className="text-3xl font-poppins font-bold text-slate-800 mb-6">
                Rp {product.price?.toLocaleString('id-ID')}
              </div>

              {/* Deskripsi Produk */}
              {product.description && (
                <div className="mb-6 bg-[#FAFAFA] p-5 rounded-2xl border border-softGray">
                  <h3 className="font-poppins font-semibold text-slate-800 mb-2 text-sm">Deskripsi Produk:</h3>
                  <p className="font-inter text-slate-600 text-sm leading-relaxed text-justify">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Ukuran */}
              {product.size && (
                <div className="mb-8">
                  <span className="block font-inter font-semibold text-slate-800 mb-2">Ukuran/Isi:</span>
                  <div className="inline-block border-2 border-primary text-primary font-inter font-medium px-4 py-2 rounded-lg bg-roseTint/30">
                    {product.size}
                  </div>
                </div>
              )}

              {/* Tombol Add to Cart */}
              <button 
                onClick={handleAddToCart}
                className="w-full sm:w-auto bg-gradient-to-r from-[#EC6BA5] to-[#D4538E] hover:from-[#D4538E] hover:to-[#be407b] text-white font-poppins font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
              >
                {isAddedToCart ? (
                  <><CheckCircle2 size={22} /> Berhasil Ditambahkan</>
                ) : (
                  <><ShoppingBag size={22} /> Tambah ke Keranjang</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ================= Bagian Bawah: Ulasan & Rating ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Kolom Kiri: Form Tulis Ulasan */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-softGray sticky top-24">
              <h3 className="font-poppins font-bold text-xl text-slate-800 mb-2">Tulis Ulasan</h3>
              <p className="font-inter text-sm text-slateGray mb-6">Bagikan pengalaman Anda menggunakan produk ini.</p>
              
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block font-inter text-sm font-medium text-slate-700 mb-2">Penilaian Anda</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          size={28} 
                          className={star <= newReview.rating ? "text-[#F59E0B] fill-[#F59E0B]" : "text-slate-200"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-inter text-sm font-medium text-slate-700 mb-2">Nama Anda</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Sarah A."
                    className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-inter"
                    value={newReview.user_name}
                    onChange={(e) => setNewReview({...newReview, user_name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block font-inter text-sm font-medium text-slate-700 mb-2">Komentar / Pengalaman</label>
                  <textarea 
                    required 
                    placeholder="Bagaimana hasil pemakaian produk ini di kulit Anda?"
                    rows="4"
                    className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-inter resize-none"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-poppins font-semibold py-3.5 rounded-xl transition-colors disabled:bg-slate-400 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Kirim Ulasan'}
                </button>
              </form>
            </div>
          </div>

          {/* Kolom Kanan: Daftar Ulasan */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare size={24} className="text-primary" />
              <h3 className="font-poppins font-bold text-2xl text-slate-800">Ulasan Pelanggan</h3>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-softGray border-dashed">
                <p className="font-inter text-slateGray">Belum ada ulasan untuk produk ini. Jadilah yang pertama memberikan ulasan!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-softGray">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-roseTint text-primary flex items-center justify-center font-bold font-poppins">
                          {review.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-poppins font-bold text-slate-800 text-sm">{review.user_name}</p>
                          <p className="font-inter text-xs text-slate-500">
                            {new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-[#F59E0B]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-slate-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="font-inter text-slate-700 text-sm leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetail;