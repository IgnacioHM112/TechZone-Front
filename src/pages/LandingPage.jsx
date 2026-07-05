import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ChevronRight, Mail, ShieldCheck, Truck, Headphones, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-100">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950 shadow-sm border-b border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group transition-all">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <span className="font-bold text-lg text-white">T</span>
            </div>
            <span className="text-xl font-black tracking-tight text-white">TechZone</span>
          </Link>
          
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-4 text-xs font-black uppercase tracking-widest">
              <a href="#contact" className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 transition-colors">Contacto</a>
            </div>
            {user ? (
              <Link 
                to={isAdmin ? "/admin/products" : "/home"} 
                className="btn-brand px-6 py-2 text-xs uppercase tracking-widest font-black"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="text-slate-100 hover:text-blue-400 transition-colors font-black text-xs uppercase tracking-widest px-2"
                >
                  INGRESAR
                </Link>
                <Link 
                  to="/register" 
                  className="btn-brand px-6 py-2 text-xs uppercase tracking-widest font-black"
                >
                  REGISTRARSE
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: Hamburguesa */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-100 hover:text-blue-400 transition-colors"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 shadow-2xl animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="px-4 py-6 space-y-1">
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <Mail size={20} />
                Contacto
              </a>
              {user ? (
                <Link
                  to={isAdmin ? '/admin/products' : '/home'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-100 bg-blue-600 hover:bg-blue-700 transition-colors mt-3"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              ) : (
                <>
                  <div className="h-px bg-slate-800 my-3"></div>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3.5 rounded-xl text-sm font-bold text-slate-100 bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    INGRESAR
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3.5 rounded-xl text-sm font-bold text-blue-400 border border-blue-500/20 hover:bg-blue-600/10 transition-colors mt-2"
                  >
                    REGISTRARSE
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Fondo más oscuro integrado */}
      <section className="pt-40 pb-32 px-6 bg-[#0B0F1A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-500/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Zap size={12} className="fill-current" />
              Líderes en Hardware High-End
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 leading-[1.1]">
              Hardware para los que <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">construyen el futuro.</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 font-medium leading-relaxed">
              TechZone es el ecommerce definitivo de hardware. Componentes de alto rendimiento, periféricos premium y la mejor tecnología en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-16 duration-1000">
              <Link to="/products" className="btn-brand px-10 py-4 text-sm uppercase tracking-widest font-black flex items-center justify-center gap-3 group">
                Ver Catálogo
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Promo Video / GPU Render */}
          <div className="flex-1 w-full max-w-md animate-in fade-in slide-in-from-right-12 duration-1000">
            <div className="promo-banner aspect-[9/16] md:aspect-square group relative">
              {/* Video combinado continuo generado externamente */}
              <video
                id="hero-video"
                src="/assets/promo_combined.mp4"
                autoPlay
                muted
                playsInline
                preload="auto"
                loop
                className="promo-video w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Estilo ejemplo-2.png unificado con footer */}
      <section className="py-24 px-6 bg-[#1A222F] border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white/5 backdrop-blur-sm p-12 rounded-[3rem] border border-white/10 text-center hover:bg-white/10 transition-all duration-500 group">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-blue-600/20">
                <Truck size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Envío Gratis</h3>
              <p className="text-slate-400 font-medium text-sm leading-relaxed">En compras superiores a $100.000</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-12 rounded-[3rem] border border-white/10 text-center hover:bg-white/10 transition-all duration-500 group">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-emerald-600/20">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Compra Segura</h3>
              <p className="text-slate-400 font-medium text-sm leading-relaxed">Garantía oficial en todos los productos</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-12 rounded-[3rem] border border-white/10 text-center hover:bg-white/10 transition-all duration-500 group">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-purple-600/20">
                <Headphones size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Asesoría Experta</h3>
              <p className="text-slate-400 font-medium text-sm leading-relaxed">Te ayudamos a elegir lo mejor para vos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Estilo ejemplo-2.png */}
      <footer className="bg-[#1A222F] pt-24 pb-12 px-6 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-20 relative z-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <span className="font-bold text-white">T</span>
                </div>
                <span className="text-2xl font-black tracking-tight">TechZone</span>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed text-sm">
                Tu tienda de confianza para componentes de PC y tecnología de alto nivel.
              </p>
              <div className="flex gap-4">
                {['fb', 'ig', 'tw', 'yt'].map(soc => (
                  <div key={soc} className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all cursor-pointer">
                    <span className="text-[10px] font-black uppercase">{soc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna "Enlaces" eliminada por solicitud */}

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-8">Categorías</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-bold">
                <li><span className="text-slate-400">Procesadores</span></li>
                <li><span className="text-slate-400">Placas de Video</span></li>
                <li><span className="text-slate-400">Memorias RAM</span></li>
                <li><span className="text-slate-400">Almacenamiento</span></li>
              </ul>
            </div>

            <div id="contact">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-8">Contacto</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-bold">
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-blue-500" />
                  <span>Techzone.mza26@gmail.com</span>
                </li>
                <li>📍 Mendoza, Argentina</li>
                <li>🕒 Lun–Vie 9:00–18:00</li>
                <li className="text-blue-400">📞 +54 11 1234-5678</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>© 2026 TechZone - Todos los derechos reservados</span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
            </div>
          </div>
        </div>
        
        {/* Decorativo footer */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </footer>
    </div>
  );
};

export default LandingPage;
