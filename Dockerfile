# Stage 1: Build
FROM node:18 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project (including the `src` directory) to the container
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Run
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Run the Next.js app
CMD ["npm", "start"]
