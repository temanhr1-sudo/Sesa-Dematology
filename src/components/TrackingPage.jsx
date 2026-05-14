import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Search, Package, Clock, Truck, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrackingPage = () => {
  const [whatsappKey, setWhatsappKey] = useState('');
  const [trackingResults, setTrackingResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!whatsappKey.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setTrackingResults([]);

    try {
      const { data, error } = await supabase
        .from('patient_submissions')
        .select('*')
        .eq('whatsapp_number', whatsappKey.trim())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrackingResults(data || []);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      alert('Terjadi kesalahan saat mencari data.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase();
    if (s === 'diproses apoteker') return <Package className="text-blue-500" />;
    if (s === 'dikirim kurir') return <Truck className="text-purple-500" />;
    if (s === 'selesai') return <CheckCircle className="text-green-500" />;
    return <Clock className="text-yellow-500" />; // Default Pending
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'diproses apoteker') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s === 'dikirim kurir') return 'bg-purple-100 text-purple-700 border-purple-200';
    if (s === 'selesai') return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200'; // Default Pending
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        <Link to="/" className="inline-flex items-center gap-2 text-slateGray hover:text-primary font-inter font-medium text-sm mb-8 transition-colors">
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>

        <div className="text-center mb-10">
          <h1 className="font-poppins font-bold text-3xl md:text-4xl text-slate-800 mb-4">Lacak Status Pesanan</h1>
          <p className="font-inter text-slate-600 max-w-xl mx-auto">
            Masukkan Nomor WhatsApp yang Anda gunakan saat Booking atau Upload Resep untuk melihat status pesanan dan nomor resi pengiriman Anda.
          </p>
        </div>

        {/* Kotak Pencarian */}
        <div className="bg-white rounded-3xl shadow-sm border border-softGray p-6 md:p-8 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-slate-400" />
              </div>
              <input 
                type="tel" 
                required 
                value={whatsappKey}
                onChange={(e) => setWhatsappKey(e.target.value)}
                placeholder="Contoh: 081234567890" 
                className="w-full bg-[#FAFAFA] border border-softGray rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-[#EC6BA5] focus:ring-1 focus:ring-[#EC6BA5] font-inter text-base" 
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-[#EC6BA5] to-[#D4538E] hover:from-[#D4538E] hover:to-[#be407b] text-white font-poppins font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-70 whitespace-nowrap"
            >
              {isLoading ? <><Loader2 className="animate-spin" size={20} /> Mencari...</> : 'Cek Status'}
            </button>
          </form>
        </div>

        {/* Hasil Pencarian */}
        {hasSearched && !isLoading && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {trackingResults.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-softGray p-12 text-center">
                <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="font-poppins font-bold text-xl text-slate-800 mb-2">Data Tidak Ditemukan</h3>
                <p className="font-inter text-slate-600">Kami tidak menemukan pesanan atau resep dengan nomor WhatsApp tersebut. Pastikan nomor yang dimasukkan sudah benar.</p>
              </div>
            ) : (
              trackingResults.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-softGray p-6 md:p-8 overflow-hidden relative">
                  {/* Dekorasi Garis Kiri */}
                  <div className={`absolute left-0 top-0 bottom-0 w-2 ${getStatusColor(item.status).split(' ')[0]}`}></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pl-2">
                    <div>
                      <span className="font-inter text-xs text-slate-500 block mb-1">
                        Tanggal: {new Date(item.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <h3 className="font-poppins font-bold text-lg text-slate-800">{item.submission_type}</h3>
                      <p className="font-inter text-sm text-slate-600 mt-1">Atas Nama: <span className="font-semibold">{item.patient_name}</span></p>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="font-poppins font-bold text-sm uppercase tracking-wider">
                        {item.status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Resi Box */}
                  {item.resi && (
                    <div className="bg-[#FAFAFA] border border-softGray rounded-2xl p-5 ml-2 mt-4 flex items-center justify-between">
                      <div>
                        <p className="font-inter text-xs text-slate-500 mb-1 flex items-center gap-1"><Truck size={14}/> Nomor Resi Pengiriman:</p>
                        <p className="font-mono font-bold text-lg text-slate-800 tracking-wider">{item.resi}</p>
                      </div>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(item.resi); alert('Resi disalin!'); }}
                        className="bg-white border border-softGray hover:border-[#EC6BA5] hover:text-[#EC6BA5] text-slate-600 font-inter text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        Salin Resi
                      </button>
                    </div>
                  )}

                  {!item.resi && item.status?.toLowerCase() === 'diproses apoteker' && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 ml-2 mt-4">
                      <p className="font-inter text-sm text-blue-700">Resep/Pesanan Anda sedang disiapkan. Nomor resi akan muncul di sini setelah obat diserahkan ke kurir.</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TrackingPage;