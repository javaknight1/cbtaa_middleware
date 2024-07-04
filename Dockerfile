FROM node:14-alpine AS builder

WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

FROM node:14-alpine AS server

WORKDIR /app
COPY package* ./

RUN npm install --production
COPY --from=builder ./app/dist ./dist

EXPOSE 8080
CMD ["npm", "start"]