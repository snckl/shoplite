# Use the official Node.js image as the base image
FROM node:20

# Author information
LABEL maintainer="Sinan Çakal <sinan.cakal@protonmail.com>"

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Add Prisma binary cache
RUN npx prisma generate

# Copy the entrypoint script
COPY entrypoint.sh ./entrypoint.sh

# Ensure the entrypoint script is executable
RUN chmod +x ./entrypoint.sh

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the port the app runs on
EXPOSE 3003

# Run the entrypoint script
CMD ["sh", "./entrypoint.sh"]