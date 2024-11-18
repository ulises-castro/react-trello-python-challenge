# Firt stage
FROM node:21-alpine AS prod

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

RUN npm run build

# Second stage
FROM nginx:alpine

WORKDIR /usr/local/bin

# Copying files from the first stage "prod"
COPY --from=prod /app/dist /usr/share/nginx/html

COPY custom-nginx.template /etc/nginx/conf.d/

EXPOSE 80 

ENTRYPOINT [ "nginx", "-g", "daemon off;"]
