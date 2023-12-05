FROM node:18.2.0-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

RUN npm run test

# Expose port 80 to the outside world
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "run", "prod"]
