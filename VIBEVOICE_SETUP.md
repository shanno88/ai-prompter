# VibeVoice TTS 集成指南

本指南说明如何部署和使用 VibeVoice TTS 服务。

## 快速开始

### 1. 启动 VibeVoice TTS 服务

使用 Docker Compose 启动 TTS 服务（需要 NVIDIA GPU）：

```bash
docker-compose -f docker-compose.tts.yml up -d
```

首次启动会下载模型，可能需要几分钟。

### 2. 配置环境变量

在 `.env` 文件中添加：

```env
VIBEVOICE_BASE_URL=http://localhost:8080
VIBEVOICE_TIMEOUT_MS=60000
```

### 3. 启动应用

```bash
# 后端
cd backend && npm start

# 前端（另一个终端）
cd frontend && npm run dev
```

## API 端点

### POST /api/tts

生成语音文件。

**请求体：**
```json
{
  "text": "要转换的文本内容",
  "voice": "alloy",
  "format": "mp3",
  "skipClean": false
}
```

**参数说明：**
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| text | string | 是 | - | 要转换的文本（最多 3000 字符） |
| voice | string | 否 | alloy | 语音风格 |
| format | string | 否 | mp3 | 音频格式（mp3/wav） |
| skipClean | boolean | 否 | false | 是否跳过文本清理 |

**响应：**
```json
{
  "success": true,
  "audioUrl": "/api/audio/tts_1234567890_abc123.mp3",
  "format": "mp3",
  "voice": "alloy",
  "textLength": 100,
  "createdAt": "2026-02-22T00:00:00.000Z"
}
```

### GET /api/tts/health

检查 TTS 服务健康状态。

## 测试

### 使用 curl 测试

```bash
# 测试 TTS 服务健康状态
curl http://localhost:3001/api/tts/health

# 生成语音
curl -X POST http://localhost:3001/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "你好，这是一个测试。"}' \
  | jq

# 直接获取音频文件
curl -X POST http://localhost:8080/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-4o-mini-tts", "input": "你好，这是测试", "voice": "alloy"}' \
  --output test.mp3
```

### 前端测试

1. 在编辑器中输入文本
2. 点击顶部导航栏的「生成语音」按钮
3. 等待生成完成后，音频播放器会自动出现

## 文本清理规则

系统会自动清理文本中的播感标注符号：

| 符号 | 处理方式 |
|------|----------|
| `|` | 替换为 `，` |
| `||` | 替换为 `。` |
| `*文本*` | 移除星号，保留文本 |
| `↑` `↓` | 移除 |
| `【文本】` | 移除 |
| `(建议改为：xxx)` | 移除 |
| `①②③...` | 移除 |
| `（约3秒）` | 移除 |

## 故障排除

### TTS 服务无法连接

1. 检查 Docker 容器是否运行：`docker ps`
2. 检查日志：`docker-compose -f docker-compose.tts.yml logs`
3. 确认端口 8080 未被占用

### 生成超时

1. 检查 GPU 是否可用：`nvidia-smi`
2. 增加超时时间：`VIBEVOICE_TIMEOUT_MS=120000`

### 音频文件无法播放

1. 检查 `/api/audio/` 路径是否正确
2. 确认文件已生成：`ls backend/public/audio/`

## 生产部署建议

1. **反向代理**：使用 Nginx 代理 TTS 服务
2. **存储**：将音频文件存储到 S3/OSS 等对象存储
3. **限流**：添加 API 限流保护
4. **监控**：添加日志和性能监控
