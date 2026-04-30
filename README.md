# 🚀 TechZone - E-Commerce de Hardware

![TechZone Banner](https://via.placeholder.com/1200x400/0f172a/3b82f6?text=TechZone+Hardware+Store)

TechZone es una plataforma de comercio electrónico moderna y de alto rendimiento diseñada específicamente para entusiastas del hardware y la tecnología. Ofrece una experiencia de usuario fluida, desde la navegación por el catálogo hasta el checkout seguro.

---

## ✨ Características Principales

*   **🛒 Carrito Inteligente:** Gestión dinámica de productos con persistencia y actualizaciones en tiempo real.
*   **🤖 Asistente Virtual (ChatBot):** Soporte automatizado integrado para ayudar a los usuarios en su proceso de compra.
*   **🛡️ Autenticación Segura:** Sistema robusto de registro e inicio de sesión con protección de rutas.
*   **📊 Panel Administrativo:** Control total sobre el inventario, categorías y gestión de productos.
*   **📄 Comprobantes PDF:** Generación automática de recibos detallados para cada compra exitosa.
*   **📱 Diseño Responsive:** Experiencia optimizada para dispositivos móviles, tablets y escritorio utilizando Tailwind CSS 4.

---

## 💻 Stack Tecnológico

El proyecto está construido con las tecnologías más modernas del ecosistema Frontend:

*   **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/) (Componentes modernos y utilitarios)
*   **Ruteo:** [React Router Dom 7](https://reactrouter.com/)
*   **Comunicación:** [Axios](https://axios-http.com/) para el consumo de API REST.
*   **Estado Global:** React Context API (Auth & Cart).
*   **Iconografía:** [Lucide React](https://lucide.dev/)
*   **Notificaciones:** [React Hot Toast](https://react-hot-toast.com/)

---

## 💳 Integración con Mercado Pago

TechZone utiliza el **SDK de Mercado Pago** para garantizar transacciones seguras y eficientes:

*   **Checkout Pro:** Integración mediante la API de Preferencias para una experiencia de pago nativa.
*   **Feedback de Pago:** Manejo de estados (Éxito, Pendiente, Error) para una correcta confirmación de la orden.
*   **Seguridad:** Procesamiento de datos sensibles delegado a la infraestructura de Mercado Pago.

---

## 👥 Equipo de Desarrollo

Este proyecto fue desarrollado con ❤️ por:

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
Crea un archivo `.env` en la raíz basado en `.env.example`:
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```

---

## 📸 Demo Visual

> [!TIP]
> Próximamente incluiremos capturas de pantalla de la interfaz y un video demostrativo.

| Catálogo de Productos | Panel de Administración |
|:---:|:---:|
| ![Placeholder](https://via.placeholder.com/400x250/1e293b/64748b?text=Products+View) | ![Placeholder](https://via.placeholder.com/400x250/1e293b/64748b?text=Admin+Dashboard) |

---

<p align="center">
  Desarrollado para la cátedra de Laboratorio de Computación 3.
</p>
