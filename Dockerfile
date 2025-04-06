# Use the official Node.js 22 image
FROM node:22

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY ./src ./src
COPY app.js ./

# Expose the port your app listens on
EXPOSE 4000

# Run the application
CMD ["node", "app.js"]
