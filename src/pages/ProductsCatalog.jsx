import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { useCart } from '../context/CartContext';
import SimpleNavbar from '../components/SimpleNavbar';
import { Search, SlidersHorizontal, PackageX, Loader2, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductsCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ totalPages: 1, currentPage: 1 });
  const { addProduct } = useCart();
  
  const [filters, setFilters] = useState({
    name: '',
    category_id: '',
    minPrice: '',
    maxPrice: '',
    sort: '',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        // El backend de categorias podría aún devolver array o el nuevo formato
        setCategories(res.data.data || res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Al cambiar filtros (excepto página), resetear a página 1
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchFilteredProducts(), 500);
    return () => clearTimeout(timer);
  }, [filters.name]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [filters.category_id, filters.minPrice, filters.maxPrice, filters.sort, filters.page]);

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const activeParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const res = await getProducts(activeParams);
      
      // Manejar nueva estructura del backend con .data y .meta
      if (res.data.data) {
        setProducts(res.data.data);
        setMeta(res.data.meta);
      } else {
        // Fallback para versión anterior si el back aún no actualizó
        setProducts(res.data);
        setMeta({ totalPages: 1, currentPage: 1 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12">
      <SimpleNavbar />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8">
          
          <aside className="w-full md:w-64 space-y-8">
            <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-3xl sticky top-28 shadow-xl">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                <SlidersHorizontal size={18} className="text-blue-500" />
                <h2 className="font-bold text-lg">Filtros</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-2 font-bold uppercase tracking-wider text-[10px]">Categoría</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    value={filters.category_id}
                    onChange={(e) => handleFilterChange({ category_id: e.target.value })}
                  >
                    <option value="">Todas</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-2 font-bold uppercase tracking-wider text-[10px]">Rango de Precio</label>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="number" placeholder="Min $"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm outline-none"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange({ minPrice: e.target.value })}
                    />
                    <input 
                      type="number" placeholder="Max $"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm outline-none"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-2 font-bold uppercase tracking-wider text-[10px]">Ordenar por</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    value={filters.sort}
                    onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  >
                    <option value="">Más Recientes</option>
                    <option value="price_asc">Menor Precio</option>
                    <option value="price_desc">Mayor Precio</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <button 
                    onClick={() => setFilters({ name: '', category_id: '', minPrice: '', maxPrice: '', sort: '', page: 1, limit: 12 })}
                    className="w-full text-slate-400 hover:text-red-400 text-xs font-bold uppercase tracking-wider px-2 transition-colors flex items-center justify-center gap-2"
                  >
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="mb-8 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text" placeholder="Busca procesadores, placas de video..."
                className="w-full bg-slate-800/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg shadow-xl"
                value={filters.name}
                onChange={(e) => handleFilterChange({ name: e.target.value })}
              />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Sincronizando catálogo...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => {
                    const isOutOfStock = product.stock === 0;
                    return (
                      <div key={product.id} className={`bg-slate-800/40 border border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-blue-500/50 transition-all duration-500 shadow-lg flex flex-col ${isOutOfStock ? 'opacity-75' : ''}`}>
                        <div className="h-64 relative overflow-hidden bg-slate-900/50 p-6">
                          <img src={product.image_url || 'https://via.placeholder.com/400'} alt={product.name} className={`w-full h-full object-contain p-4 transition-transform duration-700 ${!isOutOfStock ? 'group-hover:scale-110' : 'grayscale'}`} />
                          {isOutOfStock && <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center"><span className="bg-red-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl rotate-3">Agotado</span></div>}
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">{product.name}</h3>
                          <p className="text-slate-400 text-sm line-clamp-2 mb-8 h-10 leading-relaxed">{product.description}</p>
                          <div className="mt-auto flex items-center justify-between border-t border-slate-700/50 pt-6">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Precio</span>
                              <span className="text-2xl font-black text-white">${product.price.toLocaleString()}</span>
                            </div>
                            <button disabled={isOutOfStock} onClick={() => addProduct(product.id, 1)} className={`p-4 rounded-2xl transition-all shadow-xl active:scale-90 group/btn relative overflow-hidden ${isOutOfStock ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-blue-600 hover:text-white'}`}><ShoppingCart size={22} className="relative z-10" /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Controles de Paginación */}
                {meta.totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-4">
                    <button 
                      disabled={filters.page === 1}
                      onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                      className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <div className="flex gap-2">
                      {[...Array(meta.totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setFilters({ ...filters, page: i + 1 })}
                          className={`w-10 h-10 rounded-xl font-bold transition-all ${
                            filters.page === i + 1 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button 
                      disabled={filters.page === meta.totalPages}
                      onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                      className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center"><div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 text-slate-600"><PackageX size={40} /></div><h3 className="text-2xl font-bold mb-2 text-white">No hay resultados</h3></div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductsCatalog;
