# NodeJS version
FROM node:16.13.2-alpine

# Create app directory
WORKDIR /

# Install app dependencies
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Install all dependencies
RUN npm install

# Bundle app source
COPY . .

# port
EXPOSE 8000

# Start
CMD [ "npm", "run", "start" ]