import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, ChevronDown, LayoutDashboard, Menu, X, Package, Home } from 'lucide-react';

const SimpleNavbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/95 backdrop-blur-md shadow-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 group transition-all">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <span className="font-bold text-lg md:text-xl text-white">T</span>
          </div>
          <span className="text-xl md:text-2xl font-extrabold tracking-tight text-white">TechZone</span>
        </Link>

        {/* Desktop: Acciones */}
        <div className="hidden md:flex items-center gap-6">
          {/* Carrito */}
          <Link 
            to="/cart" 
            className="relative p-2 text-slate-100 hover:text-blue-400 transition-colors group"
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg border-2 border-slate-950 group-hover:scale-110 transition-transform">
                {totalItems}
              </span>
            )}
          </Link>

          {user && (
            <>
              {/* Barra separadora */}
              <div className="h-6 w-px bg-slate-800"></div>

              {/* Botón de Panel de Control */}
              <Link 
                to={isAdmin ? "/admin/products" : "/home"}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-500/5"
              >
                <LayoutDashboard size={16} />
                <span>Mi Actividad</span>
              </Link>
            </>
          )}

          {/* Usuario / Auth */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 pl-4 border-l border-slate-800 group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {user.role && typeof user.role === 'object' ? user.role.name : (user.role || 'Usuario')}
                  </p>
                </div>
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 group-hover:border-blue-500 transition-all">
                  <User size={20} className="text-slate-400 group-hover:text-blue-400" />
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menú Desplegable */}
              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-slate-800 mb-2">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Sesión iniciada como</p>
                      <p className="text-sm font-bold text-slate-100 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={18} />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-100 hover:text-blue-400 text-sm font-bold transition-colors uppercase tracking-widest">INGRESAR</Link>
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest"
              >
                REGISTRARSE
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: Hamburguesa + Carrito */}
        <div className="flex md:hidden items-center gap-2">
          {/* Carrito */}
          <Link 
            to="/cart" 
            className="relative p-2 text-slate-100 hover:text-blue-400 transition-colors"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full shadow-lg border-2 border-slate-950">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Hamburguesa */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-100 hover:text-blue-400 transition-colors"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-2xl z-50 md:hidden animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="px-4 py-6 space-y-1">
              {/* Catálogo */}
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-colors ${
                  location.pathname === '/products' ? 'bg-blue-600/10 text-blue-400' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Package size={20} />
                Catálogo
              </Link>

              {/* Inicio / Dashboard */}
              {user ? (
                <Link
                  to={isAdmin ? '/admin/products' : '/home'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-colors ${
                    location.pathname.startsWith('/admin') || location.pathname === '/home' ? 'bg-blue-600/10 text-blue-400' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard size={20} />
                  Mi Actividad
                </Link>
              ) : (
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-colors ${
                    location.pathname === '/' ? 'bg-blue-600/10 text-blue-400' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Home size={20} />
                  Inicio
                </Link>
              )}

              {user && (
                <>
                  <div className="h-px bg-slate-800 my-3"></div>
                  
                  {/* Info del usuario */}
                  <div className="px-4 py-3">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{user.name}</p>
                    <p className="text-xs text-slate-600 truncate">{user.email}</p>
                  </div>

                  {/* Cerrar Sesión */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={20} />
                    Cerrar Sesión
                  </button>
                </>
              )}

              {!user && (
                <>
                  <div className="h-px bg-slate-800 my-3"></div>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-100 bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    INGRESAR
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-blue-400 border border-blue-500/20 hover:bg-blue-600/10 transition-colors mt-2"
                  >
                    REGISTRARSE
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};


export default SimpleNavbar;
