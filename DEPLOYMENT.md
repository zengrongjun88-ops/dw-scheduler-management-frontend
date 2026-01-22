# 前端部署文档

## 部署方式

### 方式一: Nginx部署

#### 1. 构建生产版本

```bash
npm run build
```

构建后会在 `dist` 目录生成静态文件。

#### 2. Nginx配置

```nginx
server {
    listen 80;
    server_name scheduler-frontend.example.com;
    
    # 静态文件目录
    root /var/www/scheduler-frontend/dist;
    index index.html;
    
    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### 3. 部署命令

```bash
# 构建
npm run build

# 复制到服务器
scp -r dist/* user@server:/var/www/scheduler-frontend/dist/

# 重启Nginx
ssh user@server "sudo nginx -s reload"
```

### 方式二: Docker部署

#### 1. 创建Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 创建nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 3. 构建和运行

```bash
# 构建镜像
docker build -t scheduler-frontend:latest .

# 运行容器
docker run -d \
  --name scheduler-frontend \
  -p 80:80 \
  scheduler-frontend:latest
```

### 方式三: Docker Compose部署

#### docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: scheduler-frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=/api
    depends_on:
      - backend
    networks:
      - scheduler-network

  backend:
    image: scheduler-backend:latest
    container_name: scheduler-backend
    ports:
      - "8080:8080"
    networks:
      - scheduler-network

networks:
  scheduler-network:
    driver: bridge
```

#### 启动

```bash
docker-compose up -d
```

## 环境变量配置

### 开发环境

`.env.development`:
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=调度管理系统
```

### 生产环境

`.env.production`:
```
VITE_API_BASE_URL=/api
VITE_APP_TITLE=调度管理系统
```

## 性能优化

### 1. 代码分割

Vite自动进行代码分割，无需额外配置。

### 2. 静态资源优化

- 图片压缩
- 使用WebP格式
- 启用CDN加速

### 3. Gzip压缩

在Nginx中启用Gzip压缩，减小传输体积。

### 4. 缓存策略

- HTML文件: 不缓存（no-cache）
- JS/CSS文件: 长期缓存（1年）
- 图片等静态资源: 长期缓存

## 监控与日志

### 1. 访问日志

Nginx访问日志: `/var/log/nginx/access.log`

### 2. 错误日志

Nginx错误日志: `/var/log/nginx/error.log`

### 3. 性能监控

可集成以下工具:
- Google Analytics
- Sentry (错误追踪)
- Prometheus + Grafana (性能监控)

## 故障排查

### 问题1: 页面空白

**可能原因**:
- 路由配置错误
- 静态资源路径错误
- API请求失败

**解决方案**:
1. 检查浏览器控制台错误
2. 检查Nginx配置的root路径
3. 检查API代理配置

### 问题2: API请求失败

**可能原因**:
- 后端服务未启动
- CORS配置错误
- Nginx代理配置错误

**解决方案**:
1. 检查后端服务状态
2. 检查Nginx proxy_pass配置
3. 检查后端CORS配置

### 问题3: 静态资源404

**可能原因**:
- 构建后的dist目录未正确复制
- Nginx root路径配置错误

**解决方案**:
1. 确认dist目录存在且有内容
2. 检查Nginx root配置
3. 检查文件权限

## 备份与恢复

### 备份

```bash
# 备份dist目录
tar -czf scheduler-frontend-$(date +%Y%m%d).tar.gz dist/
```

### 恢复

```bash
# 解压备份文件
tar -xzf scheduler-frontend-20260121.tar.gz -C /var/www/scheduler-frontend/
```

## 安全加固

### 1. HTTPS配置

```nginx
server {
    listen 443 ssl http2;
    server_name scheduler-frontend.example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # SSL配置...
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name scheduler-frontend.example.com;
    return 301 https://$server_name$request_uri;
}
```

### 2. 安全头

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### 3. 限流

```nginx
limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

location / {
    limit_req zone=one burst=20 nodelay;
    # ...
}
```

## 更新流程

1. 拉取最新代码
2. 安装依赖
3. 构建生产版本
4. 备份当前版本
5. 部署新版本
6. 验证功能
7. 如有问题，回滚到备份版本

```bash
# 更新脚本
#!/bin/bash
set -e

echo "拉取最新代码..."
git pull origin main

echo "安装依赖..."
npm install

echo "构建生产版本..."
npm run build

echo "备份当前版本..."
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz /var/www/scheduler-frontend/dist

echo "部署新版本..."
rm -rf /var/www/scheduler-frontend/dist
cp -r dist /var/www/scheduler-frontend/

echo "重启Nginx..."
sudo nginx -s reload

echo "部署完成!"
```

---

**文档结束**
