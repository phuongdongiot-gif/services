FROM node:20-alpine

WORKDIR /app
ARG APP
ENV APP_NAME=${APP}

# Cài đặt toàn bộ dependencies (Vì Nx bundle file nhưng có thể cần dependency runtime hoặc native bindings)
# Do thư mục gốc của Nx dùng chung root package.json
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copy output build từ dist folder của ứng dụng vào trong container
COPY dist/apps/${APP} ./dist

# Standardize port to start API on
EXPOSE ${PORT:-3000}

# Chạy file main
CMD ["sh", "-c", "node dist/main.js"]
