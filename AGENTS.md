# TechZone-Front — Contexto del proyecto

## Stack
- React 19 + Vite 8 + Tailwind CSS v4
- React Router DOM v7, Axios, Lucide React, React Hot Toast
- react-easy-crop, jsPDF + autotable, react-markdown
- ESLint v9 flat config, PostCSS + Autoprefixer
- Sin TypeScript, sin testing

## Scripts
- `npm run dev` — Dev server en puerto 5173
- `npm run build` — Producción
- `npm run lint` — ESLint

## Estructura
```
src/
├── main.jsx              # Entry point
├── App.jsx               # Providers + rutas
├── index.css             # Tailwind v4 + clases custom
├── components/           # Layout, Sidebar, SimpleNavbar, ProtectedRoute, ChatBot, ConfirmationModal
├── context/              # AuthContext (user/token/login/logout/isAdmin), CartContext (CRUD carrito)
├── pages/
│   ├── admin/            # AdminProducts, AdminCategories, AdminUsers, AdminHome
│   └── ...               # LandingPage, Login, Register, ForgotPassword, ResetPassword, Home, ProductsCatalog, CartPage, PaymentSuccess
├── services/             # api.js (axios instance con interceptor), authService, productService, categoryService, cartService, orderService, userService, chatbotService
└── utils/                # cropImage.js
```

## Convenciones
- **Componentes/páginas:** PascalCase.jsx, export default
- **Servicios:** camelCase.js, named exports + default object
- **Context:** PascalCase.jsx, Provider + useX (named exports)
- **CSS:** Tailwind utility-first + clases custom en index.css (`.btn-brand`, `.card-white`, `.input-brand`, `.glass-effect`)
- **Colores:** Fondo slate-950, texto slate-100, primario blue-600, secundario emerald-500
- **Tema:** Oscuro global, mobile-first con breakpoints sm/md/lg/xl

## Patrones importantes
- **Rutas protegidas:** ProtectedRoute con prop `requireAdmin`. PublicRoute redirige si autenticado.
- **Auth:** JWT en localStorage (key: `token`). AuthContext verifica sesión con GET /auth/profile al montar.
- **API:** Axios con interceptor que añade Bearer token. Endpoints bajo VITE_API_URL (por defecto /api).
- **Layout dual:** Público (SimpleNavbar) vs Admin (Layout + Sidebar). Layout recibe prop `title`.
- **Admin Layout:** Sidebar con enlaces a Productos/Categorías/Usuarios. Header con título dinámico.
- **Carrito:** Optimistic updates con reconciliación vía API. CartContext depende de AuthContext.
- **Pagos:** Mercado Pago Checkout Pro vía backend (create-preference → redirect → confirm).
- **Imágenes:** FormData con multipart/form-data, cropping con react-easy-crop (pantalla completa).
- **Notificaciones:** react-hot-toast para success/error.
- **ChatBot:** fetch directo a /api/chatbot (no usa axios), oculto en rutas /admin/*.

## Reglas al editar
- No añadir comentarios a menos que se solicite
- No modificar archivos que no sean parte de la tarea
- Seguir las convenciones de exportación y nombrado existentes
- No usar TypeScript, no añadir dependencias nuevas
- Usar siempre Tailwind utility classes antes que CSS personalizado
- Mantener el patrón mobile-first con responsive prefixes
