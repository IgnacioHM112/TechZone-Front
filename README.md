# 🚀 TechZone - E-Commerce de Hardware

![TechZone Banner](https://via.placeholder.com/1200x400/0f172a/3b82f6?text=TechZone+Hardware+Store)

TechZone es una plataforma de comercio electrónico moderna y de alto rendimiento diseñada específicamente para entusiastas del hardware y la tecnología. Ofrece una experiencia de usuario fluida, desde la navegación por el catálogo hasta el checkout seguro con Mercado Pago.

---

## ✨ Características Principales

*   **🛒 Carrito Inteligente:** Gestión dinámica de productos con persistencia, control de stock en tiempo real y cálculos automáticos.
*   **🤖 Asistente Virtual (ChatBot):** Soporte automatizado impulsado por IA para ayudar a los usuarios en su proceso de compra.
*   **🛡️ Autenticación Segura:** Sistema robusto de registro e inicio de sesión con JWT y protección de rutas (Admin/User).
*   **📊 Panel Administrativo Avanzado:**
    *   **Gestión de Inventario:** CRUD completo de productos y categorías.
    *   **Recorte de Imágenes:** Herramienta integrada para optimizar las fotos de productos antes de subirlas.
    *   **Configuración de Soporte IA:** Control de respuestas automáticas y monitoreo de historial de comunicación.
*   **📄 Comprobantes PDF:** Descarga automática de recibos detallados directamente desde el servidor tras cada compra.
*   **📱 Diseño Futurista:** Interfaz "Dark Mode" optimizada para todos los dispositivos utilizando Tailwind CSS 4.

---

## 💻 Stack Tecnológico

El proyecto utiliza las últimas versiones de las tecnologías líderes en el desarrollo Frontend:

*   **Framework:** [React 19](https://react.dev/) (Última versión estable)
*   **Herramienta de Construcción:** [Vite 8](https://vitejs.dev/)
*   **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/) (Motor de alto rendimiento)
*   **Ruteo:** [React Router 7](https://reactrouter.com/)
*   **Comunicación:** [Axios](https://axios-http.com/) con interceptores de seguridad.
*   **Estado Global:** Context API (Auth & Cart).
*   **Iconografía:** [Lucide React](https://lucide.dev/)
*   **Notificaciones:** [React Hot Toast](https://react-hot-toast.com/)
*   **Utilidades:** `react-easy-crop` para edición de imágenes.

---

## 💳 Integración con Mercado Pago

TechZone utiliza el modelo **Checkout Pro** de Mercado Pago para garantizar transacciones seguras:

1.  **Backend-Driven:** El servidor genera las preferencias de pago.
2.  **Experiencia Nativa:** Redirección segura al portal de Mercado Pago.
3.  **Feedback Dinámico:** Procesamiento de estados de pago (Success, Pending, Failure) con actualización de pedidos.

---

## 👥 Equipo de Desarrollo

Este proyecto fue desarrollado para la cátedra de **Laboratorio de Computación 3** por:

*   **Ignacio Mello**
*   **Lucas Fernandez**
*   **Nicolas Videla**

---

## 🛠️ Setup & Instalación

Sigue estos pasos para levantar el proyecto localmente:

### 1. Clonar el repositorio
```bash
git clone https://github.com/usuario/techzone-front.git
cd techzone-front
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz (puedes usar `.env.example` como base):
```env
VITE_API_URL=http://tu-backend-api.com/api
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```

---

## 📸 Capturas del Proyecto

| Catálogo de Productos | Panel de Administración |
|:---:|:---:|
| ![Catalog](https://via.placeholder.com/400x250/1e293b/3b82f6?text=Products+Catalog) | ![Admin](https://via.placeholder.com/400x250/1e293b/3b82f6?text=Admin+Dashboard) |

---

<p align="center">
  Propiedad intelectual de TechZone Team © 2026.
</p>
