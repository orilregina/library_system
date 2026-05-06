function requestAnswer(question) {
  return wx.cloud
    .callFunction({
      name: "answerBook",
      data: { question },
    })
    .then((res) => {
      const payload = res.result || {};
      if (payload.success) {
        return payload.data;
      }

      throw new Error(payload.message || "暂时没有收到清晰的回应，请稍后再试");
    })
    .catch((error) => {
      if (error && error.message) {
        throw error;
      }

      throw new Error("云函数调用失败，请稍后重试");
    });
}

module.exports = {
  requestAnswer,
};
