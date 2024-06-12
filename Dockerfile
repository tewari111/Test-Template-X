# Use an official Node.js image as a base
FROM node:18-alpine

# Create and change to the app directory
WORKDIR /app

# Copy package.json and yarn.lock first for caching purposes
COPY package.json yarn.lock ./

# Install dependencies using Yarn
#RUN yarn install --frozen-lockfile
RUN yarn add chalk

# Copy the rest of the application code to the container
COPY . .

# Build the app
RUN yarn build

# Debug: List contents of the dist directory
RUN ls -al dist

# Install 'serve' globally to serve the static files
RUN yarn global add serve

# Expose the desired port (e.g., 3000 or any other)
EXPOSE 3000

# Serve the application on the specified port
CMD ["serve", "-s", "dist", "-l", "3000"]