import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import ConfirmationModal from '../../components/ConfirmationModal';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import { Plus, Edit2, Trash2, Tags, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ totalPages: 1, currentPage: 1 });
  
  // Modales
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });
  
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCategories({ page, limit: 12 });
      if (res.data.data) {
        setCategories(res.data.data);
        setMeta(res.data.meta);
      } else {
        setCategories(res.data);
        setMeta({ totalPages: 1, currentPage: 1 });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setCurrentCategory(category);
      setFormData({ name: category.name, description: category.description || '' });
    } else {
      setCurrentCategory(null);
      setFormData({ name: '', description: '' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCategory) {
        await updateCategory(currentCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Error al guardar la categoría');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCategory(confirmModal.id);
      setConfirmModal({ open: false, id: null });
      fetchData();
    } catch (error) {
      alert('No se puede eliminar la categoría porque tiene productos asociados.');
      setConfirmModal({ open: false, id: null });
    }
  };

  return (
    <Layout title="Gestión de Categorías">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Categorías</h2>
          <p className="text-slate-400">Organiza tus productos por grupos</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg"
        >
          <Plus size={20} /> Nueva Categoría
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>
      ) : categories.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-slate-800 border border-slate-700 p-6 rounded-2xl group hover:border-blue-500/50 transition-all shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center"><Tags size={24} /></div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(cat)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                    <button onClick={() => setConfirmModal({ open: true, id: cat.id })} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{cat.description || 'Sin descripción'}</p>
              </div>
            ))}
          </div>

          {meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30"><ChevronLeft size={20} /></button>
              <div className="flex gap-2">
                {[...Array(meta.totalPages)].map((_, i) => (
                  <button key={i + 1} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold transition-all ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>{i + 1}</button>
                ))}
              </div>
              <button disabled={page === meta.totalPages} onClick={() => setPage(page + 1)} className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30"><ChevronRight size={20} /></button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-3xl py-20 flex flex-col items-center justify-center text-center"><Tags size={32} className="mb-4 text-slate-600" /><h3 className="text-xl font-bold text-white">Sin categorías</h3></div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white"><Tags className="text-blue-500" /> {currentCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-[10px] text-slate-400 mb-2">Nombre</label>
                <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-[10px] text-slate-400 mb-2">Descripción</label>
                <textarea className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-6 py-3 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 font-semibold">Cancelar</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transform active:scale-95 transition-all">{currentCategory ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false, id: null })} onConfirm={handleConfirmDelete} title="¿Eliminar categoría?" message="Esta acción borrará la categoría. Asegúrate de que no tenga productos vinculados." confirmText="Sí, eliminar" variant="danger" />
    </Layout>
  );
};

export default AdminCategories;
