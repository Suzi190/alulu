const fs = require("fs");
const p = "D:/alulu/assets1/public/assets/lunara-app-v129.js";
const t = fs.readFileSync(p, "utf8");

function show(label, needle, before = 80, after = 700) {
  const i = t.indexOf(needle);
  console.log("=== " + label + " @ " + i);
  if (i >= 0) console.log(t.slice(Math.max(0, i - before), i + after));
  console.log();
}

show("hasLocalAccountForCurrentSession", "function hasLocalAccountForCurrentSession", 40, 900);
show("ensure(force", "async function ensure(force", 0, 200);

// mode read
let i = -1, n = 0;
while ((i = t.indexOf('ls.get("mode")', i + 1)) >= 0 && n < 5) {
  console.log("=== mode read @ " + i);
  console.log(t.slice(Math.max(0, i - 300), i + 200));
  console.log();
  n++;
}

// where mode is written
i = -1; n = 0;
while ((i = t.indexOf('ls.set("mode"', i + 1)) >= 0 && n < 6) {
  console.log("=== mode write @ " + i);
  console.log(t.slice(Math.max(0, i - 260), i + 160));
  console.log();
  n++;
}
