const { getBaseUrl } = require("./config");

const BASE_URL = getBaseUrl();

function requestAnswer(question) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/answer`,
      method: "POST",
      data: { question },
      timeout: 10000,
      header: {
        "content-type": "application/json",
      },
      success: (res) => {
        const data = res.data || {};
        if (res.statusCode >= 200 && res.statusCode < 300 && data.success) {
          resolve(data.data);
          return;
        }
        reject(new Error(data.message || "暂时没有收到清晰的回应，请稍后再试"));
      },
      fail: () => {
        reject(new Error("网络连接不稳定，请检查后重试"));
      },
    });
  });
}

module.exports = {
  BASE_URL,
  requestAnswer,
};
