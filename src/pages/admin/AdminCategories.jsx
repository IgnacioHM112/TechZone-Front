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
          <h2 className="text-2xl font-bold text-slate-900">Categorías</h2>
          <p className="text-slate-500">Organiza tus productos por grupos</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-brand px-6 py-3 flex items-center gap-2"
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
              <div key={cat.id} className="card-white p-6 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm"><Tags size={24} /></div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"><Edit2 size={18} /></button>
                    <button onClick={() => setConfirmModal({ open: true, id: cat.id })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"><Trash2 size={18} /></button>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">{cat.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{cat.description || 'Sin descripción disponible'}</p>
              </div>
            ))}
          </div>

          {meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"><ChevronLeft size={20} /></button>
              <div className="flex gap-2">
                {[...Array(meta.totalPages)].map((_, i) => (
                  <button key={i + 1} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold transition-all ${page === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>{i + 1}</button>
                ))}
              </div>
              <button disabled={page === meta.totalPages} onClick={() => setPage(page + 1)} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"><ChevronRight size={20} /></button>
            </div>
          )}
        </>
      ) : (
        <div className="card-white border-dashed border-2 py-20 flex flex-col items-center justify-center text-center"><Tags size={40} className="mb-4 text-slate-300" /><h3 className="text-xl font-bold text-slate-800">Sin categorías</h3><p className="text-slate-500 mt-2">No se encontraron categorías registradas</p></div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800"><Tags className="text-blue-600" /> {currentCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Nombre de Categoría</label>
                <input required type="text" className="input-brand py-3" placeholder="Ej: Procesadores" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Descripción (Opcional)</label>
                <textarea className="input-brand py-3 resize-none" rows="3" placeholder="Describe brevemente esta categoría..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition-all">Cancelar</button>
                <button type="submit" className="flex-1 btn-brand px-6 py-3">{currentCategory ? 'Actualizar' : 'Crear'}</button>
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
