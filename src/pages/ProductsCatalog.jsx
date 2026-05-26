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
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-12">
      <SimpleNavbar />
      
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Componentes de PC</h1>
          <p className="text-slate-500 text-lg max-w-2xl font-medium">Seleccioná los mejores componentes para tu próxima configuración.</p>
        </header>

        {/* Categorías Estilo Ejemplo-3 */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
          <button 
            onClick={() => handleFilterChange({ category_id: '' })}
            className={`px-8 py-3 rounded-full text-sm font-black transition-all ${!filters.category_id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => handleFilterChange({ category_id: cat.id })}
              className={`px-8 py-3 rounded-full text-sm font-black transition-all ${filters.category_id === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filtros Horizontales Debajo de Categorías */}
        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm mb-12 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="text" placeholder="Buscar por nombre o modelo..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-14 pr-6 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700"
              value={filters.name}
              onChange={(e) => handleFilterChange({ name: e.target.value })}
            />
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <select 
              className="flex-1 md:w-48 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all cursor-pointer appearance-none"
              value={filters.sort}
              onChange={(e) => handleFilterChange({ sort: e.target.value })}
            >
              <option value="">Más Recientes</option>
              <option value="price_asc">Menor Precio</option>
              <option value="price_desc">Mayor Precio</option>
            </select>

            <div className="flex items-center gap-2">
              <input 
                type="number" placeholder="Min $"
                className="w-24 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange({ minPrice: e.target.value })}
              />
              <span className="text-slate-300 font-bold">-</span>
              <input 
                type="number" placeholder="Max $"
                className="w-24 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
              />
            </div>
          </div>
        </div>

        <section>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <p className="text-slate-500 font-bold tracking-tight animate-pulse text-lg">Cargando componentes...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => {
                  const isOutOfStock = product.stock === 0;
                  return (
                    <div key={product.id} className={`bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden group hover:border-blue-300 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 shadow-sm flex flex-col ${isOutOfStock ? 'opacity-70' : ''}`}>
                      <div className="h-64 relative overflow-hidden bg-slate-50/50 p-6 flex items-center justify-center">
                        <img src={product.image_url || 'https://via.placeholder.com/400'} alt={product.name} className={`w-full h-full object-contain transition-transform duration-700 ${!isOutOfStock ? 'group-hover:scale-110' : 'grayscale'}`} />
                        {isOutOfStock && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center"><span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-lg">Sin stock</span></div>}
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{product.category?.name || 'Hardware'}</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-amber-400 text-xs">★</span>
                            ))}
                          </div>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors min-h-[3rem]">{product.name}</h3>
                        <p className="text-slate-500 text-xs line-clamp-2 mb-6 font-medium leading-relaxed">
                          ⚡ {product.description} 🚀
                        </p>
                        <div className="flex items-center gap-3 mb-8">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${isOutOfStock ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                            {isOutOfStock ? '⚠️ Agotado' : '✓ En stock'}
                          </span>
                        </div>
                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Precio</span>
                            <span className="text-2xl font-black text-slate-900">${product.price.toLocaleString()}</span>
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
                <div className="mt-20 flex items-center justify-center gap-6">
                  <button 
                    disabled={filters.page === 1}
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  
                  <div className="flex gap-3">
                    {[...Array(meta.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setFilters({ ...filters, page: i + 1 })}
                        className={`w-14 h-14 rounded-2xl font-black text-lg transition-all ${
                          filters.page === i + 1 
                          ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' 
                          : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    disabled={filters.page === meta.totalPages}
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm mt-10">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 text-slate-300 shadow-inner">
                <PackageX size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">No hay resultados</h3>
              <p className="text-slate-500 font-medium max-w-sm">No encontramos productos que coincidan con tu búsqueda actual.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductsCatalog;
