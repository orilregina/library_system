const fs = require("fs");
const path = require("path");
const { DATA_DIR } = require("./config");

const RECORDS_PATH = path.join(DATA_DIR, "records.json");

function ensureStorage() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(RECORDS_PATH)) {
    fs.writeFileSync(RECORDS_PATH, "[]", "utf8");
  }
}

function readRecords() {
  ensureStorage();
  try {
    const raw = fs.readFileSync(RECORDS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function appendRecord(record) {
  const records = readRecords();
  records.unshift(record);
  fs.writeFileSync(RECORDS_PATH, JSON.stringify(records.slice(0, 200), null, 2), "utf8");
}

module.exports = {
  ensureStorage,
  appendRecord,
};
