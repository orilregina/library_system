const http = require("http");
const { pickOne } = require("./answers");
const {
  PORT,
  HOST,
  NODE_ENV,
  PUBLIC_BASE_URL,
  APP_NAME,
  COMPANY_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  getLaunchChecklist,
} = require("./config");
const { ensureStorage, appendRecord } = require("./storage");

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(payload));
}

function sendError(req, res, statusCode, message) {
  return respond(req, res, statusCode, {
    success: false,
    message,
  });
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1024 * 1024) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function respond(req, res, statusCode, payload) {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url} ${statusCode}`);
  return sendJson(res, statusCode, payload);
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    return sendError(req, res, 400, "Invalid request");
  }

  if (req.method === "OPTIONS") {
    return respond(req, res, 204, {});
  }

  if (req.method === "GET" && req.url === "/health") {
    return respond(req, res, 200, {
      success: true,
      message: "answer-book server is running",
      env: NODE_ENV,
      publicBaseUrl: PUBLIC_BASE_URL,
      launch: getLaunchChecklist(),
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method === "GET" && req.url === "/api/config") {
    return respond(req, res, 200, {
      success: true,
      data: {
        appName: APP_NAME,
        env: NODE_ENV,
        publicBaseUrl: PUBLIC_BASE_URL,
        companyName: COMPANY_NAME,
        contactEmail: CONTACT_EMAIL,
        contactPhone: CONTACT_PHONE,
      },
    });
  }

  if (req.method === "GET" && req.url === "/api/launch-check") {
    return respond(req, res, 200, {
      success: true,
      data: getLaunchChecklist(),
    });
  }

  if (req.method === "POST" && req.url === "/api/answer") {
    try {
      const rawBody = await collectBody(req);
      const body = rawBody ? JSON.parse(rawBody) : {};
      const question = String(body.question || "").trim();

      if (!question) {
        return sendError(req, res, 400, "question is required");
      }

      if (question.length > 60) {
        return sendError(req, res, 400, "question is too long");
      }

      const data = pickOne(question);
      appendRecord(data);
      return respond(req, res, 200, { success: true, data });
    } catch (error) {
      const message =
        error instanceof SyntaxError ? "invalid json body" : error.message;
      return sendError(req, res, 500, message);
    }
  }

  return sendError(req, res, 404, "Not Found");
});

ensureStorage();

const launch = getLaunchChecklist();
if (!launch.ready) {
  console.warn("[launch-check] 未完全满足上线配置：");
  launch.issues.forEach((issue) => {
    console.warn(`- ${issue}`);
  });
}

server.listen(PORT, HOST, () => {
  console.log(`Answer Book server listening on http://${HOST}:${PORT}`);
});
