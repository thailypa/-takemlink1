# TákemLink 🌱

Sistema de gamificación para la gestión de residuos y conciencia ambiental.

## 📋 Descripción

TákemLink es una plataforma web que conecta a ciudadanos e instituciones para promover el reciclaje y la gestión responsable de residuos a través de un sistema de gamificación con puntos, niveles y recompensas.

## ✨ Características

### 👥 Para Ciudadanos
- 🎮 Sistema de gamificación con EcoPuntos
- 📊 Dashboard personalizado con estadísticas
- 🏆 Sistema de niveles y ranking
- 🎁 Catálogo de recompensas canjeables
- 📱 Perfil con código QR único
- 🤖 Asistente IA (Taki) para consultas ecológicas
- 📹 Videos y documentos educativos

### 🏢 Para Instituciones
- 📈 Dashboard de métricas en tiempo real
- 🗺️ Mapa interactivo de zonas críticas
- 📊 Generador de reportes avanzados
- 👥 Gestión de comunidades
- 🔔 Sistema de alertas inteligentes
- 📱 Notificaciones en tiempo real

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/TU_USUARIO/takemlink.git
cd takemlink
```

2. **Instalar dependencias del Backend**
```bash
cd backend
npm install
```

3. **Instalar dependencias del Frontend**
```bash
cd ../frontend
npm install
```

### Ejecutar el Proyecto

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
El servidor estará en: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
La aplicación estará en: http://localhost:5173

## 📁 Estructura del Proyecto

```
takemlink/
├── backend/              # Servidor Express.js
│   ├── index.js          # Servidor principal
│   ├── routes/           # Rutas de la API
│   ├── models/           # Modelos de datos
│   └── middleware/       # Middlewares
│
├── frontend/             # Aplicación React + Vite
│   ├── src/
│   │   ├── pages/        # Páginas principales
│   │   ├── components/   # Componentes reutilizables
│   │   └── config/       # Configuración
│   └── public/           # Archivos estáticos
│
└── README.md            # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- CORS

### Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion
- React Icons
- React CountUp

## 📚 Documentación

- [Guía para subir a GitHub](./GUIA_GITHUB.md)
- [Instrucciones de la imagen de Taki](./frontend/INSTRUCCIONES_IMAGEN_TAKI.md)

## 🔗 API Endpoints

### Usuarios
- `POST /api/usuarios/registro` - Registrar nuevo usuario
- `GET /api/usuarios/:id` - Obtener usuario por ID

### Instituciones
- `POST /api/instituciones/registro` - Registrar institución
- `GET /api/instituciones/:id` - Obtener institución
- `GET /api/instituciones/:id/metricas` - Obtener métricas

### EcoPuntos
- `POST /api/ecopuntos/registrar` - Registrar residuos y ganar puntos

### Alertas
- `GET /api/alertas` - Obtener todas las alertas
- `POST /api/alertas` - Crear nueva alerta
- `PUT /api/alertas/:id/leida` - Marcar alerta como leída

### Recompensas
- `GET /api/recompensas` - Obtener recompensas disponibles
- `POST /api/recompensas/canjear` - Canjear recompensa

## 👤 Autores

- Tu nombre aquí

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🌟 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**¡Juntos podemos hacer la diferencia! 🌍✨**
