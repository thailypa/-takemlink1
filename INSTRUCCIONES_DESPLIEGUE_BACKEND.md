# 🚀 Instrucciones para Desplegar el Backend

Para que tu aplicación funcione desde cualquier dispositivo, necesitas desplegar el backend en internet.

## 📋 Opción 1: Render.com (Recomendado - Gratis)

### Paso 1: Crear cuenta
1. Ve a: https://render.com
2. Haz clic en **"Get Started for Free"**
3. Selecciona **"Sign up with GitHub"**
4. Autoriza a Render a acceder a tus repositorios

### Paso 2: Crear nuevo servicio
1. En el dashboard, haz clic en **"New +"** → **"Web Service"**
2. Conecta tu repositorio: **`thailypa/-takemlink1`**
3. Configura:
   - **Name:** `takemlink-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free` (gratis)

### Paso 3: Configurar variables de entorno
1. En la sección **"Environment Variables"**, agrega:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render asigna el puerto automáticamente, pero esto ayuda)

### Paso 4: Desplegar
1. Haz clic en **"Create Web Service"**
2. Espera 2-3 minutos mientras Render construye y despliega
3. Al finalizar, verás una URL como: `https://takemlink-backend.onrender.com`

### Paso 5: Copiar la URL del backend
- Copia la URL que te dio Render (ejemplo: `https://takemlink-backend.onrender.com`)
- **¡IMPORTANTE:** Esta URL la necesitarás en el siguiente paso

---

## 📋 Opción 2: Railway.app (Alternativa)

1. Ve a: https://railway.app
2. **"Start a New Project"** → **"Deploy from GitHub repo"**
3. Selecciona tu repositorio: `-takemlink1`
4. En **"Settings"** → **"Root Directory"**, escribe: `backend`
5. Railway detectará automáticamente Node.js
6. Obtendrás una URL como: `https://takemlink-backend.up.railway.app`

---

## ✅ Configurar Netlify para usar el backend

Una vez que tengas la URL de tu backend desplegado:

### Paso 1: Ir a Netlify
1. Ve a: https://app.netlify.com
2. Selecciona tu sitio: **`takemlink`**

### Paso 2: Configurar variable de entorno
1. Ve a **"Site settings"** → **"Environment variables"**
2. Haz clic en **"Add a variable"**
3. Agrega:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://tu-backend-url.onrender.com` (la URL que te dio Render)
4. Haz clic en **"Save"**

### Paso 3: Redesplegar
1. Ve a **"Deploys"**
2. Haz clic en **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Espera 1-2 minutos

### Paso 4: ¡Listo!
- Tu aplicación ahora funcionará desde cualquier dispositivo
- El frontend se conectará al backend desplegado en internet

---

## 🔍 Verificar que funciona

1. Abre tu app en Netlify: https://takemlink.netlify.app
2. Intenta registrar un usuario o institución
3. Si no aparece el error de conexión, ¡funciona! ✅

---

## 📝 Notas importantes

- **Render Free Plan:** El backend puede "dormir" después de 15 minutos de inactividad. La primera petición puede tardar 30-50 segundos en despertar.
- **Railway Free Plan:** Tiene límites de uso mensual.
- Si necesitas que el backend esté siempre activo, considera un plan de pago.

---

## 🆘 Solución de problemas

**Error: "Cannot connect to server"**
- Verifica que el backend esté desplegado y funcionando
- Verifica que la variable `VITE_API_URL` esté configurada correctamente en Netlify
- Asegúrate de haber redesplegado después de agregar la variable

**Backend tarda mucho en responder**
- Si usas Render Free, el backend puede estar "dormido"
- La primera petición después de inactividad puede tardar 30-50 segundos

