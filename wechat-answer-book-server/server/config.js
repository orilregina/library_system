const fs = require("fs");
const path = require("path");

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf8");
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const equalIndex = line.indexOf("=");
    if (equalIndex <= 0) {
      continue;
    }

    const key = line.slice(0, equalIndex).trim();
    const value = line.slice(equalIndex + 1).trim();

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const NODE_ENV = process.env.NODE_ENV || "development";
const DATA_DIR = path.resolve(
  process.cwd(),
  process.env.DATA_DIR || "./server/data"
);
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "";
const APP_NAME = process.env.APP_NAME || "月影答案书";
const COMPANY_NAME = process.env.COMPANY_NAME || "待填写运营主体";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "待填写联系邮箱";
const CONTACT_PHONE = process.env.CONTACT_PHONE || "待填写客服电话";

function getLaunchChecklist() {
  const issues = [];

  if (!PUBLIC_BASE_URL) {
    issues.push("PUBLIC_BASE_URL 未设置");
  }

  if (PUBLIC_BASE_URL.includes("example.com")) {
    issues.push("PUBLIC_BASE_URL 仍是示例域名");
  }

  if (NODE_ENV === "production" && HOST !== "127.0.0.1" && HOST !== "0.0.0.0") {
    issues.push("HOST 建议设置为 127.0.0.1 或 0.0.0.0");
  }

  if (COMPANY_NAME.includes("待填写")) {
    issues.push("COMPANY_NAME 未设置");
  }

  if (CONTACT_EMAIL.includes("待填写")) {
    issues.push("CONTACT_EMAIL 未设置");
  }

  if (CONTACT_PHONE.includes("待填写")) {
    issues.push("CONTACT_PHONE 未设置");
  }

  return {
    ready: issues.length === 0,
    issues,
  };
}

module.exports = {
  PORT,
  HOST,
  NODE_ENV,
  DATA_DIR,
  PUBLIC_BASE_URL,
  APP_NAME,
  COMPANY_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  getLaunchChecklist,
};
