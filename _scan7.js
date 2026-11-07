const fs = require("fs");
const t = fs.readFileSync("D:/alulu/assets1/public/assets/lunara-app-v129.js", "utf8");
function all(k, max = 8) { let i = -1; const a = []; while ((i = t.indexOf(k, i + 1)) >= 0 && a.length < max) a.push(i); return a; }
for (const k of ["function compileWorldbookContext", "byPosition", "always", 'defineStore("world', "wbStore", "worldbookEntries", "normalizeWorldbook", "charIds:", 'useStore("wb"']) {
  console.log(k.padEnd(34), all(k, 8).join(",") || "-");
}
const i = t.indexOf("function compileWorldbookContext");
console.log("\n===== compileWorldbookContext =====");
console.log(t.slice(i, i + 2600));
