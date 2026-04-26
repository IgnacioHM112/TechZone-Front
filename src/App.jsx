import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminHome from './pages/admin/AdminHome';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import ProductsCatalog from './pages/ProductsCatalog';
import CartPage from './pages/CartPage';
import PaymentSuccess from './pages/PaymentSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import './index.css';

// Componente para redirigir si el usuario ya está logueado
const PublicRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={isAdmin ? "/admin/products" : "/products"} replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page protegida para no-logueados */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } 
      />
      
      {/* Catálogo Público */}
      <Route path="/products" element={<ProductsCatalog />} />

      {/* Resultado de Pago */}
      <Route path="/payment-success" element={<PaymentSuccess />} />

      {/* Carrito de Compras (Protegido por login en la lógica interna) */}
      <Route path="/cart" element={
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      } />

      {/* Rutas Públicas con redirección si ya hay sesión */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />

      {/* Rutas de Usuario */}
      <Route
        path="/home"
        element={<Navigate to="/products" replace />}
      />

      {/* Rutas de Admin */}
      <Route
        path="/admin/home"
        element={<Navigate to="/admin/products" replace />}
      />      <Route
        path="/admin/products"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminCategories />
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #334155',
                borderRadius: '1rem',
              },
            }}
          />
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
