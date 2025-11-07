# 📸 Cómo incluir la imagen de Taki con Penacho

## Opción 1: Carpeta Public (MÁS FÁCIL) ✅

1. **Guarda tu imagen** con el nombre `taki-penacho.png` (o `.jpg`, `.webp`) en:
   ```
   takemlink/frontend/public/taki-penacho.png
   ```

2. **El código ya está listo** - La imagen se mostrará automáticamente.

3. **Formatos soportados**: `.png`, `.jpg`, `.jpeg`, `.webp`

---

## Opción 2: Carpeta Assets (Alternativa)

Si prefieres usar la carpeta `assets`:

1. **Guarda tu imagen** en:
   ```
   takemlink/frontend/src/assets/taki-penacho.png
   ```

2. **Agrega el import** al inicio del archivo `PortalPrincipal.jsx`:
   ```javascript
   import takiImage from '../assets/taki-penacho.png';
   ```

3. **Cambia la ruta** en el `<img>`:
   ```javascript
   <img
     src={takiImage}
     alt="Taki con penacho de plumas"
     ...
   />
   ```

---

## 📁 Estructura de Carpetas

```
takemlink/
└── frontend/
    ├── public/
    │   └── taki-penacho.png  ← OPCIÓN 1 (Recomendada)
    └── src/
        ├── assets/
        │   └── taki-penacho.png  ← OPCIÓN 2
        └── pages/
            └── PortalPrincipal.jsx
```

---

## ✅ Verificación

Después de guardar la imagen:
1. Reinicia el servidor de desarrollo si está corriendo
2. Recarga la página en el navegador
3. La imagen debería aparecer automáticamente

---

## 🎨 Tamaño Recomendado

- **Ancho**: 400-600px
- **Alto**: 500-700px
- **Formato**: PNG con fondo transparente (preferible) o JPG
- **Resolución**: 72-150 DPI (suficiente para web)

---

## ⚠️ Si la imagen no aparece

1. Verifica que el nombre del archivo sea exactamente `taki-penacho.png`
2. Verifica que esté en la carpeta correcta (`public/`)
3. Revisa la consola del navegador (F12) para ver errores
4. Reinicia el servidor de desarrollo

