FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js ./
COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
EXPOSE 5000
CMD ["npm", "start"]
