# 月影答案书微信小程序

当前文件夹是服务器开发版。

> 当前主路径：`miniprogram + server + deploy`

这个版本适合你想保留独立 Node.js 后端、自定义部署、后续扩展数据库和后台管理的场景。

## 包含内容

- `miniprogram/`：小程序前端
- `server/`：Node.js 后端
- `deploy/`：Nginx 配置示例
- `.env.example`：环境变量模板
- `ecosystem.config.js`：PM2 配置
- `DEPLOY.md`：服务器部署清单
- `服务器版最终上线缺口清单.md`：服务器版还缺什么

## 使用方式

1. 启动服务器端
2. 在微信开发者工具导入 `miniprogram/`
3. 配置正式 AppID 与正式 HTTPS API 域名
4. 在微信公众平台配置合法 request 域名

## 当前说明

这个目录与云开发版已经分开。

如果你想走免服务器路线，请使用桌面上的：

```text
C:\Users\wdryyds\Desktop\wechat-answer-book-cloud
```
