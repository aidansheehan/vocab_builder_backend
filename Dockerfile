# NodeJS version
FROM node:16.3.0-alpine

# Create app directory
WORKDIR /

# Install app dependencies
COPY package*.json ./
COPY nodemon.json ./
COPY tsconfig.json ./
COPY src ./src

# Install all dependencies
RUN npm install
RUN npm install -g nodemon

# Bundle app source
COPY . .

# port
EXPOSE 8000

# Start
CMD [ "npm", "run", "dev" ]