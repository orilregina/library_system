# 月影答案书微信小程序

当前桌面项目已改造成微信云开发免服务器版。

> 当前主路径：`miniprogram + cloudfunctions`

## 当前状态

这套项目已经具备：

- 小程序前端页面与基础交互
- 微信云开发初始化
- 云函数 `answerBook`
- 抽卡逻辑迁移到云函数
- 提审文案、云开发导入清单、上线准备文档
- 本地云开发语法检查命令 `npm run check:cloud`

当前项目不再依赖独立后端接口才能运行。

仍然必须由你提供的内容：

- 正式小程序 `AppID`
- 云开发环境 ID
- 运营主体名称
- 微信公众平台类目、简介、头像、隐私指引

## 项目结构

```text
.
├── miniprogram                    # 微信小程序前端
├── cloudfunctions                 # 微信云函数
│   └── answerBook
├── 提审文案.md
├── 云开发版导入与后台配置清单.md
├── 云开发版最终上线缺口清单.md
└── 你必须准备的信息.md
```

## 开发者工具导入

导入目录：

```text
C:\Users\wdryyds\Desktop\wechat-answer-book-docs\miniprogram
```

导入后需要做的事：

1. 把 `miniprogram/project.config.json` 里的 `appid` 改成正式 AppID。
2. 打开 `miniprogram/utils/config.js`，把 `CLOUD_ENV_ID` 改成你的云开发环境 ID。
3. 在微信开发者工具中开通并选择同一个云开发环境。
4. 上传并部署云函数 `answerBook`。

## 本地检查

云开发版语法检查：

```bash
npm run check:cloud
```

## 旧版说明

项目中保留了 `server/`、`deploy/` 等服务器版文件，作为旧版参考。

但当前正式推荐路线是云开发版，不再要求你先准备云服务器、Nginx 和 HTTPS API 域名。
