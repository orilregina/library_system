function getEnvVersion() {
  try {
    const accountInfo = wx.getAccountInfoSync();
    return accountInfo.miniProgram.envVersion || "release";
  } catch (_) {
    return "release";
  }
}

const ENV_VERSION = getEnvVersion();

const ENV_BASE_URL = {
  develop: "http://127.0.0.1:3000",
  trial: "https://api.example.com",
  release: "https://api.example.com",
};

function getBaseUrl() {
  return ENV_BASE_URL[ENV_VERSION] || ENV_BASE_URL.release;
}

module.exports = {
  ENV_VERSION,
  getBaseUrl,
};
