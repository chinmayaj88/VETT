FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

# Generate Prisma client (doesn't need real DB connection)
RUN DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy" npm run prisma:generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

