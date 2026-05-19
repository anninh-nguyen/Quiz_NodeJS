FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
RUN npx prisma generate
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm start"]
# CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npx prisma db seed && npm start"]
