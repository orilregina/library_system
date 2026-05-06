const { CLOUD_ENV_ID, CLOUD_TRACE_USER } = require("./utils/config");

App({
  onLaunch() {
    if (!wx.cloud) {
      console.error("请使用支持云开发的微信基础库版本");
      return;
    }

    wx.cloud.init({
      env: CLOUD_ENV_ID,
      traceUser: CLOUD_TRACE_USER,
    });
  },

  globalData: {
    brandName: "月影答案书",
  },
});
