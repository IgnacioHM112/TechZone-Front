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
    <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group transition-all">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <span className="font-bold text-xl text-white">T</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">TechZone</span>
        </Link>

        {/* Acciones */}
        <div className="flex items-center gap-6">
          {/* Carrito */}
          <Link 
            to="/cart" 
            className="relative p-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg border-2 border-slate-900 group-hover:scale-110 transition-transform">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Usuario / Auth */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 pl-4 border-l border-slate-800 group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{typeof user.role === 'object' ? user.role.name : user.role}</p>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-blue-500 transition-all">
                  <User size={20} className="text-slate-400 group-hover:text-blue-400" />
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menú Desplegable */}
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-slate-700 mb-2">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Sesión iniciada como</p>
                      <p className="text-sm font-bold truncate">{user.email}</p>
                    </div>
                    
                    <Link 
                      to={isAdmin ? "/admin/products" : "/home"} 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} />
                      Panel de Control
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all"
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
              <Link to="/login" className="text-slate-400 hover:text-white text-sm font-bold transition-colors">Entrar</Link>
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all"
              >
                Crear cuenta
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavbar;
