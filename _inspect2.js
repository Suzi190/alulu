const fs = require("fs");
const t = fs.readFileSync("D:/alulu/assets1/public/assets/lunara-app-v129.js", "utf8");

// find the ls helper definition
const cands = ["const ls=", "ls={get(", "function lsGet", "LS_PREFIX", "lulu:ls", "localStorage.setItem("];
for (const c of cands) {
  let i = -1, n = 0;
  while ((i = t.indexOf(c, i + 1)) >= 0 && n < 3) {
    console.log("=== " + c + " @ " + i);
    console.log(t.slice(Math.max(0, i - 200), i + 400));
    console.log();
    n++;
  }
}
