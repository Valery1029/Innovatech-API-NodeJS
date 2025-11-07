# Usar imagen base de Node.js
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (más confiable)
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer el puerto de la API
EXPOSE 5040

# Comando para iniciar la API
CMD ["node", "index.js"]
