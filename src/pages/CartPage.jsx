import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SimpleNavbar from '../components/SimpleNavbar';
import ConfirmationModal from '../components/ConfirmationModal';
import { Trash2, ShoppingBag, ArrowRight, Loader2, Minus, Plus, CreditCard, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { createPreference } from '../services/orderService';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cartItems, loading, updatingId, deleteItem, emptyCart, addProduct, removeUnits, totalPrice, totalItems } = useCart();
  const [confirmModal, setConfirmModal] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await createPreference();
      if (res.data.init_point) {
        window.location.href = res.data.init_point;
      } else {
        throw new Error('No se recibió el punto de inicio de pago');
      }
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al iniciar el proceso de pago');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
        <p className="text-slate-300 font-bold tracking-tight animate-pulse text-lg">Sincronizando tu carrito...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20">
      <SimpleNavbar />
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-5 mb-12">
          <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center shadow-sm">
            <ShoppingBag size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">Tu Carrito</h1>
            <p className="text-slate-400 font-medium">Gestiona las cantidades de tus productos</p>
          </div>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Lista de Items */}
            <div className="lg:col-span-2 space-y-5">
              {cartItems.map((item) => {
                const isUpdating = updatingId === item.id || updatingId === item.product_id;
                return (
                  <div 
                    key={item.id} 
                    className={`bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-center gap-8 group hover:border-blue-400/40 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-900/50 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {/* Miniatura */}
                    <div className="w-28 h-28 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.image_url || 'https://via.placeholder.com/100'} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-extrabold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{item.product.name}</h3>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">
                            Disponibles: {item.product.stock} unidades
                          </p>
                        </div>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="text-slate-300 hover:text-red-500 p-3 transition-colors hover:bg-red-50 rounded-xl"
                          title="Eliminar de la lista"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Precio Unitario</span>
                          <span className="text-base font-bold text-slate-200">${item.product.price.toLocaleString()}</span>
                        </div>

                        {/* Selector de Cantidad */}
                        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1.5">
                          <button 
                            disabled={isUpdating}
                            onClick={() => removeUnits(item.id, 1)}
                            className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 hover:shadow-sm rounded-xl transition-all active:scale-90 disabled:opacity-50"
                          >
                            <Minus size={18} />
                          </button>
                          
                          <div className="w-14 text-center font-black text-white text-lg">
                            {isUpdating ? <Loader2 size={16} className="animate-spin mx-auto text-blue-400" /> : item.quantity}
                          </div>
                          
                          <button 
                            disabled={isUpdating || item.quantity >= item.product.stock}
                            onClick={() => addProduct(item.product_id, 1, false)}
                            className="w-10 h-10 flex items-center justify-center text-blue-400 hover:text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 rounded-xl transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        <div className="text-right flex flex-col">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Subtotal</span>
                          <span className="text-2xl font-black text-blue-400">${(item.quantity * item.product.price).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => setConfirmModal(true)}
                  className="text-slate-400 hover:text-red-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-6 py-4 transition-colors group"
                >
                  <Trash2 size={14} className="group-hover:rotate-12 transition-transform" />
                  Vaciar Carrito de Compras
                </button>
              </div>
            </div>

            {/* Resumen de Compra */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 sticky top-28 shadow-2xl shadow-slate-950/60 overflow-hidden group/card">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover/card:bg-blue-600/20 transition-colors duration-500"></div>
                
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3 relative z-10 text-white">
                  <CreditCard className="text-blue-400" />
                  Resumen
                </h2>
                
                <div className="space-y-5 mb-10 relative z-10">
                  <div className="flex justify-between items-center text-slate-500 font-medium">
                    <span className="text-sm">Items seleccionados</span>
                    <span className="font-bold text-white">{totalItems}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 font-medium">
                    <span className="text-sm">Envío Express</span>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-emerald-100">Bonificado</span>
                  </div>
                  <div className="pt-8 border-t border-slate-50 flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Total a pagar</span>
                    <span className="text-5xl font-black text-white">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  disabled={isCheckingOut}
                  onClick={handleCheckout}
                  className="w-full btn-brand py-5 text-lg flex items-center justify-center gap-3 relative z-10 disabled:opacity-50"
                >
                  {isCheckingOut ? <Loader2 className="animate-spin" /> : (
                    <>
                      <span>Pagar Ahora</span>
                      <ArrowRight size={22} />
                    </>
                  )}
                </button>
                
                <div className="mt-10 flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-7" />
                </div>
              </div>
              
              <Link 
                to="/products" 
                className="flex items-center justify-center gap-2 text-slate-400 hover:text-blue-600 transition-all py-4 font-black text-[10px] uppercase tracking-[0.2em]"
              >
                Seguir Explorando Tienda
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center px-6 shadow-sm">
            <div className="w-28 h-28 bg-slate-950 rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-400 shadow-inner">
              <ShoppingBag size={56} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Tu carrito está vacío</h2>
            <p className="text-slate-400 max-w-sm mb-12 text-lg font-medium leading-relaxed">
              Tu configuración de hardware te está esperando. Añade componentes para empezar a construir el futuro.
            </p>
            <Link 
              to="/products" 
              className="btn-brand px-12 py-5 text-lg flex items-center gap-3"
            >
              <span>Ir a la Tienda</span>
              <ArrowRight size={22} />
            </Link>
          </div>
        )}
      </div>


      <ConfirmationModal 
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={() => {
          emptyCart();
          setConfirmModal(false);
        }}
        title="¿Limpiar el carrito?"
        message="Vas a remover todos los items de tu selección actual. Esta acción vaciará tu carrito por completo."
        confirmText="Sí, vaciar"
        variant="danger"
      />
    </div>
  );
};

export default CartPage;
