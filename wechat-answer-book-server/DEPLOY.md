# 部署清单

## 一定要你来准备的内容

以下内容我不能替你生成，必须由你或实际运营方准备：

- 微信小程序正式 `AppID`
- 微信公众平台登录账号与主体认证
- 正式 API 域名
- 云服务器
- HTTPS 证书
- 运营主体名称
- 联系邮箱或客服电话
- 小程序名称、头像、简介、服务类目
- 微信后台隐私指引填写内容

## 1. 微信公众平台准备

- 注册并认证微信小程序主体。
- 获取正式 AppID。
- 配置小程序名称、头像、简介和服务类目。
- 配置服务器域名：`request` 域名必须是 HTTPS。
- 配置隐私指引，并与小程序内隐私说明保持一致。

## 2. 前端配置

修改 `miniprogram/project.config.json`：

```json
"appid": "你的正式 AppID"
```

修改 `miniprogram/utils/config.js`：

```js
const ENV_BASE_URL = {
  develop: "http://127.0.0.1:3000",
  trial: "https://你的正式域名",
  release: "https://你的正式域名",
};
```

正式提审前确认：

- `project.config.json` 中 `urlCheck` 为 `true`
- 不再使用 `touristappid`
- 体验版和正式版不再使用 `127.0.0.1`
- 微信公众平台已添加相同 HTTPS 域名

## 3. 后端服务器

根目录创建 `.env`，可参考 `.env.example`：

```text
PORT=3000
HOST=127.0.0.1
NODE_ENV=production
DATA_DIR=./server/data
PUBLIC_BASE_URL=https://你的正式域名
APP_NAME=月影答案书
COMPANY_NAME=你的运营主体名称
CONTACT_EMAIL=你的联系邮箱
CONTACT_PHONE=你的客服电话
```

启动：

```bash
npm start
```

PM2：

```bash
pm2 start ecosystem.config.js
pm2 save
```

## 4. Nginx

参考 `deploy/nginx.answer-book.conf`，替换：

- `api.example.com`
- 证书路径
- 反向代理端口

检查：

```bash
nginx -t
systemctl reload nginx
```

## 5. 后端自检

服务启动后，访问：

```text
GET /api/launch-check
```

如果返回：

```json
{
  "success": true,
  "data": {
    "ready": false,
    "issues": [...]
  }
}
```

说明仍有示例项未替换，不建议提交审核。

## 6. 上线前测试

- `GET /health` 返回 `success: true`
- `GET /api/launch-check` 返回 `ready: true`
- 微信开发者工具可正常请求线上 HTTPS 接口
- 首页抽取、历史记录、清空记录可用
- 关于页和隐私页文案无占位信息
- iPhone 小屏、Android 常见机型显示正常
- 断网、接口超时、接口错误时有明确提示

## 7. 提审材料

建议准备：

- 首页截图
- 抽取结果截图
- 关于页截图
- 隐私说明截图
- 功能说明
- 审核员体验路径

## 8. 风险与建议

- 不要在提审文案中承诺预测未来。
- 不要提供医疗、投资、法律等专业决策建议。
- 若后续接入 AI，应增加内容安全审核、敏感词过滤和兜底话术。
- 当前后端使用本地 JSON 文件，正式长期运营建议改为数据库并加入备份。
