import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addToCart, removeItem, clearCart } from '../services/cartService';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (token && user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [token, user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      let items = [];
      if (Array.isArray(res.data)) {
        items = res.data;
      } else if (res.data && Array.isArray(res.data.items)) {
        items = res.data.items;
      } else if (res.data && res.data.CartItems && Array.isArray(res.data.CartItems)) {
        items = res.data.CartItems;
      }
      setCartItems(items);
    } catch (err) {
      console.error('Error al cargar carrito:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product_id, quantity = 1, showToast = true) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar productos');
      return false;
    }
    
    setUpdatingId(product_id);
    try {
      await addToCart(product_id, quantity);
      await fetchCart(); 
      if (showToast) toast.success('Cantidad actualizada');
      return true;
    } catch (err) {
      const errorData = err.response?.data;
      if (err.response?.status === 400 && errorData?.stockDisponible !== undefined) {
        toast.error(`${errorData.mensaje} (Disponible: ${errorData.stockDisponible})`);
      } else {
        toast.error('Error al actualizar');
      }
      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  const removeUnits = async (item_id, quantity = 1) => {
    setUpdatingId(item_id);
    try {
      // Optimista: restar localmente primero para UX fluida
      setCartItems(prev => prev.map(item => 
        item.id === item_id ? { ...item, quantity: item.quantity - quantity } : item
      ).filter(item => item.quantity > 0));

      await removeItem(item_id, quantity);
      await fetchCart();
    } catch (err) {
      toast.error('No se pudo restar la unidad');
      await fetchCart(); // Revertir en caso de error
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteItem = async (item_id) => {
    // IMPORTANTE: Asegurarnos de que el ID que llega es el correcto
    if (!item_id) return;
    
    setUpdatingId(item_id);
    try {
      // Optimista: eliminar de la UI inmediatamente
      setCartItems(prev => prev.filter(item => item.id !== item_id));
      
      await removeItem(item_id); // Borrado total (sin quantity body)
      toast.success('Producto eliminado');
    } catch (err) {
      toast.error('No se pudo eliminar el producto');
      await fetchCart(); // Revertir si falla
    } finally {
      setUpdatingId(null);
    }
  };

  const emptyCart = async () => {
    setLoading(true);
    try {
      await clearCart();
      setCartItems([]);
      toast.success('Carrito vaciado');
    } catch (err) {
      toast.error('Error al vaciar el carrito');
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const itemsArray = Array.isArray(cartItems) ? cartItems : [];
  const totalItems = itemsArray.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const totalPrice = itemsArray.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + (item.quantity * price);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems: itemsArray, 
      loading, 
      updatingId,
      addProduct, 
      removeUnits,
      deleteItem, 
      emptyCart, 
      totalItems, 
      totalPrice,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
