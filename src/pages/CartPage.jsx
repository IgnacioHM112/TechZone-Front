import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SimpleNavbar from '../components/SimpleNavbar';
import ConfirmationModal from '../components/ConfirmationModal';
import { Trash2, ShoppingBag, ArrowRight, Loader2, Minus, Plus, CreditCard, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { createPreference } from '../services/orderService';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cartItems, loading, updatingId, deleteItem, emptyCart, addProduct, removeUnits, totalPrice, totalItems, totalUSD, cryptoOptions } = useCart();
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
                    className={`bg-slate-900 border border-slate-800 rounded-3xl md:rounded-[2.5rem] p-4 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 group hover:border-blue-400/40 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-900/50 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {/* Miniatura */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.image_url || 'https://via.placeholder.com/100'} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{item.product.name}</h3>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">
                            Disponibles: {item.product.stock} unidades
                          </p>
                        </div>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="text-slate-300 hover:text-red-500 p-2 sm:p-3 transition-colors hover:bg-slate-850 rounded-xl cursor-pointer"
                          title="Eliminar de la lista"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 items-center justify-between gap-4 w-full border-t border-slate-800/50 sm:border-t-0 pt-4 sm:pt-0">
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Precio Unitario</span>
                          <span className="text-sm sm:text-base font-bold text-slate-200">${item.product.price.toLocaleString()}</span>
                        </div>

                        {/* Selector de Cantidad */}
                        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1 w-fit mx-auto sm:mx-0">
                          <button 
                            disabled={isUpdating}
                            onClick={() => removeUnits(item.id, 1)}
                            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 hover:shadow-sm rounded-xl transition-all active:scale-90 disabled:opacity-50 cursor-pointer"
                          >
                            <Minus size={16} />
                          </button>
                          
                          <div className="w-10 sm:w-14 text-center font-black text-white text-base sm:text-lg">
                            {isUpdating ? <Loader2 size={14} className="animate-spin mx-auto text-blue-400" /> : item.quantity}
                          </div>
                          
                          <button 
                            disabled={isUpdating || item.quantity >= item.product.stock}
                            onClick={() => addProduct(item.product_id, 1, false)}
                            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-blue-400 hover:text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 rounded-xl transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="text-center sm:text-right flex flex-col">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Subtotal</span>
                          <span className="text-xl sm:text-2xl font-black text-blue-400">${(item.quantity * item.product.price).toLocaleString()}</span>
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
              <div className="bg-slate-900 border border-slate-800 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 sticky top-28 shadow-2xl shadow-slate-950/60 overflow-hidden group/card">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover/card:bg-blue-600/20 transition-colors duration-500"></div>
                
                <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8 flex items-center gap-3 relative z-10 text-white">
                  <CreditCard className="text-blue-400" />
                  Resumen
                </h2>
                
                <div className="space-y-4 relative z-10">
                  <div className="bg-slate-950/50 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400 font-medium">Items seleccionados</span>
                      <span className="font-extrabold text-white">{totalItems}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400 font-medium">Envío Express</span>
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-emerald-500/20">Bonificado</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-blue-500/5 rounded-xl px-4 py-3 border border-blue-500/10 flex items-center justify-between">
                      <span className="text-[10px] text-blue-400/70 font-black uppercase tracking-[0.2em]">Pesos Argentinos</span>
                      <span className="text-base sm:text-lg font-black text-white">${totalPrice.toLocaleString()}</span>
                    </div>

                    {totalUSD > 0 && (
                      <div className="bg-emerald-500/5 rounded-xl px-4 py-3 border border-emerald-500/10 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-400/70 font-black uppercase tracking-[0.2em]">Dólares USD</span>
                        <span className="text-sm sm:text-base font-black text-emerald-300">${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}

                    {cryptoOptions.length > 0 && (
                      <div className="bg-yellow-500/5 rounded-xl px-4 py-3 border border-yellow-500/10">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-yellow-400/70 font-black uppercase tracking-[0.2em]">{cryptoOptions[0].label}</span>
                          <span className="text-sm sm:text-base font-black text-yellow-300">{cryptoOptions[0].symbol} {cryptoOptions[0].total.toFixed(8)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-slate-600">Tasa</span>
                          <span className="text-[10px] text-slate-500">{cryptoOptions[0].symbol} 1 = ${cryptoOptions[0].rate?.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  disabled={isCheckingOut}
                  onClick={handleCheckout}
                  className="w-full btn-brand py-4 md:py-5 text-base md:text-lg flex items-center justify-center gap-3 relative z-10 disabled:opacity-50 cursor-pointer mt-6"
                >
                  {isCheckingOut ? <Loader2 className="animate-spin" /> : (
                    <>
                      <span>Pagar Ahora</span>
                      <ArrowRight size={22} />
                    </>
                  )}
                </button>

                <div className="mt-6 pt-6 border-t border-slate-800 relative z-10">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] block mb-4">Medios de pago</span>
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <img src="/payments/mercadopago.svg.png" alt="Mercado Pago" className="h-7 opacity-60 hover:opacity-100 transition-opacity" />
                    <img src="/payments/visa.svg.png" alt="Visa" className="h-5 opacity-60 hover:opacity-100 transition-opacity" />
                    <img src="/payments/mastercard.svg.png" alt="Mastercard" className="h-7 opacity-60 hover:opacity-100 transition-opacity" />
                    <img src="/payments/bitcoin.svg.png" alt="Bitcoin" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
                  </div>
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
