# Base image with pnpm installed
FROM node:26.7.0-slim AS base
WORKDIR /app
COPY package.json ./
RUN npm install --global "$(node -p "require('./package.json').packageManager")"

# ----------------------
# 1. Install dependencies
# ----------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
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
FROM node:26.7.0-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only the build output
COPY --from=builder /app/.output ./.output

# ----------------------
# Pass build-time vars to runtime
# ----------------------

# ARG MYVAR
# ENV MYVAR=${MYVAR}
USER node
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD ["node", "-e", "const p=process.env.NITRO_PORT??process.env.PORT??3000;fetch(`http://127.0.0.1:${p}/health`).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

# ----------------------
# Expose and run
# ----------------------
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
