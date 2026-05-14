import { useState, useEffect } from 'react';
import { Package, ClipboardList, PenTool, Plus, LogOut, X, Save, UploadCloud, Loader2, Trash2, Edit, Users } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('produk');
  const [products, setProducts] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [articles, setArticles] = useState([]);
  const [staffList, setStaffList] = useState([]); 
  
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false); 
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditArticleModalOpen, setIsEditArticleModalOpen] = useState(false);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false); 
  
  const [isUploading, setIsUploading] = useState(false);
  
  // State Data Baru
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Skincare', price: '', size: '', badge: '', description: '', image_url: '' });
  const [newArticle, setNewArticle] = useState({ title: '', excerpt: '', content: '', author: 'Tim Sesa', category: 'Edukasi', image_url: '' });
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Dokter', schedule: '', credential: '', image_url: '' });
  
  const [editProduct, setEditProduct] = useState(null);
  const [editArticle, setEditArticle] = useState(null);
  const [editStaff, setEditStaff] = useState(null);

  const [imageFile, setImageFile] = useState(null);

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
  }, []);

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
          name: newProduct.name, 
          category: newProduct.category, 
          price: parseInt(newProduct.price), 
          size: newProduct.size,
          badge: newProduct.badge,
          description: newProduct.description,
          image_url: finalImageUrl 
        }
      ]);
      if (error) throw new Error(`Gagal simpan ke database: ${error.message}`);
      
      setIsModalOpen(false);
      setNewProduct({ name: '', category: 'Skincare', price: '', size: '', badge: '', description: '', image_url: '' });
      setImageFile(null);
      fetchAdminData();
      alert('Produk berhasil ditambahkan!');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const openEditProductModal = (product) => {
    setEditProduct(product);
    setImageFile(null);
    setIsEditModalOpen(true);
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
        if (uploadError) throw new Error(`Gagal upload gambar: ${uploadError.message}`);
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const { error } = await supabase.from('products').update({
        name: editProduct.name, 
        category: editProduct.category, 
        price: parseInt(editProduct.price), 
        size: editProduct.size,
        badge: editProduct.badge,
        description: editProduct.description,
        image_url: finalImageUrl
      }).eq('id', editProduct.id);

      if (error) throw new Error(`Gagal update ke database: ${error.message}`);
      
      setIsEditModalOpen(false);
      setEditProduct(null);
      setImageFile(null);
      fetchAdminData();
      alert('Produk berhasil diperbarui!');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw new Error(error.message);
      fetchAdminData();
      alert('Produk berhasil dihapus!');
    } catch (error) {
      alert(`Gagal menghapus produk: ${error.message}`);
    }
  };

  // ===================== FUNGSI ARTIKEL =====================
  const handleAddArticle = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImageUrl = newArticle.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `article_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
        if (uploadError) throw new Error(`Gagal upload gambar: ${uploadError.message}`);
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const { error } = await supabase.from('articles').insert([
        { 
          title: newArticle.title, excerpt: newArticle.excerpt, content: newArticle.content,
          author: newArticle.author, category: newArticle.category, image_url: finalImageUrl 
        }
      ]);
      if (error) throw new Error(`Gagal simpan ke database: ${error.message}`);
      
      setIsArticleModalOpen(false);
      setNewArticle({ title: '', excerpt: '', content: '', author: 'Tim Sesa', category: 'Edukasi', image_url: '' });
      setImageFile(null);
      fetchAdminData();
      alert('Artikel berhasil diterbitkan!');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const openEditArticleModal = (article) => {
    setEditArticle(article);
    setImageFile(null);
    setIsEditArticleModalOpen(true);
  };

  const handleUpdateArticle = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImageUrl = editArticle.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `article_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
        if (uploadError) throw new Error(`Gagal upload gambar: ${uploadError.message}`);
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const { error } = await supabase.from('articles').update({
        title: editArticle.title, 
        excerpt: editArticle.excerpt, 
        content: editArticle.content,
        author: editArticle.author, 
        category: editArticle.category, 
        image_url: finalImageUrl
      }).eq('id', editArticle.id);

      if (error) throw new Error(`Gagal update ke database: ${error.message}`);
      
      setIsEditArticleModalOpen(false);
      setEditArticle(null);
      setImageFile(null);
      fetchAdminData();
      alert('Artikel berhasil diperbarui!');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw new Error(error.message);
      fetchAdminData();
      alert('Artikel berhasil dihapus!');
    } catch (error) {
      alert(`Gagal menghapus artikel: ${error.message}`);
    }
  };

  // ===================== FUNGSI TIM MEDIS (STAFF) =====================
  const handleAddStaff = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImageUrl = newStaff.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `staff_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
        if (uploadError) throw new Error(`Gagal upload gambar: ${uploadError.message}`);
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const { error } = await supabase.from('staff').insert([
        { 
          name: newStaff.name, 
          role: newStaff.role, 
          schedule: newStaff.schedule,
          credential: newStaff.credential, 
          image_url: finalImageUrl 
        }
      ]);
      if (error) throw new Error(`Gagal simpan ke database: ${error.message}`);
      
      setIsStaffModalOpen(false);
      setNewStaff({ name: '', role: 'Dokter', schedule: '', credential: '', image_url: '' });
      setImageFile(null);
      fetchAdminData();
      alert('Tim medis berhasil ditambahkan!');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const openEditStaffModal = (staff) => {
    setEditStaff(staff);
    setImageFile(null);
    setIsEditStaffModalOpen(true);
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalImageUrl = editStaff.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `staff_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
        if (uploadError) throw new Error(`Gagal upload gambar: ${uploadError.message}`);
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const { error } = await supabase.from('staff').update({
        name: editStaff.name, 
        role: editStaff.role, 
        schedule: editStaff.schedule,
        credential: editStaff.credential, 
        image_url: finalImageUrl
      }).eq('id', editStaff.id);

      if (error) throw new Error(`Gagal update ke database: ${error.message}`);
      
      setIsEditStaffModalOpen(false);
      setEditStaff(null);
      setImageFile(null);
      fetchAdminData();
      alert('Data tim medis berhasil diperbarui!');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data tim medis ini?')) return;
    try {
      const { error } = await supabase.from('staff').delete().eq('id', id);
      if (error) throw new Error(error.message);
      fetchAdminData();
      alert('Data berhasil dihapus!');
    } catch (error) {
      alert(`Gagal menghapus data: ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-inter">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-softGray flex flex-col">
        {/* BAGIAN LOGO DIPERBARUI DI SINI */}
        <div className="p-6 border-b border-softGray flex items-center gap-3">
          <img 
              src="/images/Sesa.jpeg"
              alt="SESA Dermatology"
            className="w-9 h-9 object-contain rounded-full shadow-sm"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h2 className="font-poppins font-bold text-xl text-deepMagenta tracking-tight">SESA Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('produk')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'produk' ? 'bg-roseTint text-darkPink font-semibold' : 'text-slateGray hover:bg-softGray'}`}>
            <Package size={20} /> Kelola Produk
          </button>
          <button onClick={() => setActiveTab('resep')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'resep' ? 'bg-roseTint text-darkPink font-semibold' : 'text-slateGray hover:bg-softGray'}`}>
            <ClipboardList size={20} /> Data Pasien
          </button>
          <button onClick={() => setActiveTab('artikel')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'artikel' ? 'bg-roseTint text-darkPink font-semibold' : 'text-slateGray hover:bg-softGray'}`}>
            <PenTool size={20} /> Blog & Artikel
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
        
        {/* TAB PRODUK */}
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

        {/* TAB RESEP */}
        {activeTab === 'resep' && (
           <div>
             <h1 className="font-poppins font-bold text-2xl text-slate-800 mb-8">Submission Pasien</h1>
             <div className="bg-white rounded-3xl border border-softGray shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                 <thead className="bg-[#FAFAFA] border-b border-softGray">
                   <tr>
                     <th className="px-6 py-4">Nama</th>
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

        {/* TAB ARTIKEL */}
        {activeTab === 'artikel' && (
           <div>
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
           <div>
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
                <option value="Skincare">Skincare</option>
                <option value="Obat">Obat</option>
                <option value="Vitamin">Vitamin</option>
                <option value="Serum">Serum</option>
                <option value="Moisturizer">Moisturizer</option>
                <option value="Treatment">Treatment</option>
                <option value="Sunscreen">Sunscreen</option>
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
                  <span className="text-xs text-slateGray font-medium">
                    {imageFile ? imageFile.name : "Klik untuk upload foto produk"}
                  </span>
                </label>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-softGray"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">Atau URL</span>
                <div className="flex-grow border-t border-softGray"></div>
              </div>

              <input type="text" placeholder="URL Gambar (Opsional jika sudah upload)" className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} />
              
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
                <option value="Skincare">Skincare</option>
                <option value="Obat">Obat</option>
                <option value="Vitamin">Vitamin</option>
                <option value="Serum">Serum</option>
                <option value="Moisturizer">Moisturizer</option>
                <option value="Treatment">Treatment</option>
                <option value="Sunscreen">Sunscreen</option>
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
                  <span className="text-xs text-slateGray font-medium">
                    {imageFile ? imageFile.name : "Upload foto baru (Kosongkan jika tak diubah)"}
                  </span>
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
                <input type="text" placeholder="Kategori (Misal: Skincare 101)" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewArticle({...newArticle, category: e.target.value})} />
                <input type="text" placeholder="Nama Penulis" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewArticle({...newArticle, author: e.target.value})} />
              </div>
              <textarea placeholder="Ringkasan Singkat (Muncul di card luar, maks 2 kalimat)..." required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none h-20 resize-none" onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})}></textarea>
              <textarea placeholder="Isi Artikel Lengkap (Gunakan tag HTML seperti <p>, <h3>, <br> jika ingin paragraf rapi)..." required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none h-40" onChange={e => setNewArticle({...newArticle, content: e.target.value})}></textarea>
              <div className="border-2 border-dashed border-softGray rounded-xl p-4 text-center">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" id="articleImageUpload" />
                <label htmlFor="articleImageUpload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <UploadCloud size={24} className={imageFile ? "text-primary" : "text-slate-400"} />
                  <span className="text-xs text-slateGray font-medium">{imageFile ? imageFile.name : "Upload Gambar Cover Artikel"}</span>
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
              <textarea value={editArticle.content} required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none h-40" onChange={e => setEditArticle({...editArticle, content: e.target.value})}></textarea>
              <div className="border-2 border-dashed border-softGray rounded-xl p-4 text-center">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" id="editArticleImageUpload" />
                <label htmlFor="editArticleImageUpload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <UploadCloud size={24} className={imageFile ? "text-primary" : "text-slate-400"} />
                  <span className="text-xs text-slateGray font-medium">{imageFile ? imageFile.name : "Upload gambar baru (Kosongkan jika tak diubah)"}</span>
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
                <option value="Dokter">Dokter Spesialis</option>
                <option value="Apoteker">Apoteker</option>
              </select>

              <input type="text" placeholder="Nama Lengkap dengan Gelar" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
              
              {newStaff.role === 'Dokter' && (
                <input type="text" placeholder="Jadwal Praktik (Misal: Sen-Jum 16.00-20.00)" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewStaff({...newStaff, schedule: e.target.value})} />
              )}
              
              <input type="text" placeholder={newStaff.role === 'Dokter' ? "No. SIP Dokter" : "No. SIPA Apoteker"} required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setNewStaff({...newStaff, credential: e.target.value})} />
              
              <div className="border-2 border-dashed border-softGray rounded-xl p-4 text-center">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" id="staffImageUpload" />
                <label htmlFor="staffImageUpload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <UploadCloud size={24} className={imageFile ? "text-primary" : "text-slate-400"} />
                  <span className="text-xs text-slateGray font-medium">
                    {imageFile ? imageFile.name : "Upload Pas Foto"}
                  </span>
                </label>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-softGray"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">Atau URL</span>
                <div className="flex-grow border-t border-softGray"></div>
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
                <option value="Dokter">Dokter Spesialis</option>
                <option value="Apoteker">Apoteker</option>
              </select>

              <input type="text" value={editStaff.name} required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditStaff({...editStaff, name: e.target.value})} />
              
              {editStaff.role === 'Dokter' && (
                <input type="text" value={editStaff.schedule || ''} placeholder="Jadwal Praktik" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditStaff({...editStaff, schedule: e.target.value})} />
              )}
              
              <input type="text" value={editStaff.credential} placeholder="SIP / SIPA" required className="w-full border border-softGray rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" onChange={e => setEditStaff({...editStaff, credential: e.target.value})} />
              
              <div className="border-2 border-dashed border-softGray rounded-xl p-4 text-center">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" id="editStaffImageUpload" />
                <label htmlFor="editStaffImageUpload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <UploadCloud size={24} className={imageFile ? "text-primary" : "text-slate-400"} />
                  <span className="text-xs text-slateGray font-medium">
                    {imageFile ? imageFile.name : "Upload foto baru (Kosongkan jika tak diubah)"}
                  </span>
                </label>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-softGray"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">Atau URL</span>
                <div className="flex-grow border-t border-softGray"></div>
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