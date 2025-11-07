# 🚀 Guía para Subir el Proyecto TákemLink a GitHub

## 📋 Pasos para Guardar el Proyecto en GitHub

### 1️⃣ Instalar Git (si no lo tienes)

**Windows:**
- Descarga Git desde: https://git-scm.com/download/win
- Instala siguiendo el asistente
- Reinicia tu terminal/IDE

**Verificar instalación:**
```bash
git --version
```

---

### 2️⃣ Crear una Cuenta en GitHub

1. Ve a: https://github.com
2. Crea una cuenta gratuita
3. Confirma tu email

---

### 3️⃣ Inicializar Git en tu Proyecto

Abre una terminal en la carpeta `takemlink` y ejecuta:

```bash
# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Proyecto TákemLink completo"
```

---

### 4️⃣ Crear un Repositorio en GitHub

1. Ve a https://github.com y haz clic en **"New repository"** (botón verde)
2. Nombre del repositorio: `takemlink` (o el que prefieras)
3. Descripción: "Sistema de gestión de residuos y reciclaje con gamificación"
4. **NO marques** "Initialize with README" (ya tienes uno)
5. Haz clic en **"Create repository"**

---

### 5️⃣ Conectar tu Proyecto Local con GitHub

Después de crear el repositorio, GitHub te mostrará comandos. Ejecuta estos:

```bash
# Agregar el repositorio remoto (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/takemlink.git

# Cambiar a la rama main (si es necesario)
git branch -M main

# Subir el código
git push -u origin main
```

---

### 6️⃣ Autenticación

Si te pide usuario y contraseña:
- **Usuario**: Tu usuario de GitHub
- **Contraseña**: Usa un **Personal Access Token** (no tu contraseña normal)

**Para crear un Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Selecciona permisos: `repo` (todos)
4. Copia el token y úsalo como contraseña

---

## 📁 Estructura del Proyecto

```
takemlink/
├── backend/          # Servidor Express.js
├── frontend/         # Aplicación React
├── .gitignore        # Archivos a ignorar
├── README.md         # Documentación principal
└── GUIA_GITHUB.md    # Esta guía
```

---

## ✅ Comandos Útiles

```bash
# Ver estado de los archivos
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de los cambios"

# Subir cambios
git push

# Ver historial
git log

# Ver repositorios remotos
git remote -v
```

---

## 🔗 Tu Link del Proyecto

Una vez subido, tu proyecto estará disponible en:
```
https://github.com/TU_USUARIO/takemlink
```

---

## 🆘 Solución de Problemas

**Error: "git is not recognized"**
- Instala Git desde https://git-scm.com/download/win
- Reinicia tu terminal

**Error: "Permission denied"**
- Verifica tu token de acceso personal
- Asegúrate de tener permisos en el repositorio

**Error: "Repository not found"**
- Verifica que el nombre del repositorio sea correcto
- Verifica que tengas acceso al repositorio

---

## 📝 Notas Importantes

- El archivo `.gitignore` ya está configurado para ignorar `node_modules/` y otros archivos innecesarios
- No subas archivos `.env` con contraseñas o claves secretas
- El proyecto incluye tanto el backend como el frontend

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu proyecto estará guardado en GitHub y podrás compartir el link con cualquiera.

