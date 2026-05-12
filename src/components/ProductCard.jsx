import { Plus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/**
 * ProductCard
 * Props: id, title, category, size, price, imageUrl, rating, reviews, badge
 */
const ProductCard = ({ id, title, category, size, price, imageUrl, rating = 4.8, reviews, badge }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, title, category, price, imageUrl });
  };

  return (
    // ── FIX: hapus 'block' — sudah ada 'flex flex-col', conflict dengan 'flex'
    <Link
      to={`/produk/${id}`}
      className="bg-white rounded-[22px] border border-[#F3F4F6] p-4 shadow-sm hover:shadow-[0_8px_28px_rgba(236,107,165,0.12)] hover:border-[#fce7f0] transition-all duration-300 flex flex-col h-full group"
    >
      {/* Image container */}
      <div className="bg-[#FAFAFA] rounded-[18px] aspect-square mb-4 flex items-center justify-center p-4 relative overflow-hidden">
        {badge && (
          <span className="absolute top-2.5 left-2.5 bg-[#EC6BA5] text-white text-[9px] font-poppins font-bold px-2.5 py-0.5 rounded-full z-10 shadow-sm">
            {badge}
          </span>
        )}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-16 h-24 bg-[#fce7f0] rounded-xl opacity-60 group-hover:scale-105 transition-transform duration-300" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow">
        {category && (
          <span className="text-[10px] font-inter font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">
            {category}
          </span>
        )}

        <h4 className="font-poppins font-bold text-[#1F2937] text-[13px] sm:text-[14px] leading-snug mb-1 line-clamp-2 group-hover:text-[#EC6BA5] transition-colors">
          {title}
        </h4>

        {size && (
          <span className="font-inter text-[11px] text-[#9CA3AF] block mb-2.5">{size}</span>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star size={11} className="text-[#F59E0B] fill-[#F59E0B]" />
          <span className="font-inter text-[11px] text-slate-500 font-medium">{rating}</span>
          {reviews && (
            <span className="font-inter text-[11px] text-[#9CA3AF]">({reviews})</span>
          )}
        </div>

        {/* Price + Add button */}
        <div className="mt-auto flex items-center justify-between">
          <span className="font-poppins font-bold text-[#1F2937] text-[14px] sm:text-[15px]">
            Rp {price?.toLocaleString('id-ID')}
          </span>
          <button
            onClick={handleAddToCart}
            aria-label="Tambah ke keranjang"
            className="bg-[#EC6BA5] hover:bg-[#D4538E] active:scale-95 text-white p-2 rounded-full transition-all shadow-[0_3px_10px_rgba(236,107,165,0.35)] flex-shrink-0 relative z-10 flex items-center justify-center"
          >
            <Plus size={17} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;