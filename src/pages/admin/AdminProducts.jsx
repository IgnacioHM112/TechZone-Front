import { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import ConfirmationModal from '../../components/ConfirmationModal';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { getCroppedImg } from '../../utils/cropImage';
import Cropper from 'react-easy-crop';
import { Plus, Edit2, Trash2, Package, Loader2, X, Search, Filter, SlidersHorizontal, PackageX, Upload, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ totalPages: 1, currentPage: 1 });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });
  
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [currentProduct, setCurrentProduct] = useState(null);
  const [filters, setFilters] = useState({ name: '', category_id: '', minPrice: '', maxPrice: '', sort: '', page: 1, limit: 12 });

  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category_id: '' });

  useEffect(() => {
    fetchCats();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 500);
    return () => clearTimeout(timer);
  }, [filters.name]);

  useEffect(() => {
    fetchData();
  }, [filters.category_id, filters.minPrice, filters.maxPrice, filters.sort, filters.page]);

  const fetchCats = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const activeParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const res = await getProducts(activeParams);
      if (res.data.data) {
        setProducts(res.data.data);
        setMeta(res.data.meta);
      } else {
        setProducts(res.data);
        setMeta({ totalPages: 1, currentPage: 1 });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category_id: product.category_id
      });
      setPreviewUrl(product.image_url);
    } else {
      setCurrentProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: categories[0]?.id || ''
      });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setImageSrc(null);
    setModalOpen(true);
  };

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result);
        setIsCropping(true);
      };
    }
  };

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setSelectedFile(croppedImage);
      setPreviewUrl(URL.createObjectURL(croppedImage));
      setIsCropping(false);
      toast.success('Imagen lista para subir');
    } catch (e) {
      console.error(e);
      toast.error('Error al procesar el recorte');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('category_id', formData.category_id);
    if (selectedFile) data.append('image', selectedFile, 'product.jpg');

    try {
      if (currentProduct) {
        await updateProduct(currentProduct.id, data);
        toast.success('Producto actualizado');
      } else {
        await createProduct(data);
        toast.success('Producto creado');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Error al guardar el producto');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(confirmModal.id);
      setConfirmModal({ open: false, id: null });
      fetchData();
      toast.success('Producto eliminado');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <Layout title="Gestión de Productos">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-lg md:text-2xl font-bold tracking-tight text-slate-100">Inventario Pro</h2>
          <p className="text-slate-400 text-xs md:text-sm font-medium">Paginación y stock físico activados</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-brand w-full md:w-auto px-5 md:px-6 py-2.5 md:py-3 flex items-center justify-center gap-2 text-xs md:text-sm"
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {/* Filtros Admin */}
      <div className="card-white p-3 md:p-6 mb-6 md:mb-8 flex flex-col xl:flex-row gap-3 md:gap-6">
        <div className="flex-1 relative group w-full">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text"
            className="input-brand pl-8 md:pl-14 py-2.5 md:py-3.5 text-xs md:text-sm rounded-lg md:rounded-xl"
            value={filters.name}
            onChange={(e) => handleFilterChange({ name: e.target.value })}
            placeholder="Buscar por nombre..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <select 
            className="flex-1 sm:flex-initial bg-white border border-slate-200 rounded-lg md:rounded-xl px-2 md:px-3 py-2 text-xs md:text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-950 cursor-pointer"
            value={filters.category_id}
            onChange={(e) => handleFilterChange({ category_id: e.target.value })}
          >
            <option value="">Todas las Categorías</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
            <input type="number" placeholder="Min" className="flex-1 sm:w-20 bg-white border border-slate-200 rounded-lg md:rounded-xl px-1.5 md:px-2 py-2 text-xs md:text-sm text-slate-950 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" value={filters.minPrice} onChange={(e) => handleFilterChange({ minPrice: e.target.value })} />
            <span className="text-slate-500 font-bold text-xs md:text-sm">-</span>
            <input type="number" placeholder="Max" className="flex-1 sm:w-20 bg-white border border-slate-200 rounded-lg md:rounded-xl px-1.5 md:px-2 py-2 text-xs md:text-sm text-slate-950 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" value={filters.maxPrice} onChange={(e) => handleFilterChange({ maxPrice: e.target.value })} />
          </div>
          <select className="flex-1 sm:flex-initial bg-white border border-slate-200 rounded-lg md:rounded-xl px-2 md:px-3 py-2 text-xs md:text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-950 cursor-pointer" value={filters.sort} onChange={(e) => handleFilterChange({ sort: e.target.value })}>
            <option value="">Más Recientes</option>
            <option value="price_asc">Menor Precio</option>
            <option value="price_desc">Mayor Precio</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4"><Loader2 className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-spin" /><p className="text-slate-500 font-medium text-xs md:text-sm">Sincronizando catálogo...</p></div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="card-white overflow-hidden group flex flex-col">
                <div className="h-48 overflow-hidden relative bg-slate-50 border-b border-slate-100">
                  <img src={product.image_url || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button onClick={() => handleOpenModal(product)} className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg shadow-sm transition-all border border-slate-100"><Edit2 size={16} /></button>
                    <button onClick={() => setConfirmModal({ open: true, id: product.id })} className="p-2 bg-white/90 backdrop-blur-sm text-red-500 hover:bg-red-500 hover:text-white rounded-lg shadow-sm transition-all border border-slate-100"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="p-4 md:p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-sm md:text-lg text-slate-100 truncate mb-1 md:mb-2">{product.name}</h3>
                  <p className="text-slate-300 text-xs md:text-sm line-clamp-2 mb-3 md:mb-4 h-8 md:h-10 leading-relaxed">{product.description}</p>
                  <div className="mt-auto flex justify-between items-center pt-3 md:pt-4 border-t border-slate-100 text-slate-100 font-bold">
                    <span className="text-blue-300 text-sm md:text-base">${product.price.toLocaleString()}</span>
                    <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>Stock: {product.stock}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación Admin */}
          {meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2 sm:gap-4 w-full">
              <button disabled={filters.page === 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })} className="p-2 sm:p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"><ChevronLeft size={18} /></button>
              <div className="flex gap-1.5 max-w-[180px] sm:max-w-none overflow-x-auto py-1 scrollbar-none">
                {[...Array(meta.totalPages)].map((_, i) => (
                  <button key={i + 1} onClick={() => setFilters({ ...filters, page: i + 1 })} className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm rounded-xl font-bold flex-shrink-0 transition-all cursor-pointer ${filters.page === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>{i + 1}</button>
                ))}
              </div>
              <button disabled={filters.page === meta.totalPages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })} className="p-2 sm:p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"><ChevronRight size={18} /></button>
            </div>
          )}
        </>
      ) : (
        <div className="card-white border-dashed border-2 py-16 md:py-20 flex flex-col items-center justify-center text-center"><PackageX size={32} className="mb-3 md:mb-4 text-slate-300" /><h3 className="text-lg md:text-xl font-bold text-slate-400">No se encontraron productos</h3><p className="text-slate-500 mt-1 md:mt-2 text-xs md:text-sm">Intenta ajustar los filtros de búsqueda</p></div>
      )}

      {/* Modales */}
      {modalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 text-slate-800"><Package className="w-5 h-5 md:w-6 md:h-6 text-blue-600" /> {currentProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {/* Zona de Imagen */}
                <div className="space-y-2 md:space-y-4">
                  <label className="block text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1 md:mb-2">Imagen del Producto</label>
                  <div className="relative aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl md:rounded-3xl overflow-hidden flex flex-col items-center justify-center group hover:border-blue-500/50 transition-all cursor-pointer">
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-all group-hover:scale-105 group-hover:opacity-40" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Upload className="text-blue-600 mb-2" size={32} />
                          <span className="text-[10px] font-black uppercase text-blue-600">Cambiar Imagen</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-500 transition-colors">
                        <ImageIcon size={48} className="mb-2" />
                        <span className="text-xs font-bold uppercase">Click para subir</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={onFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1 md:mb-2">Nombre</label>
                    <input required type="text" className="input-brand py-1.5 md:py-2.5 text-xs md:text-sm rounded-lg md:rounded-xl" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div><label className="block text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1 md:mb-2">Precio</label><input required type="number" className="input-brand py-1.5 md:py-2.5 text-xs md:text-sm rounded-lg md:rounded-xl" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} /></div>
                    <div><label className="block text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1 md:mb-2">Stock</label><input required type="number" className="input-brand py-1.5 md:py-2.5 text-xs md:text-sm rounded-lg md:rounded-xl" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} /></div>
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1 md:mb-2">Categoría</label>
                    <select className="input-brand py-1.5 md:py-2.5 text-xs md:text-sm rounded-lg md:rounded-xl appearance-none" value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1 md:mb-2">Descripción</label><textarea rows="3" className="input-brand py-1.5 md:py-2.5 resize-none text-xs md:text-sm rounded-lg md:rounded-xl" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
                </div>
              </div>
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button type="button" onClick={() => setModalOpen(false)} className="w-full sm:flex-1 px-5 md:px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition-all cursor-pointer text-sm">Cancelar</button>
                <button type="submit" className="w-full sm:flex-1 btn-brand px-5 md:px-6 py-3 cursor-pointer text-sm">{currentProduct ? 'Guardar Cambios' : 'Crear Producto'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCropping && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-slate-900">
          <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8"><h3 className="text-xl font-bold text-slate-800">Recortar Imagen</h3><div className="flex gap-4"><button onClick={() => setIsCropping(false)} className="px-6 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-all">Cancelar</button><button onClick={handleSaveCrop} className="px-6 py-2 btn-brand">Confirmar</button></div></div>
          <div className="flex-1 relative bg-slate-100"><Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1 / 1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} /></div>
          <div className="h-24 bg-white border-t border-slate-200 flex items-center justify-center px-8"><div className="w-full max-w-xs space-y-2"><p className="text-[10px] font-black uppercase text-slate-400 text-center tracking-widest">Zoom</p><input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full accent-blue-600" /></div></div>
        </div>
      )}

      <ConfirmationModal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false, id: null })} onConfirm={handleConfirmDelete} title="¿Eliminar producto?" message="Esta acción quitará el producto del inventario de forma permanente." confirmText="Sí, eliminar" variant="danger" />
    </Layout>
  );
};

export default AdminProducts;
