# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.4.1

FROM node:${NODE_VERSION}

WORKDIR /opt/random-notionify-slack

ENV TZ=Asia/Tokyo

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Run the application.
CMD node src/index.js