# 🚀 Guía para Desplegar el Backend en Render

## Paso 1: Crear el Servicio Web

1. Ve a: https://dashboard.render.com
2. Si no tienes cuenta, haz clic en **"Get Started for Free"** y regístrate con GitHub
3. En el dashboard, haz clic en **"New +"** → **"Web Service"**

## Paso 2: Conectar el Repositorio

1. Selecciona **"Connect account"** si aún no has conectado GitHub
2. Autoriza a Render a acceder a tus repositorios
3. Busca y selecciona tu repositorio: **`-takemlink1`**
4. Haz clic en **"Connect"**

## Paso 3: Configurar el Servicio

Configura estos valores:

### Información Básica:
- **Name:** `takemlink-backend` (o el nombre que prefieras)
- **Region:** Elige la región más cercana a ti (ej: `Oregon (US West)`)
- **Branch:** `main` (o `master` si es tu rama principal)
- **Root Directory:** `backend` ⚠️ **MUY IMPORTANTE**

### Build & Deploy:
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Plan:
- **Plan:** `Free` (para empezar)

## Paso 4: Variables de Entorno (Opcional)

En la sección **"Environment Variables"**, puedes agregar:
- `NODE_ENV` = `production`

**NOTA:** No necesitas configurar `PORT` - Render lo asigna automáticamente.

## Paso 5: Crear el Servicio

1. Haz clic en **"Create Web Service"**
2. Espera 2-3 minutos mientras Render:
   - Clona tu repositorio
   - Instala las dependencias (`npm install`)
   - Inicia el servidor (`npm start`)

## Paso 6: Verificar el Despliegue

1. Una vez completado, verás una URL como: `https://takemlink-backend.onrender.com`
2. Prueba el endpoint de health:
   ```
   https://takemlink-backend.onrender.com/api/health
   ```
3. Deberías ver una respuesta JSON con `{"status":"OK",...}`

## Paso 7: Actualizar Netlify

1. Ve a Netlify: https://app.netlify.com
2. Selecciona tu sitio
3. Ve a **"Site settings"** → **"Environment variables"**
4. Actualiza o agrega:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://takemlink-backend.onrender.com` (la URL que te dio Render)
5. Guarda y redesplega

## ⚠️ Problemas Comunes

### El backend está "dormido"
- En el plan Free, Render pone los servicios a dormir después de 15 minutos de inactividad
- La primera petición puede tardar 30-50 segundos en "despertar"
- Las siguientes peticiones serán rápidas

### Error: "Build failed"
- Verifica que el **Root Directory** sea exactamente `backend` (sin espacios, sin mayúsculas)
- Verifica que `package.json` esté en la carpeta `backend`
- Revisa los logs en Render para ver el error específico

### Error: "Service unavailable"
- Espera unos minutos y vuelve a intentar
- Verifica los logs en Render para ver qué está pasando

## 🔍 Verificar Logs

1. En Render, ve a tu servicio
2. Haz clic en la pestaña **"Logs"**
3. Aquí verás todos los mensajes del servidor
4. Busca mensajes como: `🌐 Servidor TákemLink corriendo en...`

## ✅ Checklist Final

- [ ] Servicio creado en Render
- [ ] Root Directory configurado como `backend`
- [ ] Build completado exitosamente
- [ ] URL del backend funcionando (ej: `https://takemlink-backend.onrender.com/api/health`)
- [ ] Variable `VITE_API_URL` configurada en Netlify con la URL de Render
- [ ] Netlify redesplegado después de agregar la variable

---

**¡Listo!** Tu backend debería estar funcionando en Render y tu frontend en Netlify debería poder conectarse a él.

