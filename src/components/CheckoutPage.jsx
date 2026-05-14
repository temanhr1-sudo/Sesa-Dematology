import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, MapPin, Phone, User, ShoppingBag } from 'lucide-react';

const CheckoutPage = () => {
  // Hanya mengambil data dasar dari context agar tidak error jika context versi lama masih nyangkut
  const { cart = [], updateQuantity, removeFromCart } = useCart();
  
  // KALKULASI AMAN: Dihitung langsung di halaman ini agar tahan banting
  const safeTotalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const safeTotalPrice = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckoutWA = (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Keranjang belanja Anda masih kosong.');
      return;
    }

    // Nomor WhatsApp Admin Klinik SESA (Ganti dengan yang asli)
    const adminWA = "6281399822063"; 

    // Menyusun daftar pesanan
    let orderList = "";
    cart.forEach((item, index) => {
      const itemPrice = item.price || 0;
      const itemQty = item.quantity || 1;
      orderList += `${index + 1}. *${item.title}* (${itemQty}x) - Rp ${(itemPrice * itemQty).toLocaleString('id-ID')}\n`;
    });

    // Format Pesan WA yang elegan
    const message = `Halo Admin SESA Dermatology! 👋\nSaya ingin memesan produk berikut:\n\n` +
      `*🛒 DAFTAR PESANAN:*\n${orderList}\n` +
      `*💰 SUBTOTAL BARANG:* Rp ${safeTotalPrice.toLocaleString('id-ID')}\n\n` +
      `*📍 DATA PENGIRIMAN:*\n` +
      `- Nama: ${formData.name}\n` +
      `- No. HP: ${formData.phone}\n` +
      `- Alamat Lengkap: ${formData.address}\n` +
      `- Catatan: ${formData.notes || '-'}\n\n` +
      `Mohon info ketersediaan barang dan total biaya (Subtotal + Ongkos Kirim) ke alamat di atas ya. Terima kasih! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${adminWA}?text=${encodedMessage}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FAFAFA] px-4">
        <div className="w-24 h-24 bg-roseTint rounded-full flex items-center justify-center text-primary mb-6">
          <ShoppingBag size={40} />
        </div>
        <h2 className="font-poppins font-bold text-2xl text-slate-800 mb-2">Keranjang Anda Kosong</h2>
        <p className="font-inter text-slateGray mb-8 text-center max-w-md">Sepertinya Anda belum memilih produk apa pun. Yuk, jelajahi katalog kami untuk menemukan produk perawatan kulit terbaik.</p>
        <Link to="/produk" className="bg-primary hover:bg-darkPink text-white font-poppins font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-md">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb / Back button */}
        <Link to="/produk" className="inline-flex items-center gap-2 text-slateGray hover:text-primary font-inter font-medium text-sm mb-8 transition-colors">
          <ArrowLeft size={18} /> Lanjut Belanja
        </Link>

        <h1 className="font-poppins font-bold text-3xl text-slate-800 mb-8">Checkout Pesanan</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* BAGIAN KIRI: Daftar Keranjang & Form Pengiriman */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Daftar Produk di Keranjang */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-softGray">
              <h2 className="font-poppins font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" /> Daftar Barang ({safeTotalItems})
              </h2>
              
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pb-6 border-b border-softGray last:border-0 last:pb-0">
                    {/* Foto */}
                    <div className="w-24 h-24 rounded-2xl bg-softGray/20 border border-softGray p-2 flex-shrink-0">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-poppins font-semibold text-primary uppercase tracking-wider block mb-1">{item.category}</span>
                          <h3 className="font-poppins font-bold text-slate-800 text-lg leading-snug pr-4">{item.title}</h3>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Hapus barang">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className="font-poppins font-bold text-slate-800">
                          Rp {((item.price || 0) * (item.quantity || 1)).toLocaleString('id-ID')}
                        </span>
                        
                        {/* Kontrol Kuantitas */}
                        <div className="flex items-center gap-3 bg-[#FAFAFA] border border-softGray rounded-lg p-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-primary transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="font-inter font-medium text-sm w-4 text-center">{item.quantity || 1}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-primary transition-colors">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Data Pengiriman */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-softGray">
              <h2 className="font-poppins font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-primary" /> Alamat Pengiriman
              </h2>
              
              <form id="checkout-form" onSubmit={handleCheckoutWA} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="font-inter text-sm font-medium text-slate-700">Nama Penerima</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={18} className="text-slate-400" /></div>
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full border border-softGray rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm" placeholder="Contoh: Budi Santoso" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-inter text-sm font-medium text-slate-700">Nomor WhatsApp Aktif</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone size={18} className="text-slate-400" /></div>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full border border-softGray rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm" placeholder="Contoh: 08123456789" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-inter text-sm font-medium text-slate-700">Alamat Lengkap (Beserta Kode Pos)</label>
                  <textarea name="address" required value={formData.address} onChange={handleInputChange} rows="3" className="w-full border border-softGray rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm resize-none" placeholder="Contoh: Jl. Sudirman No. 5, RT 01/RW 02, Kec. Kebayoran Baru, Jakarta Selatan, 12190"></textarea>
                </div>

                <div className="space-y-2">
                  <label className="font-inter text-sm font-medium text-slate-700">Catatan Pesanan (Opsional)</label>
                  <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} className="w-full border border-softGray rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm" placeholder="Contoh: Tolong packing dengan aman ya" />
                </div>
              </form>
            </div>

          </div>

          {/* BAGIAN KANAN: Ringkasan Belanja (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-softGray sticky top-24">
              <h2 className="font-poppins font-bold text-xl text-slate-800 mb-6">Ringkasan Belanja</h2>
              
              <div className="space-y-4 font-inter text-sm mb-6 pb-6 border-b border-softGray">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Harga ({safeTotalItems} barang)</span>
                  <span className="font-medium text-slate-800">Rp {safeTotalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Ongkos Kirim</span>
                  <span className="text-primary italic font-medium">Dihitung Admin</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="font-poppins font-bold text-slate-800">Subtotal</span>
                <div className="text-right">
                  <span className="font-poppins font-bold text-2xl text-slate-800 block">Rp {safeTotalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Tombol yang men-trigger form di atas */}
              <button 
                type="submit" 
                form="checkout-form"
                className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-poppins font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Phone size={20} className="fill-current" /> Pesan via WhatsApp
              </button>
              
              <p className="text-center text-xs text-slate-400 font-inter mt-4">
                Anda akan diarahkan ke WhatsApp Admin untuk konfirmasi ongkos kirim.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;