module.exports = {
  apps: [
    {
      name: "answer-book-server",
      script: "./server/index.js",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: 3000,
        DATA_DIR: "./server/data",
        PUBLIC_BASE_URL: "https://api.example.com",
        APP_NAME: "月影答案书",
        COMPANY_NAME: "待填写运营主体",
        CONTACT_EMAIL: "2950532177@qq.com",
        CONTACT_PHONE: "17339804668",
      },
    },
  ],
};
