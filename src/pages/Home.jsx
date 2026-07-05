import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getUserOrders } from '../services/orderService';
import { ShoppingBag, Calendar, Loader2, Package, ChevronRight, CheckCircle2, Clock, XCircle, ShoppingCart, ArrowRight, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const { cartItems, totalPrice } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getUserOrders();
      setOrders(res.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('No se pudieron cargar tus pedidos');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
      case 'success':
        return { 
          label: 'Completado', 
          color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
          icon: <CheckCircle2 size={14} />
        };
      case 'pending':
        return { 
          label: 'Pendiente', 
          color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
          icon: <Clock size={14} />
        };
      case 'cancelled':
      case 'rejected':
        return { 
          label: 'Cancelado', 
          color: 'text-red-400 bg-red-400/10 border-red-400/20',
          icon: <XCircle size={14} />
        };
      default:
        return { 
          label: status, 
          color: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
          icon: <Package size={14} />
        };
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <Layout title="Mi Actividad">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl md:rounded-[2.5rem] p-5 md:p-12 mb-6 md:mb-12 shadow-xl shadow-blue-500/10 relative overflow-hidden">
        <div className="relative z-10 text-white">
          <h2 className="text-xl md:text-4xl font-black mb-2 md:mb-3 tracking-tight">¡Hola, {user?.name || 'Usuario'}! 👋</h2>
          <p className="text-blue-50 text-sm md:text-xl opacity-90 max-w-2xl leading-relaxed font-medium">Aquí puedes hacer un seguimiento de tus compras y pedidos realizados en TechZone.</p>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Columna Izquierda: Compras */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <h3 className="text-base md:text-xl font-bold text-slate-100 flex items-center gap-2 md:gap-3">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
              Mis Compras
            </h3>
            <span className="px-3 md:px-4 py-1 md:py-1.5 bg-slate-900 border border-slate-800 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">
              {orders.length} Pedidos
            </span>
          </div>

          {loading ? (
            <div className="card-white py-16 md:py-24 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-blue-600 animate-spin" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando tu historial...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="card-white py-16 md:py-24 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-950 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-4 md:mb-6 border border-slate-800">
                <ShoppingBag size={32} className="text-slate-700" />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-slate-200 mb-1 md:mb-2">Aún no tienes compras</h4>
              <p className="text-slate-500 text-sm max-w-sm font-medium">Cuando realices tu primer pedido, aparecerá aquí con todo el detalle de su estado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              {orders.map((order) => {
                const status = getStatusInfo(order.status);
                const isExpanded = expandedOrderId === order.id;
                const isCompleted = order.status.toLowerCase() === 'completed' || order.status.toLowerCase() === 'paid' || order.status.toLowerCase() === 'success';

                return (
                  <div key={order.id} className="card-white overflow-hidden hover:border-blue-500/30 transition-all">
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-6">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Orden</span>
                            <span className="font-mono text-xs md:text-sm text-slate-200 font-bold">#{order.id}</span>
                          </div>
                          
                          <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
                          
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Fecha</span>
                            <div className="flex items-center gap-1.5 text-slate-200 text-xs md:text-sm font-bold">
                              <Calendar size={12} className="text-slate-500" />
                              {formatDate(order.date)}
                            </div>
                          </div>

                          <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>

                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Total</span>
                            <span className="text-emerald-400 text-sm md:text-base font-bold">{formatPrice(order.total)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4 mt-2 sm:mt-0">
                          <div className={`flex items-center gap-1.5 px-3 md:px-4 py-1 md:py-1.5 rounded-full border text-[9px] md:text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                            {status.icon}
                            {status.label}
                          </div>
                          
                          {isCompleted && (
                            <button 
                              onClick={() => toggleOrderExpansion(order.id)}
                              className={`p-2 md:p-3 bg-slate-950 border border-slate-800 text-slate-400 rounded-lg md:rounded-xl hover:text-blue-400 hover:border-blue-400/50 transition-all ${isExpanded ? 'rotate-90 bg-blue-500/10 text-blue-400' : ''}`}
                            >
                              <ChevronRight size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Detalles Expandidos (Solo para completadas) */}
                      {isExpanded && isCompleted && (
                        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-800 animate-in slide-in-from-top-2 duration-300">
                          <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 md:mb-4">Productos en este pedido</h4>
                          <div className="space-y-2 md:space-y-3">
                            {(order.items || []).length > 0 ? (
                              (order.items || []).map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-950/50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-slate-800/50 group/item hover:border-slate-700 transition-colors">
                                  <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-lg md:rounded-xl flex items-center justify-center text-[10px] md:text-xs font-black text-blue-500 border border-slate-800">
                                      {item.quantity}x
                                    </div>
                                    <span className="text-xs md:text-sm font-bold text-slate-200">{item.name || item.product?.name || 'Producto'}</span>
                                  </div>
                                  <span className="text-xs md:text-sm font-black text-slate-100">{formatPrice(item.price || item.product?.price || 0)}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-500 italic p-3 md:p-4 bg-slate-950/30 rounded-xl border border-slate-800/50">
                                Los detalles de los productos no están disponibles para esta orden antigua.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Columna Derecha: Pendientes */}
        <div className="space-y-4 md:space-y-6">
          <h3 className="text-base md:text-xl font-bold text-slate-100 flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
            Pendientes
          </h3>

          {cartItems.length > 0 ? (
            <div className="card-white p-6 md:p-8 border-dashed border-emerald-500/30 bg-emerald-500/5 group hover:bg-emerald-500/10 transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500/20 text-emerald-400 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                  <ShoppingCart size={24} className="md:w-8 md:h-8" />
                </div>
                <h4 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2">Carrito Pendiente</h4>
                <p className="text-slate-400 text-xs md:text-sm font-medium mb-4 md:mb-6">
                  Tienes <span className="text-emerald-400 font-bold">{cartItems.length}</span> {cartItems.length === 1 ? 'producto' : 'productos'} en tu carrito sin finalizar.
                </p>
                <div className="w-full p-3 md:p-4 bg-slate-950/50 rounded-xl md:rounded-2xl border border-slate-800 mb-4 md:mb-6 flex justify-between items-center">
                  <span className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-wider">Total estimado</span>
                  <span className="text-base md:text-lg font-black text-emerald-400">{formatPrice(totalPrice)}</span>
                </div>
                <Link 
                  to="/cart" 
                  className="w-full flex items-center justify-center gap-2 md:gap-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[10px] md:text-xs uppercase tracking-widest py-3 md:py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all group/btn"
                >
                  Finalizar Compra
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="card-white p-6 md:p-8 flex flex-col items-center text-center opacity-50 grayscale">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-800 text-slate-500 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center mb-4 md:mb-6 border border-slate-700">
                <ShoppingCart size={24} className="md:w-8 md:h-8" />
              </div>
              <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest">Nada pendiente</p>
            </div>
          )}

          {/* Banner decorativo o info adicional */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden">
            <h4 className="text-white text-sm md:text-base font-bold mb-1 md:mb-2 relative z-10">¿Necesitas ayuda?</h4>
            <p className="text-slate-400 text-xs md:text-sm relative z-10">Consulta con nuestro asistente virtual si tienes dudas sobre tus pedidos.</p>
            <Bot className="absolute -bottom-4 -right-4 w-20 h-20 md:w-24 md:h-24 text-blue-500/10 -rotate-12" />
          </div>
        </div>
      </div>
    </Layout>
  );
};


export default Home;
