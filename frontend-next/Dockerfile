# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app

ARG DOCKER=false
ENV DOCKER=$DOCKER

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# 运行阶段
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Next.js 约定的运行时变量，按需补充
ENV PORT=3000

ARG DOCKER=false
ENV DOCKER=$DOCKER

# 只拷贝运行所需文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

CMD ["npm", "start"]
