FROM node:16 as builder
COPY package*.json  ./

RUN npm install --force && mkdir /app && mv ./node_modules ./app

WORKDIR /app

COPY . .

RUN npm run build

RUN npm run test

FROM nginx:alpine

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]