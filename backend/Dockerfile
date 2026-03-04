FROM node:20-alpine AS base

WORKDIR /app

# 先拷贝 package 文件，加快缓存
COPY package.json ./
COPY package-lock.json ./

RUN npm install --production

# 拷贝源码
COPY . .

# 环境（可以按需在 compose 里覆盖）
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "server.js"]
