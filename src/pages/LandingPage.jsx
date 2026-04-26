import { Link } from 'react-router-dom';
import { ShoppingCart, Cpu, Monitor, Zap, ChevronRight, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-blue-500/30">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">TechZone</span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
              <a href="#features" className="hover:text-white transition-colors">Características</a>
              <a href="#about" className="hover:text-white transition-colors">Nosotros</a>
            </div>
            {user ? (
              <Link 
                to={isAdmin ? "/admin/products" : "/home"} 
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20"
              >
                Ir al Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="text-slate-300 hover:text-white transition-colors font-medium px-2"
                >
                  Loguearse
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap size={16} />
            E-commerce de Próxima Generación
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Hardware para los que <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">construyen el futuro.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            TechZone es el ecommerce definitivo de hardware. Componentes de alto rendimiento, 
            periféricos premium y la mejor tecnología en un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <Link to="/products" className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group">
              Explorar Tienda
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="bg-slate-800 hover:bg-slate-700 px-10 py-4 rounded-2xl text-lg font-bold border border-slate-700 transition-all">
              Ver más
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-slate-800/50 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition-all group">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Potencia Pura</h3>
              <p className="text-slate-400 leading-relaxed">
                Solo trabajamos con las mejores marcas del mercado: Intel, AMD, NVIDIA y más.
              </p>
            </div>
            <div className="p-10 bg-slate-800/50 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition-all group">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShoppingCart size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Experiencia Fluida</h3>
              <p className="text-slate-400 leading-relaxed">
                Interfaz intuitiva diseñada para que encuentres lo que necesitas en segundos.
              </p>
            </div>
            <div className="p-10 bg-slate-800/50 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition-all group">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Monitor size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Visuales Premium</h3>
              <p className="text-slate-400 leading-relaxed">
                Explora productos con el detalle que merecen. Imágenes en alta resolución.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="py-20 border-t border-slate-800 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
              <span className="font-bold">T</span>
            </div>
            <span className="text-xl font-bold tracking-tight">TechZone</span>
          </div>
          <div className="flex gap-8 text-slate-500 text-sm">
            <span>© 2026 TechZone Inc.</span>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="p-2 text-slate-400 hover:text-white transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
