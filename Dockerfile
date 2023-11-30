# FROM nginx:alpine

# # Install npm and node
# RUN apk add --update npm

# # Add bash
# RUN apk add --no-cache bash

# WORKDIR /app

# COPY package.json ./

# RUN npm install

# COPY . .

# # # Make our shell script executable
# RUN chmod +x start.sh

# COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf
# CMD ["/bin/bash", "-c", "/app/start.sh && nginx -g 'daemon off;'"]

FROM node:lts-alpine as build-stage
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
EXPOSE 3005
COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]