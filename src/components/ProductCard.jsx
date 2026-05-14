import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Mencegah error jika product undefined
  if (!product) return null;

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

  // Nilai default jika di database kosong
  const displaySize = product.size || '50 ml';
  const displayRating = product.rating || 4.9;
  const displayReviews = product.reviews || Math.floor(Math.random() * 50) + 50;

  return (
    <Link
      to={`/produk/${product.id}`}
      className="flex-shrink-0 snap-start group flex flex-col w-full h-full"
    >
      {/* Image box — background sesuai mockup Premium */}
      <div
        className="relative w-full rounded-2xl overflow-hidden mb-3 flex items-center justify-center bg-white"
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
        {/* Badge (Misal: Best Seller) */}
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

        {/* Foto produk dengan efek Blend Multiply */}
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name || 'Produk SESA'}
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

      {/* Area Info Produk */}
      <div className="flex flex-col flex-1 px-1">
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

        {/* Rating & Review */}
        <div className="flex items-center gap-1 mb-3">
          <Star size={11} className="text-[#F59E0B] fill-[#F59E0B]" />
          <span className="font-inter font-semibold text-slate-600" style={{ fontSize: 11 }}>
            {displayRating}
          </span>
          <span className="font-inter text-[#9CA3AF]" style={{ fontSize: 11 }}>
            ({displayReviews})
          </span>
        </div>

        {/* Harga + Tombol Add to Cart (Merapat ke bawah) */}
        <div className="flex items-center justify-between mt-auto pt-2">
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

export default ProductCard;