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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Inventario Pro</h2>
          <p className="text-slate-400">Paginación y stock físico activados</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
        >
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      {/* Filtros Admin */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl mb-8 flex flex-col xl:row gap-6 shadow-xl">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" placeholder="Buscar por nombre..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            value={filters.name}
            onChange={(e) => handleFilterChange({ name: e.target.value })}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <select 
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.category_id}
            onChange={(e) => handleFilterChange({ category_id: e.target.value })}
          >
            <option value="">Categorías</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min" className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-sm outline-none" value={filters.minPrice} onChange={(e) => handleFilterChange({ minPrice: e.target.value })} />
            <input type="number" placeholder="Max" className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-sm outline-none" value={filters.maxPrice} onChange={(e) => handleFilterChange({ maxPrice: e.target.value })} />
          </div>
          <select className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={filters.sort} onChange={(e) => handleFilterChange({ sort: e.target.value })}>
            <option value="">Recientes</option>
            <option value="price_asc">Menor Precio</option>
            <option value="price_desc">Mayor Precio</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /><p className="text-slate-500 font-medium">Sincronizando...</p></div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden group hover:border-slate-500 transition-all flex flex-col shadow-lg">
                <div className="h-48 overflow-hidden relative bg-slate-900/50">
                  <img src={product.image_url || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => handleOpenModal(product)} className="p-2 bg-slate-900/80 text-blue-400 hover:text-white hover:bg-blue-600 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => setConfirmModal({ open: true, id: product.id })} className="p-2 bg-slate-900/80 text-red-400 hover:text-white hover:bg-red-600 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-white truncate mb-2">{product.name}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10 leading-relaxed">{product.description}</p>
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-700/50 text-white font-bold">
                    <span>${product.price.toLocaleString()}</span>
                    <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>Stock: {product.stock}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación Admin */}
          {meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button disabled={filters.page === 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })} className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30"><ChevronLeft size={20} /></button>
              <div className="flex gap-2">
                {[...Array(meta.totalPages)].map((_, i) => (
                  <button key={i + 1} onClick={() => setFilters({ ...filters, page: i + 1 })} className={`w-10 h-10 rounded-xl font-bold transition-all ${filters.page === i + 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>{i + 1}</button>
                ))}
              </div>
              <button disabled={filters.page === meta.totalPages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })} className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30"><ChevronRight size={20} /></button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-3xl py-20 flex flex-col items-center justify-center text-center"><PackageX size={32} className="mb-4 text-slate-600" /><h3 className="text-xl font-bold text-white">Sin productos</h3></div>
      )}

      {/* Modales - Se mantienen igual pero actualizados con tailwind si es necesario */}
      {modalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white"><Package className="text-blue-500" /> {currentProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Zona de Imagen */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold uppercase tracking-wider text-[10px] text-slate-400 mb-2">Imagen del Producto</label>
                  <div className="relative aspect-square bg-slate-900 border-2 border-dashed border-slate-700 rounded-3xl overflow-hidden flex flex-col items-center justify-center group hover:border-blue-500/50 transition-all cursor-pointer">
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-4 transition-all group-hover:scale-105 group-hover:opacity-40" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Upload className="text-blue-400 mb-2" size={32} />
                          <span className="text-[10px] font-black uppercase text-blue-400">Cambiar Imagen</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-slate-500 group-hover:text-blue-400">
                        <ImageIcon size={48} className="mb-2" />
                        <span className="text-xs font-bold uppercase">Click para subir</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={onFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-[10px] text-slate-400 mb-2">Nombre</label>
                    <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold uppercase tracking-wider text-[10px] text-slate-400 mb-2">Precio</label><input required type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} /></div>
                    <div><label className="block text-sm font-bold uppercase tracking-wider text-[10px] text-slate-400 mb-2">Stock</label><input required type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-[10px] text-slate-400 mb-2">Categoría</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-sm font-bold uppercase tracking-wider text-[10px] text-slate-400 mb-2">Descripción</label><textarea rows="3" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-6 py-3 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 font-semibold">Cancelar</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transform active:scale-95 transition-all">{currentProduct ? 'Guardar Cambios' : 'Crear Producto'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCropping && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-slate-950">
          <div className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8"><h3 className="text-xl font-bold text-white">Recortar Imagen</h3><div className="flex gap-4"><button onClick={() => setIsCropping(false)} className="px-6 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-bold">Cancelar</button><button onClick={handleSaveCrop} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">Confirmar</button></div></div>
          <div className="flex-1 relative bg-slate-900"><Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1 / 1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} /></div>
          <div className="h-24 bg-slate-900 border-t border-slate-800 flex items-center justify-center px-8"><div className="w-full max-w-xs space-y-2"><p className="text-[10px] font-black uppercase text-slate-500 text-center tracking-widest">Zoom</p><input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full accent-blue-500" /></div></div>
        </div>
      )}

      <ConfirmationModal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false, id: null })} onConfirm={handleConfirmDelete} title="¿Eliminar producto?" message="Esta acción quitará el producto del inventario de forma permanente." confirmText="Sí, eliminar" variant="danger" />
    </Layout>
  );
};

export default AdminProducts;
