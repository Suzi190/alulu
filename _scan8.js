const fs = require("fs");
const t = fs.readFileSync("D:/alulu/assets1/public/assets/lunara-app-v129.js", "utf8");
function all(k, max = 8) { let i = -1; const a = []; while ((i = t.indexOf(k, i + 1)) >= 0 && a.length < max) a.push(i); return a; }
for (const k of ["useWBStore=defineStore", "blocksByPosition", "hardRule", "system-top", "before-char", "after-char"]) {
  console.log(k.padEnd(26), all(k, 10).join(",") || "-");
}
const i = t.indexOf("useWBStore=defineStore");
console.log("\n===== WB store def =====");
console.log(t.slice(i, i + 3200));
