# First stage: Dependencies
FROM node:21 as build

WORKDIR /app

# Copy package files and install dependencies as root
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Second stage: Run as non-root user
FROM node:21

WORKDIR /app

# Copy only necessary files from build stage
COPY --from=build /app /app

# Set appropriate ownership
RUN chown -R node:node /app

# Switch to the node user
USER node

EXPOSE 3000
CMD ["npm", "run", "start:dev"]