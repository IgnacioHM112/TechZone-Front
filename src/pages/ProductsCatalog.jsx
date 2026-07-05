import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { useCart } from '../context/CartContext';
import SimpleNavbar from '../components/SimpleNavbar';
import { Search, SlidersHorizontal, PackageX, Loader2, ShoppingCart, ChevronLeft, ChevronRight, ChevronDown, X, Filter } from 'lucide-react';

const ProductsCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ totalPages: 1, currentPage: 1 });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
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
        setCategories(res.data.data || res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

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
      
      if (res.data.data) {
        setProducts(res.data.data);
        setMeta(res.data.meta);
      } else {
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
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-24 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px]"></div>
      </div>
      <SimpleNavbar />
      
      <div className="max-w-7xl mx-auto px-6 mt-8 relative z-10">
        <header className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">Componentes de PC</h1>
          <p className="text-slate-400 text-sm sm:text-lg max-w-2xl font-medium">Seleccioná los mejores componentes para tu próxima configuración.</p>
        </header>

        {/* Categorías - Slider horizontal en mobile */}
        <div className="flex gap-2 md:gap-3 mb-4 md:mb-8 overflow-x-auto pb-2 md:pb-3 -mx-4 md:-mx-6 px-4 md:px-6 scrollbar-none md:flex-wrap md:overflow-x-visible md:pb-0 md:mx-0 md:px-0 justify-start flex-nowrap md:flex-wrap">
          <button 
            onClick={() => handleFilterChange({ category_id: '' })}
            className={`px-4 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-sm font-black transition-all flex-shrink-0 cursor-pointer ${!filters.category_id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 backdrop-blur-sm border border-white/10 text-slate-400 hover:bg-white/10'}`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => handleFilterChange({ category_id: cat.id })}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-sm font-black transition-all flex-shrink-0 cursor-pointer ${filters.category_id === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 backdrop-blur-sm border border-white/10 text-slate-400 hover:bg-white/10'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Barra de búsqueda siempre visible + botón filtros mobile */}
        <div className="flex items-center gap-3 mb-4 md:mb-8">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input 
              type="text" placeholder="Buscar por nombre o modelo..."
              className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-3.5 pl-12 md:pl-14 pr-4 md:pr-6 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-bold text-white placeholder-slate-500 text-xs md:text-sm"
              value={filters.name}
              onChange={(e) => handleFilterChange({ name: e.target.value })}
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all font-black text-xs uppercase tracking-widest"
          >
            <Filter size={16} />
            Filtros
            <ChevronDown size={14} className={`transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filtros avanzados: colapsable en mobile, siempre visible en desktop */}
        <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block bg-white/5 backdrop-blur-sm border border-white/10 p-3 md:p-6 rounded-2xl md:rounded-[2rem] mb-8 md:mb-12`}>
          <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:flex-1">
              <select 
                className="w-full sm:flex-1 md:w-48 bg-[#1A222F] border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-3.5 text-xs md:text-sm font-bold text-white outline-none focus:border-blue-400 transition-all cursor-pointer"
                value={filters.sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
              >
                <option value="" style={{backgroundColor: '#1A222F'}}>Más Recientes</option>
                <option value="price_asc" style={{backgroundColor: '#1A222F'}}>Menor Precio</option>
                <option value="price_desc" style={{backgroundColor: '#1A222F'}}>Mayor Precio</option>
              </select>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input 
                  type="number" placeholder="Min $"
                  className="flex-1 sm:w-24 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-3 md:px-4 py-3 md:py-3.5 text-xs md:text-sm font-bold text-white placeholder-slate-500 outline-none focus:border-blue-400"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange({ minPrice: e.target.value })}
                />
                <span className="text-slate-500 font-bold text-xs md:text-sm">-</span>
                <input 
                  type="number" placeholder="Max $"
                  className="flex-1 sm:w-24 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-3 md:px-4 py-3 md:py-3.5 text-xs md:text-sm font-bold text-white placeholder-slate-500 outline-none focus:border-blue-400"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
                />
              </div>
            </div>

            {/* Botón cerrar en mobile */}
            <button
              onClick={() => setShowMobileFilters(false)}
              className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
            >
              <X size={14} />
              Aplicar Filtros
            </button>
          </div>
        </div>

        <section>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
              <p className="text-slate-400 font-bold tracking-tight animate-pulse text-lg">Cargando componentes...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => {
                  const isOutOfStock = product.stock === 0;
                  return (
                    <div key={product.id} className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2.5rem] overflow-hidden group hover:bg-white/10 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col ${isOutOfStock ? 'opacity-70' : ''}`}>
                      <div className="h-64 relative overflow-hidden bg-gradient-to-br from-blue-900/20 to-emerald-900/20 flex items-center justify-center">
                        <img src={product.image_url || 'https://via.placeholder.com/400'} alt={product.name} className={`w-full h-full object-cover transition-transform duration-700 ${!isOutOfStock ? 'group-hover:scale-110' : 'grayscale'}`} />
                        {isOutOfStock && <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center"><span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-lg">Sin stock</span></div>}
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">{product.category?.name || 'Hardware'}</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-amber-400 text-xs">★</span>
                            ))}
                          </div>
                        </div>
                        <h3 className="text-lg font-extrabold text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors min-h-[3rem]">{product.name}</h3>
                        <p className="text-slate-400 text-xs line-clamp-2 mb-6 font-medium leading-relaxed">
                          ⚡ {product.description} 🚀
                        </p>
                        <div className="flex items-center gap-3 mb-8">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${isOutOfStock ? 'bg-red-900/30 text-red-400 border-red-400/50' : 'bg-emerald-900/30 text-emerald-400 border-emerald-400/50'}`}>
                            {isOutOfStock ? '⚠️ Agotado' : '✓ En stock'}
                          </span>
                        </div>
                        <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Precio</span>
                            <span className="text-2xl font-black text-white">${product.price.toLocaleString()}</span>
                          </div>
                          <button 
                            disabled={isOutOfStock} 
                            onClick={() => addProduct(product.id, 1)} 
                            className={`w-12 h-12 rounded-2xl transition-all shadow-xl active:scale-90 flex items-center justify-center ${isOutOfStock ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30'}`}
                            title="Añadir al carrito"
                          >
                            <ShoppingCart size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Controles de Paginación */}
              {meta.totalPages > 1 && (
                <div className="mt-16 sm:mt-20 flex items-center justify-center gap-2 sm:gap-6 w-full">
                  <button 
                    disabled={filters.page === 1}
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-slate-400 hover:bg-white/10 hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex gap-1.5 sm:gap-3 max-w-[180px] sm:max-w-none overflow-x-auto py-1 scrollbar-none">
                    {[...Array(meta.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setFilters({ ...filters, page: i + 1 })}
                        className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl font-black text-sm sm:text-lg transition-all flex-shrink-0 flex items-center justify-center cursor-pointer ${
                          filters.page === i + 1 
                          ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                          : 'bg-white/5 backdrop-blur-sm text-slate-400 border border-white/10 hover:bg-white/10 hover:text-slate-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    disabled={filters.page === meta.totalPages}
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-slate-400 hover:bg-white/10 hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white/5 backdrop-blur-sm rounded-[3rem] border border-white/10 mt-10">
              <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 text-slate-500">
                <PackageX size={48} />
              </div>
              <h3 className="text-3xl font-black text-white mb-3 tracking-tight">No hay resultados</h3>
              <p className="text-slate-400 font-medium max-w-sm">No encontramos productos que coincidan con tu búsqueda actual.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductsCatalog;
