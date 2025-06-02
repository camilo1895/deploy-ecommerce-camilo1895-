# Node.js 20 
FROM node:20

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copia solo archivos de dependencias (optimiza caché)
COPY package*.json ./

# Instala dependencias de producción
RUN npm install 

# Copia el resto del código 
COPY . .

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]
