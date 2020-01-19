FROM node:dubnium-alpine3.9

# Create app directory.
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Setup the environment for production.
ENV NODE_ENV development
ENV DEV_PORT 3000

# Bundle application source.
COPY . /usr/src/app

# Install build static assets and clear caches.
RUN npm install 

# Setup the environment
ENV PORT 8080
EXPOSE 8080
ENV NODE_ENV development
ENV MONGO mongodb://172.24.57.33:27017/auth

CMD ["npm", "run", "start"]