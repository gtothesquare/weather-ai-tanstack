# Base image with pnpm installed
FROM node:24-slim AS base
WORKDIR /app
RUN npm install -g pnpm

# ----------------------
# 1. Install dependencies
# ----------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ----------------------
# 2. Build the app
# ----------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ----------------------
# 3. Production runner
# ----------------------
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Writable directory for runtime data
RUN mkdir -p /app/data && \
    chown -R nodejs:nodejs /app/data

# Copy only the build output
COPY --from=builder /app/.output ./.output

# ----------------------
# Pass build-time vars to runtime
# ----------------------

# ARG MYVAR
# ENV MYVAR=${MYVAR}


# ----------------------
# Expose and run
# ----------------------
EXPOSE 3000
USER nodejs
CMD ["node", ".output/server/index.mjs"]