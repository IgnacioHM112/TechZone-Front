import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';

const SimpleNavbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-50 shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group transition-all">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <span className="font-bold text-xl text-white">T</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">TechZone</span>
        </Link>

        {/* Acciones */}
        <div className="flex items-center gap-6">
          {/* Carrito */}
          <Link 
            to="/cart" 
            className="relative p-2 text-slate-100 hover:text-blue-400 transition-colors group"
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Usuario / Auth */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 pl-4 border-l border-slate-200 group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-950 group-hover:text-blue-600 transition-colors">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{typeof user.role === 'object' ? user.role.name : user.role}</p>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 group-hover:border-blue-500 transition-all">
                  <User size={20} className="text-slate-500 group-hover:text-blue-600" />
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menú Desplegable */}
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-slate-100 mb-2">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Sesión iniciada como</p>
                      <p className="text-sm font-bold text-slate-700 truncate">{user.email}</p>
                    </div>
                    
                    <Link 
                      to={isAdmin ? "/admin/products" : "/home"} 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} />
                      Panel de Control
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-all"
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
      </div>
    </nav>
  );
};


export default SimpleNavbar;
