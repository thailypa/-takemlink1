FROM node:18-alpine

WORKDIR /app

# Copiar solo la carpeta backend
COPY backend/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del backend
COPY backend/ .

# Exponer el puerto
EXPOSE 5000

# Comando para iniciar
CMD ["npm", "start"]

