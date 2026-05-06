const { getLaunchChecklist } = require("./config");

const result = getLaunchChecklist();

if (result.ready) {
  console.log("Launch check passed.");
  process.exit(0);
}

console.log("Launch check failed. Missing items:");
result.issues.forEach((issue) => {
  console.log(`- ${issue}`);
});

process.exit(1);
