# Dockerfile for Data Evolved (Next.js Web App)

# --- Stage 1: Build ---
# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json ./
COPY package-lock.json ./
# If using workspaces/monorepo, copy root package.json and potentially turbo.json
COPY turborepo.json ./
COPY tsconfig.base.json ./
# Copy individual app/package package.json files
COPY apps/web/package.json ./apps/web/
COPY apps/game-ai-genkit/package.json ./apps/game-ai-genkit/
# Copy packages/ if you have shared local packages
COPY packages/common-types/package.json ./packages/common-types/
COPY packages/utils/package.json ./packages/utils/


# Install dependencies for the entire monorepo
# Using --frozen-lockfile (or --ci for npm) is recommended for reproducible builds
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Set build-time arguments for Firebase config (can be passed during `docker build`)
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID

# Make them available as environment variables during the build
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID

# Add other build-time env vars if needed (e.g., GEMINI_API_KEY for Genkit if flows are built here)
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY

# Build the Next.js application (assuming 'web' is your Next.js app workspace)
# If using Turborepo:
RUN npx turbo run build --filter=web...
# Or if building only the web app:
# RUN npm run build --workspace=apps/web
# Or if not using workspaces heavily for build:
# WORKDIR /app/apps/web
# RUN npm run build


# --- Stage 2: Production ---
# Use a smaller base image for the production stage
FROM node:20-alpine

WORKDIR /app

# Set environment to production
ENV NODE_ENV production

# Copy built assets from the builder stage
# The path depends on your Next.js output structure (.next folder)
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
# Copy node_modules (only production dependencies if you prune them in builder stage, or all if not)
# For simplicity, copying all from builder first. For optimization, only copy necessary node_modules.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules


# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
# Change to your Next.js app's start script if different
WORKDIR /app/apps/web
CMD ["npm", "start", "-p", "3000"]

# Note: For Genkit AI flows, you might need a separate Dockerfile or a multi-process setup
# if they run as a separate service. If they are just part of the Next.js API routes,
# this Dockerfile might be sufficient, but ensure all dependencies are included.
# If Genkit runs separately, you'd typically build its app similarly and run `genkit start`.
