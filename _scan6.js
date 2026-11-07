const fs = require("fs");
const t = fs.readFileSync("D:/alulu/assets1/public/assets/lunara-app-v129.js", "utf8");
const C = (...a) => String.fromCharCode(...a);

function all(k, max = 10) { let i = -1; const a = []; while ((i = t.indexOf(k, i + 1)) >= 0 && a.length < max) a.push(i); return a; }
console.log("wb=use patterns:", ["wb=useWb", "wb=useWorld", "const wb=", "wb = use", "worldbook", "useWbStore", "WbStore"].map(k => k + ":" + all(k, 5).join("/")).join("  |  "));

function show(label, at, before, after) {
  console.log("\n########## " + label + " @" + at);
  console.log(t.slice(Math.max(0, at - before), at + after));
}
show("LuluCharacterCards use", 1701250, 700, 2100);
show("worldbookContext prompt", 1088500, 700, 1400);
