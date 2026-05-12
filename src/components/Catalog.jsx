import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { supabase } from '../lib/supabaseClient';
import { Filter } from 'lucide-react';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = ['Semua', 'Skincare', 'Obat', 'Vitamin', 'Sunscreen'];

  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Data dummy sebagai cadangan jika database masih kosong
        const dummyProducts = [
          { id: 'd1', name: 'Brightening Face Wash', category: 'Skincare', price: 85000, rating: '4.8 (120)' },
          { id: 'd2', name: 'Acne Care Serum', category: 'Skincare', price: 120000, rating: '4.9 (85)' },
          { id: 'd3', name: 'Paracetamol 500mg', category: 'Obat', price: 15000, rating: '5.0 (20)' },
          { id: 'd4', name: 'Vitamin C 1000mg', category: 'Vitamin', price: 45000, rating: '4.9 (50)' },
          { id: 'd5', name: 'Daily UV Sunscreen SPF 50', category: 'Sunscreen', price: 95000, rating: '4.8 (150)' },
        ];

        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(dummyProducts);
        }
      } catch (error) {
        console.error('Error fetching catalog:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Fungsi untuk memfilter produk berdasarkan kategori yang dipilih
  const filteredProducts = activeCategory === 'Semua' 
    ? products 
    : products.filter(product => product.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-softGray/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="font-poppins font-bold text-3xl text-deepMagenta mb-2">Katalog Produk</h1>
            <p className="font-inter text-slateGray">Temukan skincare, obat, dan vitamin yang tepat untuk Anda.</p>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter size={18} className="text-slateGray mr-2 hidden md:block" />
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-5 py-2 rounded-full font-inter text-sm transition-colors border ${
                  activeCategory === category 
                    ? 'bg-primary text-white border-primary shadow-sm' 
                    : 'bg-white text-slateGray border-softGray hover:border-softPink hover:text-darkPink'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-softGray">
            <p className="font-inter text-slateGray">Belum ada produk di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                title={product.name} 
                category={product.category || 'Skincare'} 
                price={product.price} 
                imageUrl={product.image_url}
                rating={product.rating || '5.0 (New)'} 
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Catalog;