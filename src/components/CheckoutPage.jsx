import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart, removeFromCart } = useCart();
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', paymentMethod: 'QRIS' });

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutWA = (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Keranjang belanja kosong!");

    let message = `Halo SESA Dermatology, saya ingin memesan produk berikut:\n\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.title} (${item.qty}x) - Rp ${(item.price * item.qty).toLocaleString('id-ID')}\n`;
    });
    
    message += `\n*Total Belanja: Rp ${totalPrice.toLocaleString('id-ID')}*\n\n`;
    message += `*Data Pengiriman:*\n`;
    message += `Nama: ${formData.name}\n`;
    message += `No. WhatsApp: ${formData.phone}\n`;
    message += `Alamat Lengkap: ${formData.address}\n`;
    message += `Metode Pembayaran: ${formData.paymentMethod}\n\n`;
    message += `Mohon informasi untuk proses pembayarannya. Terima kasih!`;

    const waNumber = "6281234567890"; // Pastikan ganti dengan nomor admin klinik
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(waLink, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-softGray/20 py-20 px-4 text-center flex flex-col items-center">
        <h2 className="font-poppins font-bold text-2xl text-deepMagenta mb-4">Keranjang Belanja Kosong</h2>
        <p className="font-inter text-slateGray mb-8">Anda belum menambahkan produk apapun ke keranjang.</p>
        <Link to="/produk" className="bg-primary hover:bg-darkPink text-white px-8 py-3 rounded-full font-medium transition-colors inline-block">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-softGray/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Daftar Keranjang */}
        <div className="w-full lg:w-3/5 bg-white rounded-3xl shadow-sm border border-softGray p-6 md:p-8">
          <h2 className="font-poppins font-bold text-2xl text-deepMagenta mb-6">Keranjang Belanja</h2>
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b border-softGray pb-6 last:border-0 last:pb-0">
                <div className="w-20 h-20 bg-softGray/30 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="object-contain w-full h-full mix-blend-multiply" />
                  ) : (
                    <div className="w-8 h-12 bg-softPink rounded-md opacity-50"></div>
                  )}
                </div>
                <div className="flex-grow">
                  <h4 className="font-poppins font-semibold text-darkPink text-sm md:text-base line-clamp-1">{item.title}</h4>
                  <p className="font-inter text-xs text-slateGray mb-2">{item.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-poppins font-bold text-primary text-sm">
                      Rp {item.price.toLocaleString('id-ID')} x {item.qty}
                    </span>
                    <button onClick={() => removeFromCart(item.title)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Checkout */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white rounded-3xl shadow-sm border border-softGray p-6 md:p-8 sticky top-24">
            <h2 className="font-poppins font-bold text-xl text-deepMagenta mb-6">Detail Pengiriman</h2>
            <form onSubmit={handleCheckoutWA} className="space-y-4">
              <div>
                <label className="font-inter text-sm font-medium text-slateGray">Nama Lengkap</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full mt-1 border border-softGray rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm" />
              </div>
              <div>
                <label className="font-inter text-sm font-medium text-slateGray">Nomor WhatsApp</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full mt-1 border border-softGray rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm" />
              </div>
              <div>
                <label className="font-inter text-sm font-medium text-slateGray">Alamat Lengkap</label>
                <textarea name="address" required rows="3" value={formData.address} onChange={handleInputChange} className="w-full mt-1 border border-softGray rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm resize-none"></textarea>
              </div>
              <div>
                <label className="font-inter text-sm font-medium text-slateGray">Metode Pembayaran</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full mt-1 border border-softGray rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-inter text-sm bg-white">
                  <option value="QRIS">QRIS</option>
                  <option value="Transfer Bank">Transfer Bank</option>
                </select>
              </div>

              <div className="border-t border-softGray pt-4 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-inter font-medium text-slateGray">Total Tagihan</span>
                  <span className="font-poppins font-bold text-xl text-deepMagenta">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-darkPink text-white font-poppins font-semibold py-3.5 rounded-xl transition-colors shadow-md flex justify-center items-center gap-2">
                  Lanjutkan ke Pembayaran <ArrowRight size={18} />
                </button>
                <p className="text-[10px] text-center text-slateGray mt-3 font-inter">Anda akan diarahkan ke WhatsApp untuk menyelesaikan pesanan.</p>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;