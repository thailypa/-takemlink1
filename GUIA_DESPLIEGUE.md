# 🚀 Guía para Desplegar TákemLink en Internet

Esta guía te ayudará a desplegar tu aplicación para que esté disponible desde cualquier dispositivo.

## 📋 Opción 1: Vercel (Recomendado - Gratis y Fácil)

### Paso 1: Crear cuenta en Vercel
1. Ve a: https://vercel.com
2. Haz clic en **"Sign Up"**
3. Selecciona **"Continue with GitHub"**
4. Autoriza a Vercel a acceder a tus repositorios

### Paso 2: Importar tu proyecto
1. En el dashboard de Vercel, haz clic en **"Add New..."** → **"Project"**
2. Selecciona tu repositorio: **`thailypa/-takemlink1`**
3. En **"Root Directory"**, selecciona: **`frontend`**
4. Vercel detectará automáticamente que es un proyecto Vite
5. Haz clic en **"Deploy"**

### Paso 3: Configurar variables de entorno (si necesitas conectar con backend)
1. En la configuración del proyecto, ve a **"Settings"** → **"Environment Variables"**
2. Agrega:
   - `VITE_API_URL` = `https://tu-backend-url.com` (cuando despliegues el backend)

### Paso 4: ¡Listo!
- Vercel te dará un link como: `https://takemlink.vercel.app`
- Este link funcionará desde cualquier dispositivo

---

## 📋 Opción 2: Netlify (Alternativa Gratis)

### Paso 1: Crear cuenta
1. Ve a: https://netlify.com
2. Haz clic en **"Sign up"** → **"GitHub"**

### Paso 2: Desplegar
1. Haz clic en **"Add new site"** → **"Import an existing project"**
2. Selecciona tu repositorio: **`thailypa/-takemlink1`**
3. Configura:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Haz clic en **"Deploy site"**

---

## 🔧 Desplegar el Backend (Opcional)

Para que la aplicación funcione completamente, también necesitas desplegar el backend:

### Opción A: Render (Gratis)
1. Ve a: https://render.com
2. Crea una cuenta con GitHub
3. **"New"** → **"Web Service"**
4. Conecta tu repositorio
5. Configura:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** `Node`

### Opción B: Railway (Gratis con límites)
1. Ve a: https://railway.app
2. Conecta con GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Selecciona tu repositorio y la carpeta `backend`

---

## ✅ Después del Despliegue

1. **Actualiza la URL del backend** en Vercel/Netlify:
   - Ve a **Settings** → **Environment Variables**
   - Agrega: `VITE_API_URL` = `https://tu-backend-url.render.com` (o tu URL de backend)

2. **Comparte tu link:**
   - Frontend: `https://tu-proyecto.vercel.app`
   - Este link funciona desde cualquier dispositivo (móvil, tablet, computadora)

---

## 🎉 ¡Listo!

Tu aplicación estará disponible en internet y podrás acceder desde cualquier dispositivo con el link que te proporcione Vercel o Netlify.

