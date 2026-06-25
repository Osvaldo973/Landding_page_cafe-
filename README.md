# Marsel & Patricia | Tienda de Café Premium ☕✨

Bienvenido al repositorio de **Marsel & Patricia**, una plataforma web premium diseñada para una tienda virtual de café artesanal de especialidad. Este proyecto combina una experiencia visual inmersiva para los amantes del café con una robusta integración con Firebase y WhatsApp para la gestión y realización de pedidos.

---

## 🚀 Características Principales

- **Diseño Visual de Alta Gama**: Interfaz estética, moderna y totalmente responsiva, inspirada en las cafeterías de especialidad. Utiliza fuentes elegantes (*Playfair Display* y *Lato*) y efectos dinámicos como partículas interactivas en la sección Hero.
- **Carrito de Compras y Pedidos por WhatsApp**: Un flujo de compra optimizado donde el usuario selecciona sus productos favoritos, ingresa sus datos de contacto y genera un pedido estructurado y listo para enviar en un solo clic a través de la API oficial de WhatsApp.
- **Panel de Administración (`admin.html`)**: Dashboard protegido que permite gestionar el inventario de productos y pedidos del negocio en tiempo real.
- **Firebase Integration**: 
  - **Firestore Database**: Almacenamiento e inyección en tiempo real de productos y pedidos.
  - **Firebase Auth**: Control de seguridad para el acceso al panel administrativo.
  - **Firebase Storage**: Subida de imágenes de productos del menú.
- **Notificaciones Toast**: Alertas dinámicas y no intrusivas para mejorar la experiencia de usuario (Feedback inmediato cuando se añade o elimina un producto).

---

## 📂 Estructura del Proyecto

El repositorio está estructurado de la siguiente forma:

```text
Marsel y Patricia/
├── admin.html             # Panel de administración de productos y pedidos
├── admin.js               # Lógica del dashboard de administrador
├── firebase-config.js     # Configuración y conexión de Firebase SDK
├── firebase.json          # Configuración del hosting de Firebase
├── index.html             # Página principal y tienda virtual
├── script.js              # Lógica de la tienda y pedidos de WhatsApp
├── styles.css             # Estilos detallados (Diseño fluido y responsive)
├── .firebaserc            # Archivo de configuración del proyecto Firebase
└── .gitignore             # Archivos excluidos de Git (IDE, logs y Firebase caché)
```

---

## 🛠️ Tecnologías y Recursos Utilizados

- **Frontend**: HTML5 Semántico, CSS3 Vanilla (Custom Properties, Flexbox, CSS Grid), Vanilla JavaScript (ES Modules).
- **Backend as a Service (BaaS)**: Firebase Suite (Auth, Firestore, Storage, Hosting).
- **Iconografía**: Font Awesome v6.4.0 (iconos vectoriales premium).
- **Fuentes**: Google Fonts (Playfair Display & Lato).

---

## ⚙️ Configuración y Despliegue Local

### 1. Requisitos Previos
Para servir el proyecto localmente, necesitas un servidor web simple. Puedes usar extensiones como **Live Server** en VS Code o ejecutar a través de Node.js:
```bash
npm install -g local-server
local-server
```

### 2. Configurar Firebase
Para que las funciones de administración y base de datos funcionen con tu propio backend:
1. Ve a la [Consola de Firebase](https://console.firebase.google.com/).
2. Crea un nuevo proyecto llamado `pagina-de-cafe` (o el nombre de tu preferencia).
3. Habilita **Firestore Database**, **Authentication** (Email/Password) y **Storage**.
4. Añade una **Web App** en Firebase y copia tus credenciales.
5. Reemplaza el objeto `firebaseConfig` en el archivo `firebase-config.js` con las tuyas:
   ```javascript
   const firebaseConfig = {
       apiKey: "TU_API_KEY",
       authDomain: "TU_AUTH_DOMAIN",
       projectId: "TU_PROJECT_ID",
       storageBucket: "TU_STORAGE_BUCKET",
       messagingSenderId: "TU_MESSAGING_SENDER_ID",
       appId: "TU_APP_ID"
   };
   ```

### 3. Subir a Firebase Hosting
Si deseas subir este proyecto a la web de forma gratuita usando Firebase Hosting:
1. Instala Firebase CLI en tu terminal:
   ```bash
   npm install -g firebase-tools
   ```
2. Inicia sesión en Firebase:
   ```bash
   firebase login
   ```
3. Inicializa el proyecto (opcional si ya tienes el `.firebaserc` correcto):
   ```bash
   firebase init hosting
   ```
4. Despliega la web:
   ```bash
   firebase deploy
   ```

---

## 👤 Autor

Desarrollado con dedicación por **Osvaldo Baret** — Ingeniero en Sistemas y Computación.
- **GitHub**: [@Osvaldo973](https://github.com/Osvaldo973)
- **LinkedIn**: [Osvaldo Baret](https://www.linkedin.com/in/osvaldo-baret-a50a5b243)
- **WhatsApp de contacto**: [809-609-0047](https://wa.me/8096090047)
