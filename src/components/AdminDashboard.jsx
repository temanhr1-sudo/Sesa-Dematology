import { useState, useEffect } from 'react';
import { Package, ClipboardList, CalendarDays, Plus, Search, LogOut, X, Save } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('produk');
  const [products, setProducts] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State untuk form tambah produk
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Skincare', price: '', image_url: '' });

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (pData) setProducts(pData);

      const { data: sData } = await supabase.from('patient_submissions').select('*').order('created_at', { ascending: false });
      if (sData) setPrescriptions(sData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('products').insert([
        { name: newProduct.name, category: newProduct.category, price: parseInt(newProduct.price), image_url: newProduct.image_url }
      ]);
      if (error) throw error;
      setIsModalOpen(false);
      setNewProduct({ name: '', category: 'Skincare', price: '', image_url: '' });
      fetchAdminData();
    } catch (error) {
      alert('Gagal menambah produk');
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-softGray flex flex-col">
        <div className="p-6 border-b border-softGray flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">+</div>
          <h2 className="font-poppins font-bold text-xl text-deepMagenta tracking-tight">SESA Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('produk')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'produk' ? 'bg-roseTint text-darkPink font-semibold' : 'text-slateGray hover:bg-softGray'}`}>
            <Package size={20} /> Kelola Produk
          </button>
          <button onClick={() => setActiveTab('resep')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'resep' ? 'bg-roseTint text-darkPink font-semibold' : 'text-slateGray hover:bg-softGray'}`}>
            <ClipboardList size={20} /> Data Pasien
          </button>
        </nav>
        <div className="p-4 border-t border-softGray">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium">
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'produk' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-poppins font-bold text-2xl text-slate-800">Katalog Produk</h1>
              <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-darkPink text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all font-medium">
                <Plus size={20} /> Tambah Produk
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-softGray shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAFAFA] border-b border-softGray">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-700">Produk</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Kategori</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Harga</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-softGray">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-roseTint/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{p.name}</td>
                      <td className="px-6 py-4 capitalize">{p.category}</td>
                      <td className="px-6 py-4">Rp {p.price?.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <button className="text-primary font-semibold hover:underline">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'resep' && (
           <div>
             <h1 className="font-poppins font-bold text-2xl text-slate-800 mb-8">Submission Pasien</h1>
             <div className="bg-white rounded-3xl border border-softGray shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                 <thead className="bg-[#FAFAFA] border-b border-softGray text-slate-700">
                    <tr>
                      <th className="px-6 py-4">Nama Pasien</th>
                      <th className="px-6 py-4">Tipe</th>
                      <th className="px-6 py-4">WhatsApp</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-softGray">
                    {prescriptions.map(r => (
                      <tr key={r.id}>
                        <td className="px-6 py-4 font-medium">{r.patient_name}</td>
                        <td className="px-6 py-4 capitalize">{r.submission_type}</td>
                        <td className="px-6 py-4">{r.whatsapp_number}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold uppercase">{r.status}</span>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
           </div>
        )}
      </main>

      {/* Modal Tambah Produk */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-poppins font-bold text-xl text-slate-800">Tambah Produk Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slateGray hover:text-slate-800"><X /></button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input type="text" placeholder="Nama Produk" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              <select className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                <option value="Skincare">Skincare</option>
                <option value="Obat">Obat</option>
                <option value="Vitamin">Vitamin</option>
              </select>
              <input type="number" placeholder="Harga (Angka)" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
              <input type="text" placeholder="URL Gambar Produk" className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} />
              <button type="submit" className="w-full bg-primary text-white font-poppins font-semibold py-4 rounded-xl mt-4 flex items-center justify-center gap-2">
                <Save size={20} /> Simpan Produk
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;