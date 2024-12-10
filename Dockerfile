# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Strapi admin panel
RUN npm run build

# Expose the port Strapi will run on
EXPOSE 1337

# Start the Strapi application
CMD ["npm", "start"]