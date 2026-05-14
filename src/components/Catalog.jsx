import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { supabase } from '../lib/supabaseClient';
import { Filter, Search, X } from 'lucide-react';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  
  // Fitur Search URL (Agar bisa dikoneksikan dengan Navbar nanti)
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

  const categories = ['Semua', 'Skincare', 'Obat', 'Vitamin', 'Sunscreen', 'Serum', 'Treatment'];

  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const dummyProducts = [
          { id: 'd1', name: 'Brightening Face Wash', category: 'Skincare', size: '100 ml', price: 85000, badge: 'New', image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&auto=format&fit=crop' },
          { id: 'd2', name: 'Acne Care Serum', category: 'Serum', size: '30 ml', price: 120000, badge: 'Best Seller', image_url: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=400&auto=format&fit=crop' },
          { id: 'd3', name: 'Paracetamol 500mg', category: 'Obat', size: '10 Tablet', price: 15000, image_url: '' },
          { id: 'd4', name: 'Vitamin C 1000mg', category: 'Vitamin', size: '30 Kapsul', price: 45000, image_url: '' },
          { id: 'd5', name: 'Daily UV Sunscreen SPF 50', category: 'Sunscreen', size: '50 ml', price: 95000, image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop' },
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

  // Update URL parameters saat mencari
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchParams({});
  };

  // Logika Filter Ganda: Berdasarkan Kategori DAN Kata Kunci Pencarian
  const filteredProducts = products.filter(product => {
    const matchCategory = activeCategory === 'Semua' || product.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = product.name?.toLowerCase().includes(query.toLowerCase()) || product.description?.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-softGray/10 py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Header, Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="flex-1 max-w-xl">
            <h1 className="font-poppins font-bold text-3xl text-deepMagenta mb-2">Katalog Produk</h1>
            <p className="font-inter text-slateGray mb-6">Temukan skincare, obat, dan vitamin yang tepat untuk Anda.</p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative flex items-center w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari nama produk atau bahan..."
                className="w-full bg-white border border-softGray rounded-full pl-11 pr-10 py-3 font-inter text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
              />
              {searchInput && (
                <button type="button" onClick={clearSearch} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary transition-colors">
                  <X size={16} />
                </button>
              )}
            </form>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
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

        {/* Notifikasi Hasil Pencarian */}
        {query && (
          <div className="mb-6 font-inter text-sm text-slate-600">
            Menampilkan hasil pencarian untuk: <span className="font-semibold text-slate-800">"{query}"</span> 
            <span className="ml-2 text-slate-400">({filteredProducts.length} produk ditemukan)</span>
          </div>
        )}

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-softGray shadow-sm">
            <Search size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="font-poppins font-bold text-xl text-slate-800 mb-2">Produk Tidak Ditemukan</h3>
            <p className="font-inter text-slateGray mb-6">Maaf, kami tidak menemukan produk yang cocok dengan pencarian Anda.</p>
            <button onClick={clearSearch} className="bg-primary hover:bg-darkPink text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Catalog;