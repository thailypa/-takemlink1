# 🚀 Alternativas para Desplegar el Backend

Si Render no funciona, aquí tienes otras opciones gratuitas:

---

## Opción 1: Railway.app (Recomendada - Muy Fácil)

### Ventajas:
- ✅ Muy fácil de usar
- ✅ Despliegue automático desde GitHub
- ✅ No se duerme (plan gratuito con límites)
- ✅ URL automática

### Pasos:
1. Ve a: https://railway.app
2. Haz clic en **"Start a New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Conecta tu cuenta de GitHub
5. Selecciona tu repositorio: `-takemlink1`
6. Railway detectará automáticamente que es Node.js
7. En **"Settings"** → **"Root Directory"**, escribe: `backend`
8. Railway desplegará automáticamente
9. Obtendrás una URL como: `https://takemlink-backend.up.railway.app`

### Configurar en Netlify:
- Variable: `VITE_API_URL` = `https://tu-backend.up.railway.app`

---

## Opción 2: Fly.io (Gratis con límites)

### Pasos:
1. Ve a: https://fly.io
2. Instala Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/
3. O usa el dashboard web
4. Crea una nueva app
5. Conecta tu repositorio de GitHub
6. Configura:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

---

## Opción 3: Cyclic.sh (Muy Simple)

### Pasos:
1. Ve a: https://cyclic.sh
2. Haz clic en **"Deploy Now"**
3. Conecta con GitHub
4. Selecciona tu repositorio: `-takemlink1`
5. En **"Root Directory"**, escribe: `backend`
6. Cyclic desplegará automáticamente
7. Obtendrás una URL como: `https://tu-app.cyclic.app`

---

## Opción 4: Render (Reintentar con configuración correcta)

Si quieres intentar Render de nuevo:

### Configuración correcta:
- **Root Directory:** `backend` (exactamente así, sin espacios)
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `NODE_ENV` = `production`
  - NO configures `PORT` (Render lo asigna automáticamente)

---

## Opción 5: Vercel (Solo para Backend API)

### Pasos:
1. Ve a: https://vercel.com
2. **"Add New Project"**
3. Conecta tu repositorio: `-takemlink1`
4. Configura:
   - **Root Directory:** `backend`
   - **Framework Preset:** Other
   - **Build Command:** `npm install`
   - **Output Directory:** (déjalo vacío)
   - **Install Command:** `npm install`
5. Despliega

---

## 🎯 Recomendación

**Railway.app** es la opción más fácil y confiable:
- ✅ No se duerme
- ✅ Muy fácil de configurar
- ✅ Despliegue automático
- ✅ URL automática

---

## 📝 Después de Desplegar

Cualquiera que sea la opción que elijas:

1. **Copia la URL del backend** (ej: `https://tu-backend.railway.app`)
2. **Ve a Netlify:**
   - Site settings → Environment variables
   - Agrega: `VITE_API_URL` = `https://tu-backend.railway.app`
3. **Redesplega Netlify**
4. **Prueba desde tu móvil**

---

## 🔍 Verificar que Funciona

Abre en tu navegador:
```
https://tu-backend-url.com/api/health
```

Deberías ver:
```json
{"status":"OK","timestamp":"...","usuariosRegistrados":0,"institucionesRegistradas":0}
```

---

## ⚠️ Nota Importante

Todas estas opciones tienen planes gratuitos con límites. Para producción, considera:
- Railway: $5/mes (sin límites)
- Render: $7/mes (sin sleep)
- Fly.io: Pay as you go

