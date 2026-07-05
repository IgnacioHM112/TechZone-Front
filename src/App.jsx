import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import AdminHome from './pages/admin/AdminHome';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import ProductsCatalog from './pages/ProductsCatalog';
import CartPage from './pages/CartPage';
import PaymentSuccess from './pages/PaymentSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import ChatBot from './components/ChatBot';
import { Loader2 } from 'lucide-react';
import './index.css';

// Componente para mostrar el ChatBot excepto en rutas de admin
const ChatBotWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute) return null;
  
  return <ChatBot />;
};

// Componente para redirigir si el usuario ya está logueado
const PublicRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
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
      {/* Landing Page accesible para todos */}
      <Route path="/" element={<LandingPage />} />
      
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
      <Route 
        path="/forgot-password" 
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } 
      />
      <Route 
        path="/reset-password" 
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } 
      />

      {/* Rutas de Usuario */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/home"
        element={<Navigate to="/admin/products" replace />}
      />

      <Route
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
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminUsers />
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
          <ChatBotWrapper />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
