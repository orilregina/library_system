const answers = [
  {
    answer: "先把灯点亮，再决定要不要走远。",
    cardName: "月灯守望者",
    orientation: "正位",
    keywords: ["观察", "慢行", "边界"],
    interpretation: "你不必马上给出最终答案。先确认事实、情绪和可用资源，再做下一步选择。",
    accent: "#e8c77a",
  },
  {
    answer: "真正的门，通常在你安静下来之后才出现。",
    cardName: "金门之钥",
    orientation: "正位",
    keywords: ["机会", "耐心", "开启"],
    interpretation: "眼前的机会需要准备，而不是冲动。把问题拆小，你会更容易看见入口。",
    accent: "#d8aa63",
  },
  {
    answer: "此刻最重要的不是胜负，而是把心中的秤放平。",
    cardName: "星纹天秤",
    orientation: "正位",
    keywords: ["平衡", "取舍", "清醒"],
    interpretation: "如果你正在纠结，试着写下每个选项的代价。清晰比焦虑更有力量。",
    accent: "#cfd6e6",
  },
  {
    answer: "你已经听见答案，只是还没有允许自己相信它。",
    cardName: "回声女祭司",
    orientation: "正位",
    keywords: ["直觉", "内在", "确认"],
    interpretation: "给自己一点独处时间。重复出现的感受，可能正在提醒你注意真实需求。",
    accent: "#9ea8ff",
  },
  {
    answer: "风暴不是拒绝你前进，而是在提醒你换一种姿势。",
    cardName: "驯风者",
    orientation: "逆位",
    keywords: ["调整", "缓冲", "韧性"],
    interpretation: "计划可以被修改，目标不必立刻放弃。先减少阻力，再重新发力。",
    accent: "#8ab6ff",
  },
  {
    answer: "答案藏在重复出现的小事里。",
    cardName: "星屑手稿",
    orientation: "正位",
    keywords: ["线索", "复盘", "记录"],
    interpretation: "最近的细节值得被记录。你可能已经在日常里看见了下一步的方向。",
    accent: "#9cc6ff",
  },
  {
    answer: "把想要保护的东西说清楚，关系会更轻。",
    cardName: "玫瑰静默",
    orientation: "正位",
    keywords: ["表达", "温柔", "关系"],
    interpretation: "沉默有时是休息，有时是误会。选择合适的语气，把真实想法说出来。",
    accent: "#f19cb5",
  },
  {
    answer: "今天适合收拢，而不是扩张。",
    cardName: "夜幕披风",
    orientation: "逆位",
    keywords: ["整理", "节制", "复原"],
    interpretation: "把未完成的事情收尾，比开启新计划更重要。能量恢复后，判断会更稳定。",
    accent: "#8c7bff",
  },
  {
    answer: "你要找的不是完美答案，而是能开始行动的答案。",
    cardName: "晨光柱石",
    orientation: "正位",
    keywords: ["行动", "确定", "基础"],
    interpretation: "先做一个低风险的小尝试。真实反馈会比反复设想更快带来方向。",
    accent: "#f4a261",
  },
  {
    answer: "不要急着证明自己，先照顾好自己的节奏。",
    cardName: "炉边灯盏",
    orientation: "正位",
    keywords: ["休息", "稳定", "自持"],
    interpretation: "你需要的可能不是更多压力，而是一段可以恢复秩序的时间。",
    accent: "#ff9c7a",
  },
  {
    answer: "如果它一直让你变小，就该重新评估它的位置。",
    cardName: "边界之剑",
    orientation: "正位",
    keywords: ["边界", "勇气", "判断"],
    interpretation: "尊重不应以长期消耗为代价。把底线说清楚，是一种成熟的保护。",
    accent: "#d7c29e",
  },
  {
    answer: "旧问题不会靠新包装消失，它需要被认真看见。",
    cardName: "镜月之环",
    orientation: "逆位",
    keywords: ["面对", "诚实", "修正"],
    interpretation: "先承认问题存在，再谈改变。逃开会短暂轻松，面对才会真正松动。",
    accent: "#79d3d7",
  },
];

function pickOne(question) {
  const normalized = String(question || "").trim();
  const seed = normalized
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), Date.now());
  const item = answers[seed % answers.length];

  return {
    id: String(Date.now()),
    question: normalized,
    answer: item.answer,
    cardName: item.cardName,
    orientation: item.orientation,
    keywords: item.keywords,
    interpretation: item.interpretation,
    accent: item.accent,
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  pickOne,
};
