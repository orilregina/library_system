const { requestAnswer } = require("../../utils/api");

Page({
  data: {
    question: "",
    loading: false,
    result: null,
    history: [],
  },

  onLoad() {
    const history = wx.getStorageSync("answer-history") || [];
    this.setData({ history });
  },

  onQuestionInput(event) {
    this.setData({
      question: event.detail.value,
    });
  },

  async onDrawTap() {
    const question = this.data.question.trim();

    if (!question) {
      wx.showToast({
        title: "请先写下你的问题",
        icon: "none",
      });
      return;
    }

    this.setData({ loading: true });

    try {
      const result = await requestAnswer(question);
      const history = [result, ...this.data.history].slice(0, 6);

      wx.setStorageSync("answer-history", history);
      this.setData({
        result,
        history,
      });

      wx.vibrateShort({ type: "medium" });
    } catch (error) {
      wx.showToast({
        title: error.message || "暂时无法抽取答案",
        icon: "none",
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  onClearHistory() {
    wx.showModal({
      title: "清空记录",
      content: "确定清空本机保存的最近抽取记录吗？",
      confirmText: "清空",
      confirmColor: "#b77932",
      success: (res) => {
        if (!res.confirm) {
          return;
        }

        wx.removeStorageSync("answer-history");
        this.setData({ history: [] });
        wx.showToast({
          title: "已清空",
          icon: "success",
        });
      },
    });
  },
});
