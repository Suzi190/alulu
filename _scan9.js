const fs = require("fs");
const t = fs.readFileSync("D:/alulu/assets1/public/assets/lunara-app-v129.js", "utf8");
function all(k, max = 12) { let i = -1; const a = []; while ((i = t.indexOf(k, i + 1)) >= 0 && a.length < max) a.push(i); return a; }
for (const k of ["cardImportCards", "worldbookDraft", "importedRoleData(", "cardImportOpen"]) {
  console.log(k.padEnd(22), all(k, 12).join(",") || "-");
}
function show(label, at, before, after) {
  console.log("\n##### " + label + " @" + at);
  console.log(t.slice(Math.max(0, at - before), at + after));
}
show("wbDraft after import", 1705414, 900, 700);
show("wbDraft in save", 1727814, 500, 900);
