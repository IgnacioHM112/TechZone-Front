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
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-medium">Sincronizando tu carrito...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-20">
      <SimpleNavbar />
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tu Carrito</h1>
            <p className="text-slate-400">Gestiona las cantidades de tus productos</p>
          </div>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Lista de Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const isUpdating = updatingId === item.id || updatingId === item.product_id;
                return (
                  <div 
                    key={item.id} 
                    className={`bg-slate-800/40 border border-slate-800 rounded-3xl p-6 flex flex-col sm:row items-center gap-6 group hover:border-slate-700 transition-all shadow-lg ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {/* Miniatura */}
                    <div className="w-24 h-24 bg-slate-900 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-800">
                      <img 
                        src={item.product.image_url || 'https://via.placeholder.com/100'} 
                        alt={item.product.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{item.product.name}</h3>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                            Stock disponible: {item.product.stock}
                          </p>
                        </div>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="text-slate-500 hover:text-red-400 p-2 transition-colors bg-slate-900/50 rounded-xl"
                          title="Eliminar de la lista"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Precio Unitario</span>
                          <span className="text-sm font-bold text-slate-300">${item.product.price.toLocaleString()}</span>
                        </div>

                        {/* Selector de Cantidad */}
                        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-2xl p-1 shadow-inner">
                          <button 
                            disabled={isUpdating}
                            onClick={() => removeUnits(item.id, 1)}
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all active:scale-90 disabled:opacity-50"
                            title="Quitar uno"
                          >
                            <Minus size={16} />
                          </button>
                          
                          <div className="w-12 text-center font-black text-white text-lg">
                            {isUpdating ? <Loader2 size={14} className="animate-spin mx-auto text-blue-500" /> : item.quantity}
                          </div>
                          
                          <button 
                            disabled={isUpdating || item.quantity >= item.product.stock}
                            onClick={() => addProduct(item.product_id, 1, false)}
                            className="w-10 h-10 flex items-center justify-center text-blue-400 hover:text-white hover:bg-blue-600 rounded-xl transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Añadir uno"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="text-right flex flex-col">
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Subtotal</span>
                          <span className="text-xl font-black text-blue-500">${(item.quantity * item.product.price).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button 
                onClick={() => setConfirmModal(true)}
                className="text-slate-500 hover:text-red-400 text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 px-6 py-4 transition-colors group"
              >
                <Trash2 size={16} className="group-hover:animate-bounce" />
                Vaciar Carrito de Compras
              </button>
            </div>

            {/* Resumen de Compra */}
            <div className="space-y-6">
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 sticky top-28 shadow-2xl overflow-hidden group/card">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover/card:bg-blue-600/20 transition-colors duration-500"></div>
                
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                  <CreditCard className="text-blue-500" />
                  Resumen de compra
                </h2>
                
                <div className="space-y-4 mb-8 relative z-10">
                  <div className="flex justify-between text-slate-400">
                    <span className="text-sm">Items seleccionados</span>
                    <span className="font-bold text-white">{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span className="text-sm">Envío Express</span>
                    <span className="text-green-500 font-black text-[10px] uppercase tracking-widest px-2 py-1 bg-green-500/10 rounded-lg">Bonificado</span>
                  </div>
                  <div className="pt-6 border-t border-slate-700/50 flex flex-col gap-1">
                    <span className="text-xs text-slate-500 font-black uppercase tracking-widest">Total a invertir</span>
                    <span className="text-4xl font-black text-white">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  disabled={isCheckingOut}
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? <Loader2 className="animate-spin" /> : (
                    <>
                      Pagar Ahora
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
                
                <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale group-hover/card:grayscale-0 group-hover/card:opacity-60 transition-all">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                </div>
              </div>
              
              <Link 
                to="/products" 
                className="flex items-center justify-center gap-2 text-slate-500 hover:text-blue-400 transition-colors py-4 font-black text-xs uppercase tracking-widest"
              >
                Seguir Explorando
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/20 border-2 border-dashed border-slate-800 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center px-4">
            <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center mb-8 text-slate-600">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-3xl font-bold mb-4">El carrito está desierto</h2>
            <p className="text-slate-500 max-w-sm mb-10 text-lg">
              Tu configuración de hardware te está esperando. Añade componentes para empezar.
            </p>
            <Link 
              to="/products" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3"
            >
              Ir a la Tienda
              <ChevronDown size={20} className="-rotate-90" />
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
