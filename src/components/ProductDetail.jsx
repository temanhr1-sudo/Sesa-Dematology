import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingBag, Plus } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setIsLoading(true);
      try {
        if (id.startsWith('d')) {
           const dummyProducts = [
              { id: 'd1', name: 'Brightening Face Wash', category: 'Skincare', price: 85000, description: 'Pembersih wajah dengan formula lembut yang mencerahkan kulit kusam.', rating: '4.8 (120)' },
              { id: 'd2', name: 'Acne Care Serum', category: 'Skincare', price: 120000, description: 'Serum khusus untuk merawat kulit berjerawat dan mengurangi peradangan.', rating: '4.9 (85)' },
              { id: 'd3', name: 'Gentle Skin Moisturizing Cream', category: 'Moisturizer', price: 150000, description: 'Krim pelembap untuk menjaga hidrasi kulit sepanjang hari.', rating: '4.7 (200)' },
              { id: 'd4', name: 'Daily UV Sunscreen SPF 50', category: 'Sunscreen', price: 95000, description: 'Perlindungan maksimal dari paparan sinar UV yang tidak lengket di kulit.', rating: '4.8 (150)' },
              { id: 'd5', name: 'Paracetamol 500mg', category: 'Obat', price: 15000, description: 'Obat penurun panas dan pereda nyeri.', rating: '5.0 (20)' },
           ];
           const found = dummyProducts.find(p => p.id === id);
           setProduct(found);
        } else {
           const { data, error } = await supabase
             .from('products')
             .select('*')
             .eq('id', id)
             .single();
           
           if (error) throw error;
           setProduct(data);
        }
      } catch (error) {
        console.error('Error fetching product detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>;
  
  if (!product) return <div className="min-h-screen flex items-center justify-center font-inter text-slateGray">Produk tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slateGray hover:text-primary transition-colors font-inter text-sm mb-8">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2">
            <div className="bg-softGray/30 rounded-3xl aspect-square flex items-center justify-center p-8 border border-softGray">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="object-contain w-full h-full mix-blend-multiply" />
              ) : (
                <div className="w-32 h-48 bg-softPink rounded-xl opacity-50"></div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <span className="text-sm font-inter font-medium text-slateGray uppercase tracking-wider mb-2">{product.category || 'Skincare'}</span>
            <h1 className="font-poppins font-bold text-3xl md:text-4xl text-deepMagenta leading-tight mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#FFC107] text-lg">★</span>
              <span className="text-sm font-inter text-slateGray">{product.rating || '5.0'} Penilaian</span>
            </div>

            <p className="font-poppins font-bold text-2xl text-darkPink mb-6">Rp {product.price?.toLocaleString('id-ID')}</p>
            
            <p className="font-inter text-slateGray leading-relaxed mb-8">
              {product.description || 'Produk perawatan kulit berkualitas dari SESA Dermatology untuk membantu Anda tampil percaya diri setiap hari.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => addToCart({ id: product.id, title: product.name, category: product.category, price: product.price, imageUrl: product.image_url })}
                className="flex-1 bg-white hover:bg-softGray border-2 border-primary text-primary font-poppins font-semibold py-4 rounded-xl transition-colors flex justify-center items-center gap-2"
              >
                <Plus size={20} /> Keranjang
              </button>
              <button 
                onClick={() => {
                  addToCart({ id: product.id, title: product.name, category: product.category, price: product.price, imageUrl: product.image_url });
                  navigate('/checkout');
                }}
                className="flex-1 bg-primary hover:bg-darkPink text-white font-poppins font-semibold py-4 rounded-xl transition-colors shadow-md flex justify-center items-center gap-2"
              >
                <ShoppingBag size={20} /> Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;