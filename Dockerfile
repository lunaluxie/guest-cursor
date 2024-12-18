# Use the official Node.js image as the base image
FROM node:22-alpine

# Copy app
COPY . /app

# Set the working directory
WORKDIR /app

# Install the dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 7171

# Command to run the application
CMD ["npm", "start"]