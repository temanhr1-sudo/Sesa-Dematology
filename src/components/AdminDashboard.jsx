import { useState, useEffect } from 'react';
import { Package, ClipboardList, PenTool, Plus, LogOut, X, Save, UploadCloud, Loader2, Trash2, Edit, Users, Activity, Briefcase, Truck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'blockquote'],
    ['clean'],
  ],
};
const quillFormats = ['header','bold','italic','underline','strike','list','bullet','align','link','blockquote'];


const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Role Based Access Control (RBAC)
  const [userRole, setUserRole] = useState('admin'); // Default ke admin biasa

  // State Utama Tab
  const [activeTab, setActiveTab] = useState('resep');
  
  // State Data Database
  const [products, setProducts] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [articles, setArticles] = useState([]);
  const [staffList, setStaffList] = useState([]); 
  
  const [isLoading, setIsLoading] = useState(true);
  
  // State Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false); 
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditArticleModalOpen, setIsEditArticleModalOpen] = useState(false);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false); 
  
  const [isUploading, setIsUploading] = useState(false);
  
  // State Input Data Baru
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Skincare', price: '', size: '', badge: '', description: '', image_url: '' });
  const [newArticle, setNewArticle] = useState({ title: '', excerpt: '', content: '', author: 'Tim Sesa', category: 'Edukasi', image_url: '' });
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Dokter', schedule: '', credential: '', image_url: '' });
  
  const [editProduct, setEditProduct] = useState(null);
  const [editArticle, setEditArticle] = useState(null);
  const [editStaff, setEditStaff] = useState(null);

  // State Resi Tracking
  const [trackingData, setTrackingData] = useState({ id: null, status: '', resi: '' });

  const [imageFile, setImageFile] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      // Cek Kasta Admin (Role)
      if (user?.email) {
        const { data: roleData } = await supabase.from('admin_roles').select('role').eq('email', user.email).single();
        if (roleData) {
          setUserRole(roleData.role);
          if (roleData.role === 'superadmin') setActiveTab('dashboard');
        }
      }

      const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (pData) setProducts(pData);

      const { data: sData } = await supabase.from('patient_submissions').select('*').order('created_at', { ascending: false });
      if (sData) setPrescriptions(sData);

      const { data: aData } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (aData) setArticles(aData);

      const { data: stData } = await supabase.from('staff').select('*').order('created_at', { ascending: false });
      if (stData) setStaffList(stData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  // ===================== FUNGSI STATUS & RESI =====================
  const updateResepStatus = async (id, newStatus, newResi = null) => {
    try {
      const updateData = { status: newStatus };
      if (newResi !== null) updateData.resi = newResi;

      const { error } = await supabase.from('patient_submissions').update(updateData).eq('id', id);
      if (error) throw error;
      
      setTrackingData({ id: null, status: '', resi: '' });
      fetchAdminData();
      alert('Status berhasil diperbarui!');
    } catch (error) {
      alert(`Gagal update status: ${error.message}`);
    }
  };

  // ===================== FUNGSI PRODUK =====================
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImageUrl = newProduct.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
        if (uploadError) throw new Error(`Gagal upload gambar: ${uploadError.message}`);
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const { error } = await supabase.from('products').insert([
        { 
          name: newProduct.name, category: newProduct.category, price: parseInt(newProduct.price), 
          size: newProduct.size, badge: newProduct.badge, description: newProduct.description, image_url: finalImageUrl 
        }
      ]);
      if (error) throw new Error(`Gagal simpan: ${error.message}`);
      
      setIsModalOpen(false);
      setNewProduct({ name: '', category: 'Skincare', price: '', size: '', badge: '', description: '', image_url: '' });
      setImageFile(null);
      fetchAdminData();
    } catch (error) { alert(error.message); } finally { setIsUploading(false); }
  };

  const openEditProductModal = (product) => {
    setEditProduct(product); setImageFile(null); setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImageUrl = editProduct.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
        if (uploadError) throw new Error(`Gagal upload: ${uploadError.message}`);
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const { error } = await supabase.from('products').update({
        name: editProduct.name, category: editProduct.category, price: parseInt(editProduct.price), 
        size: editProduct.size, badge: editProduct.badge, description: editProduct.description, image_url: finalImageUrl
      }).eq('id', editProduct.id);

      if (error) throw new Error(`Gagal update: ${error.message}`);
      
      setIsEditModalOpen(false); setEditProduct(null); setImageFile(null); fetchAdminData();
    } catch (error) { alert(error.message); } finally { setIsUploading(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Hapus produk ini?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error; fetchAdminData();
    } catch (error) { alert(error.message); }
  };

  // ===================== FUNGSI ARTIKEL =====================
  const handleAddArticle = async (e) => {
    e.preventDefault(); setIsUploading(true);
    try {
      let finalImageUrl = newArticle.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `article_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }
      const { error } = await supabase.from('articles').insert([
        { title: newArticle.title, excerpt: newArticle.excerpt, content: newArticle.content, author: newArticle.author, category: newArticle.category, image_url: finalImageUrl }
      ]);
      if (error) throw error;
      setIsArticleModalOpen(false); setNewArticle({ title: '', excerpt: '', content: '', author: 'Tim Sesa', category: 'Edukasi', image_url: '' }); setImageFile(null); fetchAdminData();
    } catch (error) { alert(error.message); } finally { setIsUploading(false); }
  };

  const openEditArticleModal = (article) => { setEditArticle(article); setImageFile(null); setIsEditArticleModalOpen(true); };

  const handleUpdateArticle = async (e) => {
    e.preventDefault(); setIsUploading(true);
    try {
      let finalImageUrl = editArticle.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `article_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }
      const { error } = await supabase.from('articles').update({
        title: editArticle.title, excerpt: editArticle.excerpt, content: editArticle.content, author: editArticle.author, category: editArticle.category, image_url: finalImageUrl
      }).eq('id', editArticle.id);
      if (error) throw error;
      setIsEditArticleModalOpen(false); setEditArticle(null); setImageFile(null); fetchAdminData();
    } catch (error) { alert(error.message); } finally { setIsUploading(false); }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Hapus artikel?')) return;
    try { await supabase.from('articles').delete().eq('id', id); fetchAdminData(); } catch (error) { alert(error.message); }
  };

  // ===================== FUNGSI STAFF =====================
  const handleAddStaff = async (e) => {
    e.preventDefault(); setIsUploading(true);
    try {
      let finalImageUrl = newStaff.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `staff_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }
      const { error } = await supabase.from('staff').insert([
        { name: newStaff.name, role: newStaff.role, schedule: newStaff.schedule, credential: newStaff.credential, image_url: finalImageUrl }
      ]);
      if (error) throw error;
      setIsStaffModalOpen(false); setNewStaff({ name: '', role: 'Dokter', schedule: '', credential: '', image_url: '' }); setImageFile(null); fetchAdminData();
    } catch (error) { alert(error.message); } finally { setIsUploading(false); }
  };

  const openEditStaffModal = (staff) => { setEditStaff(staff); setImageFile(null); setIsEditStaffModalOpen(true); };

  const handleUpdateStaff = async (e) => {
    e.preventDefault(); setIsUploading(true);
    try {
      let finalImageUrl = editStaff.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `staff_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }
      const { error } = await supabase.from('staff').update({
        name: editStaff.name, role: editStaff.role, schedule: editStaff.schedule, credential: editStaff.credential, image_url: finalImageUrl
      }).eq('id', editStaff.id);
      if (error) throw error;
      setIsEditStaffModalOpen(false); setEditStaff(null); setImageFile(null); fetchAdminData();
    } catch (error) { alert(error.message); } finally { setIsUploading(false); }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Hapus data staf?')) return;
    try { await supabase.from('staff').delete().eq('id', id); fetchAdminData(); } catch (error) { alert(error.message); }
  };

  // Kalkulasi Dummy Data untuk Analytics (Berdasarkan data asli jika ada)
  const categoryData = categories => {
    const counts = {};
    products.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return Object.keys(counts).map(key => ({ name: key, jumlah: counts[key] }));
  };
  const chartData = categoryData(products);

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-inter">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-softGray flex flex-col">
        <div className="p-6 border-b border-softGray flex items-center gap-3">
          <img src="/images/Sesa.jpeg" alt="SESA" className="w-9 h-9 object-contain rounded-full shadow-sm" onError={(e) => { e.target.style.display = 'none'; }} />
          <div>
            <h2 className="font-poppins font-bold text-lg text-deepMagenta tracking-tight leading-tight">Admin SESA</h2>
            <span className="text-[10px] bg-roseTint text-primary px-2 py-0.5 rounded uppercase font-bold">{userRole}</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          
          {/* MENU KHUSUS SUPERADMIN */}
          {userRole === 'superadmin' && (
            <>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-4 pt-2 pb-1">Executive</p>
              <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-roseTint text-darkPink font-semibold' : 'text-slateGray hover:bg-softGray'}`}>
                <Activity size={20} /> Analytics Dashboard
              </button>
              <button onClick={() => setActiveTab('hr')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'hr' ? 'bg-roseTint text-darkPink font-semibold' : 'text-slateGray hover:bg-softGray'}`}>
                <Briefcase size={20} /> Manajemen SDM
              </button>
              <div className="border-b border-softGray my-2"></div>
            </>
          )}

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-4 pt-2 pb-1">Operasional</p>
          <button onClick={() => setActiveTab('resep')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'resep' ? 'bg-roseTint text-darkPink font-semibold' : 'text-slateGray hover:bg-softGray'}`}>
            <ClipboardList size={20} /> Data Pasien & Resep
          </button>
          <button onClick={() => setActiveTab('produk')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'produk' ? 'bg-roseTint text-darkPink font-semibold' : 'text-slateGray hover:bg-softGray'}`}>
            <Package size={20} /> Kelola Produk
          </button>
          <button onClick={() => setActiveTab('artikel')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'artikel' ? 'bg-roseTint text-darkPink font-semibold' : 'text-slateGray hover:bg-softGray'}`}>
            <PenTool size={20} /> Blog & Edukasi
          </button>
          <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'staff' ? 'bg-roseTint text-darkPink font-semibold' : 'text-slateGray hover:bg-softGray'}`}>
            <Users size={20} /> Profil Tim Medis
          </button>
        </nav>
        
        <div className="p-4 border-t border-softGray">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium">
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* TAB ANALYTICS (Hanya Superadmin) */}
        {activeTab === 'dashboard' && userRole === 'superadmin' && (
          <div className="animate-in fade-in duration-500">
            <h1 className="font-poppins font-bold text-2xl text-slate-800 mb-2">Executive Analytics</h1>
            <p className="text-slate-500 text-sm mb-8">Pantau arus operasional dan persebaran produk SESA.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl border border-softGray shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center"><Package size={24}/></div>
                <div><p className="text-sm text-slate-500">Total Produk</p><p className="font-poppins font-bold text-2xl">{products.length}</p></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-softGray shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center"><ClipboardList size={24}/></div>
                <div><p className="text-sm text-slate-500">Total Submission</p><p className="font-poppins font-bold text-2xl">{prescriptions.length}</p></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-softGray shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center"><Users size={24}/></div>
                <div><p className="text-sm text-slate-500">Staf Aktif</p><p className="font-poppins font-bold text-2xl">{staffList.length}</p></div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-softGray shadow-sm h-96">
              <h3 className="font-poppins font-bold text-lg mb-6">Distribusi Kategori Produk</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="jumlah" fill="#EC6BA5" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB MANAJEMEN SDM (Hanya Superadmin) */}
        {activeTab === 'hr' && userRole === 'superadmin' && (
          <div className="animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-8">
               <div>
                 <h1 className="font-poppins font-bold text-2xl text-slate-800">Manajemen Shift & SDM</h1>
                 <p className="text-slate-500 text-sm">Kelola jadwal kerja operasional harian.</p>
               </div>
               <button onClick={() => setIsShiftModalOpen(true)} className="bg-primary hover:bg-darkPink text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all font-medium">
                 <Briefcase size={20} /> Atur Shift Baru
               </button>
             </div>
             
             <div className="bg-white rounded-3xl border border-softGray shadow-sm p-12 text-center">
               <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
               <h3 className="font-poppins font-bold text-xl text-slate-700">Modul Presensi SDM</h3>
               <p className="text-slate-500 max-w-md mx-auto mt-2">Ini adalah kerangka dasar (blueprint) untuk pengembangan modul HRIS. Anda dapat menghubungkan presensi staf dan pencatatan KPI di sini di fase selanjutnya.</p>
             </div>
          </div>
        )}

        {/* TAB DATA PASIEN & TRACKING RESEP */}
        {activeTab === 'resep' && (
           <div className="animate-in fade-in duration-500">
             <h1 className="font-poppins font-bold text-2xl text-slate-800 mb-8">Data Submission & Tracking</h1>
             <div className="bg-white rounded-3xl border border-softGray shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                 <thead className="bg-[#FAFAFA] border-b border-softGray">
                   <tr>
                     <th className="px-6 py-4">Tgl & Nama</th>
                     <th className="px-6 py-4">Tipe Submission</th>
                     <th className="px-6 py-4">WhatsApp</th>
                     <th className="px-6 py-4">Status & Tracking</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-softGray">
                    {prescriptions.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800">{r.patient_name}</div>
                          <div className="text-[11px] text-slate-400">{new Date(r.created_at).toLocaleDateString('id-ID')}</div>
                        </td>
                        <td className="px-6 py-4 text-xs max-w-xs truncate" title={r.submission_type}>{r.submission_type}</td>
                        <td className="px-6 py-4 font-mono text-xs">{r.whatsapp_number}</td>
                        <td className="px-6 py-4">
                          {/* SISTEM UBAH STATUS */}
                          {trackingData.id === r.id ? (
                            <div className="flex flex-col gap-2">
                              <select 
                                value={trackingData.status} 
                                onChange={(e) => setTrackingData({...trackingData, status: e.target.value})}
                                className="border border-primary rounded p-1 text-xs"
                              >
                                <option value="pending">Pending</option>
                                <option value="diproses apoteker">Diproses Apoteker</option>
                                <option value="dikirim kurir">Dikirim Kurir</option>
                                <option value="selesai">Selesai</option>
                              </select>
                              {trackingData.status === 'dikirim kurir' && (
                                <input 
                                  type="text" 
                                  placeholder="Input Nomor Resi" 
                                  className="border border-softGray rounded p-1 text-xs"
                                  value={trackingData.resi}
                                  onChange={(e) => setTrackingData({...trackingData, resi: e.target.value})}
                                />
                              )}
                              <div className="flex gap-2">
                                <button onClick={() => updateResepStatus(r.id, trackingData.status, trackingData.resi)} className="bg-primary text-white text-[10px] px-2 py-1 rounded">Simpan</button>
                                <button onClick={() => setTrackingData({id: null, status:'', resi:''})} className="bg-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded">Batal</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between group">
                              <div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                                  ${r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                    r.status === 'diproses apoteker' ? 'bg-blue-100 text-blue-700' :
                                    r.status === 'dikirim kurir' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                  {r.status || 'Pending'}
                                </span>
                                {r.resi && <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1"><Truck size={10}/> Resi: {r.resi}</div>}
                              </div>
                              <button onClick={() => setTrackingData({id: r.id, status: r.status || 'pending', resi: r.resi || ''})} className="opacity-0 group-hover:opacity-100 text-blue-500 p-1 bg-blue-50 rounded transition-opacity" title="Ubah Status">
                                <Edit size={14} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
           </div>
        )}

        {/* TAB PRODUK */}
        {activeTab === 'produk' && (
           <div className="animate-in fade-in duration-500">
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
                     <th className="px-6 py-4">Foto</th>
                     <th className="px-6 py-4">Produk</th>
                     <th className="px-6 py-4">Kategori</th>
                     <th className="px-6 py-4">Ukuran & Harga</th>
                     <th className="px-6 py-4 text-center">Aksi</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-softGray">
                   {products.map(p => (
                     <tr key={p.id} className="hover:bg-roseTint/5 transition-colors">
                       <td className="px-6 py-4">
                         <div className="w-10 h-10 rounded-lg bg-softGray overflow-hidden">
                           <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                         </div>
                       </td>
                       <td className="px-6 py-4 font-medium">
                         {p.name} 
                         {p.badge && <span className="ml-2 bg-roseTint text-primary px-2 py-0.5 rounded text-[10px]">{p.badge}</span>}
                       </td>
                       <td className="px-6 py-4 capitalize">{p.category}</td>
                       <td className="px-6 py-4">
                         <div className="text-xs text-slate-500">{p.size || '-'}</div>
                         <div className="font-medium">Rp {p.price?.toLocaleString('id-ID')}</div>
                       </td>
                       <td className="px-6 py-4 text-center">
                         <div className="flex justify-center gap-2">
                           <button onClick={() => openEditProductModal(p)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Edit Produk">
                             <Edit size={18} />
                           </button>
                           <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Hapus Produk">
                             <Trash2 size={18} />
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        )}

        {/* TAB ARTIKEL */}
        {activeTab === 'artikel' && (
           <div className="animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-8">
               <h1 className="font-poppins font-bold text-2xl text-slate-800">Manajemen Artikel</h1>
               <button onClick={() => setIsArticleModalOpen(true)} className="bg-primary hover:bg-darkPink text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all font-medium">
                 <Plus size={20} /> Tulis Artikel
               </button>
             </div>

             <div className="bg-white rounded-3xl border border-softGray shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                 <thead className="bg-[#FAFAFA] border-b border-softGray text-slate-700">
                    <tr>
                      <th className="px-6 py-4">Judul Artikel</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4">Penulis</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-softGray">
                    {articles.map(a => (
                      <tr key={a.id} className="hover:bg-roseTint/5 transition-colors">
                        <td className="px-6 py-4 font-medium max-w-xs truncate">{a.title}</td>
                        <td className="px-6 py-4"><span className="bg-roseTint text-primary px-3 py-1 rounded-full text-[10px] font-bold">{a.category}</span></td>
                        <td className="px-6 py-4">{a.author}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => openEditArticleModal(a)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Edit Artikel">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDeleteArticle(a.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Hapus Artikel">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
           </div>
        )}

        {/* TAB TIM MEDIS (STAFF) */}
        {activeTab === 'staff' && (
           <div className="animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-8">
               <h1 className="font-poppins font-bold text-2xl text-slate-800">Profil Tim Medis</h1>
               <button onClick={() => setIsStaffModalOpen(true)} className="bg-primary hover:bg-darkPink text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all font-medium">
                 <Plus size={20} /> Tambah Data
               </button>
             </div>

             <div className="bg-white rounded-3xl border border-softGray shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                 <thead className="bg-[#FAFAFA] border-b border-softGray text-slate-700">
                    <tr>
                      <th className="px-6 py-4">Foto</th>
                      <th className="px-6 py-4">Nama</th>
                      <th className="px-6 py-4">Peran</th>
                      <th className="px-6 py-4">Jadwal / Kredensial</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-softGray">
                    {staffList.map(s => (
                      <tr key={s.id} className="hover:bg-roseTint/5 transition-colors">
                        <td className="px-6 py-4">
                           <div className="w-12 h-12 rounded-full bg-softGray overflow-hidden border border-softPink">
                             <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                           </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{s.name}</td>
                        <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold ${s.role === 'Dokter' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{s.role}</span></td>
                        <td className="px-6 py-4">
                          {s.role === 'Dokter' ? (
                             <div className="text-xs"><span className="font-semibold block">Jadwal:</span> {s.schedule}<br/><span className="text-slate-500">SIP: {s.credential}</span></div>
                          ) : (
                             <div className="text-xs"><span className="font-semibold block">SIPA:</span> {s.credential}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => openEditStaffModal(s)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Edit Data">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDeleteStaff(s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Hapus Data">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
           </div>
        )}

      </main>

      {/* ===================== MODALS AREA ===================== */}

      {/* MODAL SHIFT SDM (Dummy) */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl text-center">
             <Briefcase size={40} className="mx-auto text-primary mb-4" />
             <h3 className="font-poppins font-bold text-xl text-slate-800 mb-2">Modul Shift Belum Aktif</h3>
             <p className="font-inter text-slate-500 text-sm mb-6">Database untuk sistem HRIS (Human Resource Information System) masih dalam tahap pengembangan.</p>
             <button onClick={() => setIsShiftModalOpen(false)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors">Tutup</button>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH PRODUK */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-poppins font-bold text-xl text-slate-800">Tambah Produk Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slateGray hover:text-slate-800"><X /></button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input type="text" placeholder="Nama Produk" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              
              <select className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                <option value="Skincare">Skincare</option><option value="Obat">Obat</option><option value="Vitamin">Vitamin</option>
                <option value="Serum">Serum</option><option value="Moisturizer">Moisturizer</option><option value="Treatment">Treatment</option><option value="Sunscreen">Sunscreen</option>
              </select>
              
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Harga (Angka)" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                <input type="text" placeholder="Ukuran (Cth: 30 ml)" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewProduct({...newProduct, size: e.target.value})} />
              </div>

              <input type="text" placeholder="Badge (Cth: Best Seller) - Opsional" className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewProduct({...newProduct, badge: e.target.value})} />
              <textarea placeholder="Deskripsi Singkat Produk..." required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none h-20 resize-none" onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>

              <div className="border-2 border-dashed border-softGray rounded-xl p-4 text-center">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" id="productImageUpload" />
                <label htmlFor="productImageUpload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <UploadCloud size={24} className={imageFile ? "text-primary" : "text-slate-400"} />
                  <span className="text-xs text-slateGray font-medium">{imageFile ? imageFile.name : "Klik untuk upload foto produk"}</span>
                </label>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-softGray"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">Atau URL</span>
                <div className="flex-grow border-t border-softGray"></div>
              </div>

              <input type="text" placeholder="URL Gambar (Opsional)" className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} />
              
              <button disabled={isUploading} type="submit" className="w-full bg-primary hover:bg-darkPink text-white font-poppins font-semibold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 disabled:bg-softPink transition-colors">
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <><Save size={20} /> Simpan Produk</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT PRODUK */}
      {isEditModalOpen && editProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-poppins font-bold text-xl text-slate-800">Edit Produk</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slateGray hover:text-slate-800"><X /></button>
            </div>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <input type="text" value={editProduct.name} required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditProduct({...editProduct, name: e.target.value})} />
              
              <select value={editProduct.category} className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditProduct({...editProduct, category: e.target.value})}>
                <option value="Skincare">Skincare</option><option value="Obat">Obat</option><option value="Vitamin">Vitamin</option>
                <option value="Serum">Serum</option><option value="Moisturizer">Moisturizer</option><option value="Treatment">Treatment</option><option value="Sunscreen">Sunscreen</option>
              </select>
              
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={editProduct.price} required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditProduct({...editProduct, price: e.target.value})} />
                <input type="text" value={editProduct.size || ''} placeholder="Ukuran" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditProduct({...editProduct, size: e.target.value})} />
              </div>

              <input type="text" value={editProduct.badge || ''} placeholder="Badge (Opsional)" className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditProduct({...editProduct, badge: e.target.value})} />
              <textarea value={editProduct.description || ''} placeholder="Deskripsi Singkat Produk..." required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none h-20 resize-none" onChange={e => setEditProduct({...editProduct, description: e.target.value})}></textarea>

              <div className="border-2 border-dashed border-softGray rounded-xl p-4 text-center">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" id="editProductImageUpload" />
                <label htmlFor="editProductImageUpload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <UploadCloud size={24} className={imageFile ? "text-primary" : "text-slate-400"} />
                  <span className="text-xs text-slateGray font-medium">{imageFile ? imageFile.name : "Upload foto baru (Kosongkan jika tak diubah)"}</span>
                </label>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-softGray"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">Atau URL</span>
                <div className="flex-grow border-t border-softGray"></div>
              </div>

              <input type="text" value={editProduct.image_url} placeholder="URL Gambar" className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditProduct({...editProduct, image_url: e.target.value})} />
              
              <button disabled={isUploading} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-poppins font-semibold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 disabled:bg-blue-300 transition-colors">
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <><Save size={20} /> Update Produk</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH ARTIKEL */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-poppins font-bold text-xl text-slate-800">Tulis Artikel Edukasi</h3>
              <button onClick={() => setIsArticleModalOpen(false)} className="text-slateGray hover:text-slate-800"><X /></button>
            </div>
            <form onSubmit={handleAddArticle} className="space-y-4">
              <input type="text" placeholder="Judul Artikel..." required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewArticle({...newArticle, title: e.target.value})} />
              <div className="flex gap-4">
                <input type="text" placeholder="Kategori" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewArticle({...newArticle, category: e.target.value})} />
                <input type="text" placeholder="Nama Penulis" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewArticle({...newArticle, author: e.target.value})} />
              </div>
              <textarea placeholder="Ringkasan Singkat..." required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none h-20 resize-none" onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})}></textarea>
<div>
  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Isi Artikel</label>
  <div className="border border-softGray rounded-xl overflow-hidden">
    <ReactQuill theme="snow" value={newArticle.content}
      onChange={(val) => setNewArticle({...newArticle, content: val})}
      modules={quillModules} formats={quillFormats} style={{ height: 260 }} />
  </div>
  <div style={{ height: 42 }} />
</div>
              <div className="border-2 border-dashed border-softGray rounded-xl p-4 text-center">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" id="articleImageUpload" />
                <label htmlFor="articleImageUpload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <UploadCloud size={24} className={imageFile ? "text-primary" : "text-slate-400"} />
                  <span className="text-xs text-slateGray font-medium">{imageFile ? imageFile.name : "Upload Gambar Cover"}</span>
                </label>
              </div>
              <input type="text" placeholder="Atau URL Gambar Cover" className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewArticle({...newArticle, image_url: e.target.value})} />
              <button disabled={isUploading} type="submit" className="w-full bg-primary hover:bg-darkPink text-white font-poppins font-semibold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 disabled:bg-softPink transition-colors">
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <><Save size={20} /> Terbitkan Artikel</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT ARTIKEL */}
      {isEditArticleModalOpen && editArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-poppins font-bold text-xl text-slate-800">Edit Artikel</h3>
              <button onClick={() => setIsEditArticleModalOpen(false)} className="text-slateGray hover:text-slate-800"><X /></button>
            </div>
            <form onSubmit={handleUpdateArticle} className="space-y-4">
              <input type="text" value={editArticle.title} required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditArticle({...editArticle, title: e.target.value})} />
              <div className="flex gap-4">
                <input type="text" value={editArticle.category} required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditArticle({...editArticle, category: e.target.value})} />
                <input type="text" value={editArticle.author} required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditArticle({...editArticle, author: e.target.value})} />
              </div>
              <textarea value={editArticle.excerpt} required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none h-20 resize-none" onChange={e => setEditArticle({...editArticle, excerpt: e.target.value})}></textarea>
<div>
  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Isi Artikel</label>
  <div className="border border-softGray rounded-xl overflow-hidden">
    <ReactQuill theme="snow" value={editArticle.content}
      onChange={(val) => setEditArticle({...editArticle, content: val})}
      modules={quillModules} formats={quillFormats} style={{ height: 260 }} />
  </div>
  <div style={{ height: 42 }} />
</div>
              <div className="border-2 border-dashed border-softGray rounded-xl p-4 text-center">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" id="editArticleImageUpload" />
                <label htmlFor="editArticleImageUpload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <UploadCloud size={24} className={imageFile ? "text-primary" : "text-slate-400"} />
                  <span className="text-xs text-slateGray font-medium">{imageFile ? imageFile.name : "Upload gambar baru"}</span>
                </label>
              </div>
              <input type="text" value={editArticle.image_url} placeholder="Atau URL Gambar Cover" className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditArticle({...editArticle, image_url: e.target.value})} />
              <button disabled={isUploading} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-poppins font-semibold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 disabled:bg-blue-300 transition-colors">
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <><Save size={20} /> Update Artikel</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH TIM MEDIS (STAFF) */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-poppins font-bold text-xl text-slate-800">Tambah Tim Medis</h3>
              <button onClick={() => setIsStaffModalOpen(false)} className="text-slateGray hover:text-slate-800"><X /></button>
            </div>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <select className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewStaff({...newStaff, role: e.target.value})}>
                <option value="Dokter">Dokter Spesialis</option><option value="Apoteker">Apoteker</option>
              </select>
              <input type="text" placeholder="Nama Lengkap dengan Gelar" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
              {newStaff.role === 'Dokter' && (<input type="text" placeholder="Jadwal Praktik" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewStaff({...newStaff, schedule: e.target.value})} />)}
              <input type="text" placeholder={newStaff.role === 'Dokter' ? "No. SIP Dokter" : "No. SIPA Apoteker"} required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewStaff({...newStaff, credential: e.target.value})} />
              <div className="border-2 border-dashed border-softGray rounded-xl p-4 text-center">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" id="staffImageUpload" />
                <label htmlFor="staffImageUpload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <UploadCloud size={24} className={imageFile ? "text-primary" : "text-slate-400"} />
                  <span className="text-xs text-slateGray font-medium">{imageFile ? imageFile.name : "Upload Pas Foto"}</span>
                </label>
              </div>
              <input type="text" placeholder="URL Foto" className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewStaff({...newStaff, image_url: e.target.value})} />
              <button disabled={isUploading} type="submit" className="w-full bg-primary hover:bg-darkPink text-white font-poppins font-semibold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 disabled:bg-softPink transition-colors">
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <><Save size={20} /> Simpan Data</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT TIM MEDIS (STAFF) */}
      {isEditStaffModalOpen && editStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-poppins font-bold text-xl text-slate-800">Edit Tim Medis</h3>
              <button onClick={() => setIsEditStaffModalOpen(false)} className="text-slateGray hover:text-slate-800"><X /></button>
            </div>
            <form onSubmit={handleUpdateStaff} className="space-y-4">
              <select value={editStaff.role} className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditStaff({...editStaff, role: e.target.value})}>
                <option value="Dokter">Dokter Spesialis</option><option value="Apoteker">Apoteker</option>
              </select>
              <input type="text" value={editStaff.name} required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditStaff({...editStaff, name: e.target.value})} />
              {editStaff.role === 'Dokter' && (<input type="text" value={editStaff.schedule || ''} placeholder="Jadwal Praktik" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditStaff({...editStaff, schedule: e.target.value})} />)}
              <input type="text" value={editStaff.credential} placeholder="SIP / SIPA" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditStaff({...editStaff, credential: e.target.value})} />
              <div className="border-2 border-dashed border-softGray rounded-xl p-4 text-center">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" id="editStaffImageUpload" />
                <label htmlFor="editStaffImageUpload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <UploadCloud size={24} className={imageFile ? "text-primary" : "text-slate-400"} />
                  <span className="text-xs text-slateGray font-medium">{imageFile ? imageFile.name : "Upload foto baru"}</span>
                </label>
              </div>
              <input type="text" value={editStaff.image_url} placeholder="URL Foto" className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditStaff({...editStaff, image_url: e.target.value})} />
              <button disabled={isUploading} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-poppins font-semibold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 disabled:bg-blue-300 transition-colors">
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <><Save size={20} /> Update Data</>}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;