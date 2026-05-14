import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

/* ══════════════════════════════════════════════════════
   DUMMY DATA — foto skincare yang relevan & reliable
══════════════════════════════════════════════════════ */
const dummyProducts = [
  {
    id: 'd1',
    name: 'Sunscreen SPF 50 PA+++',
    category: 'Skincare',
    size: '60 ml',
    price: 125000,
    rating: 4.9,
    reviews: 120,
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'd2',
    name: 'Acne Gentle Cleanser',
    category: 'Skincare',
    size: '100 ml',
    price: 150000,
    rating: 4.8,
    reviews: 89,
    image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'd3',
    name: 'Brightening Serum',
    category: 'Serum',
    size: '30 ml',
    price: 185000,
    rating: 5.0,
    reviews: 200,
    badge: 'Best Seller',
    image_url: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'd4',
    name: 'Moisturizer Gel',
    category: 'Moisturizer',
    size: '50 g',
    price: 145000,
    rating: 4.7,
    reviews: 67,
    image_url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'd5',
    name: 'Acne Spot Treatment',
    category: 'Treatment',
    size: '15 ml',
    price: 95000,
    rating: 4.9,
    reviews: 150,
    image_url: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=400&auto=format&fit=crop',
  },
];

/* ══════════════════════════════════════════════════════
   PRODUCT CARD — clean white background
══════════════════════════════════════════════════════ */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.name,
      category: product.category,
      price: product.price,
      imageUrl: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Default values jika kolom tidak ada di database Supabase kita
  const displaySize = product.size || '50 ml';
  const displayRating = product.rating || 4.9;
  const displayReviews = product.reviews || Math.floor(Math.random() * 50) + 50; // Random antara 50-100 review jika kosong

  return (
    <Link
      to={`/produk/${product.id}`}
      className="flex-shrink-0 snap-start group flex flex-col"
      style={{ width: 190 }}
    >
      {/* Image box — background sesuai mockup */}
      <div
        className="relative rounded-2xl overflow-hidden mb-3 flex items-center justify-center bg-white"
        style={{
          aspectRatio: '1/1',
          background: '#F9FAFB',
          border: '1.5px solid #F3F4F6',
          transition: 'border-color 0.25s, box-shadow 0.25s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#fce7f0';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.07)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#F3F4F6';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-2.5 left-2.5 z-10 font-poppins font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #EC6BA5, #D4538E)',
              fontSize: 9,
              padding: '3px 10px',
              borderRadius: 99,
              boxShadow: '0 2px 8px rgba(236,107,165,0.4)',
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Foto produk */}
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-[1.06] transition-transform duration-400"
            style={{ mixBlendMode: 'multiply', padding: '12px' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.style.background = '#fce7f0';
            }}
          />
        ) : (
          <ShoppingCart size={32} className="text-[#EC6BA5] opacity-30" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-0.5">
        {/* Nama produk */}
        <h4
          className="font-poppins font-bold text-slate-800 leading-snug mb-1 line-clamp-2 group-hover:text-[#EC6BA5] transition-colors"
          style={{ fontSize: 13 }}
        >
          {product.name}
        </h4>

        {/* Ukuran */}
        <span className="font-inter text-[#9CA3AF] block mb-2" style={{ fontSize: 11 }}>
          {displaySize}
        </span>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star size={11} className="text-[#F59E0B] fill-[#F59E0B]" />
          <span className="font-inter font-semibold text-slate-600" style={{ fontSize: 11 }}>
            {displayRating}
          </span>
          <span className="font-inter text-[#9CA3AF]" style={{ fontSize: 11 }}>
            ({displayReviews})
          </span>
        </div>

        {/* Harga + tombol add */}
        <div className="flex items-center justify-between mt-auto">
          <span className="font-poppins font-bold text-slate-800" style={{ fontSize: 14 }}>
            Rp {product.price?.toLocaleString('id-ID')}
          </span>

          <button
            onClick={handleAdd}
            aria-label="Tambah ke keranjang"
            className="flex items-center justify-center transition-all active:scale-90"
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: added
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #EC6BA5, #D4538E)',
              boxShadow: added
                ? '0 3px 10px rgba(16,185,129,0.35)'
                : '0 3px 10px rgba(236,107,165,0.38)',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {added ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <Plus size={15} color="white" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

/* ── Skeleton loader ── */
const SkeletonCard = () => (
  <div className="flex-shrink-0 snap-start animate-pulse" style={{ width: 190 }}>
    <div className="rounded-2xl aspect-square mb-3 bg-slate-100" />
    <div className="h-3.5 bg-slate-100 rounded mb-1.5 w-4/5" />
    <div className="h-3 bg-slate-100 rounded mb-2 w-1/3" />
    <div className="h-3 bg-slate-100 rounded mb-3 w-1/2" />
    <div className="h-4 bg-slate-100 rounded w-2/3" />
  </div>
);

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false }) // Ambil produk terbaru
          .limit(8);
        
        if (error) throw error;
        
        // Jika data ada, gunakan data database. Jika kosong, gunakan dummyProducts
        setProducts(data && data.length > 0 ? data : dummyProducts);
      } catch (error) {
        console.error('Error fetching:', error);
        setProducts(dummyProducts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* Update arrow visibility on scroll */
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -210 : 210, behavior: 'smooth' });
  };

  /* Arrow button style */
  const arrowStyle = (visible) => ({
    position: 'absolute',
    top: '42%',
    transform: 'translateY(-50%)',
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: 'white',
    border: '1.5px solid #fce7f0',
    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: visible ? 'pointer' : 'default',
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    transition: 'opacity 0.2s, background 0.2s',
    zIndex: 10,
    color: '#EC6BA5',
  });

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-poppins font-bold text-slate-800" style={{ fontSize: 22 }}>
            Produk Unggulan
          </h2>
          <Link
            to="/produk"
            className="font-inter font-medium text-[#EC6BA5] hover:text-[#D4538E] flex items-center gap-1.5 transition-colors"
            style={{ fontSize: 13 }}
          >
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        {/* Slider */}
        <div className="relative">

          {/* Arrow kiri */}
          <button
            onClick={() => scroll('left')}
            aria-label="Sebelumnya"
            style={{ ...arrowStyle(canScrollLeft), left: -18 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FFF0F6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Arrow kanan */}
          <button
            onClick={() => scroll('right')}
            aria-label="Berikutnya"
            style={{ ...arrowStyle(canScrollRight), right: -18 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FFF0F6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: 8 }}
          >
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              : products.map((p) => <ProductCard key={p.id} product={p} />)
            }
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;