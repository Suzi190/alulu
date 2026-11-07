const fs = require("fs");
const path = require("path");

const SRC = "D:/alulu/assets1/public";
const OUT = "D:/alulu/preview";
const BAK = "D:/alulu/backup";

function cp(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) cp(s, d);
    else fs.copyFileSync(s, d);
  }
}

// 1) clean copy
if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
cp(SRC, OUT);
console.log("copied ->", OUT);

// 2) backup original js
const jsRel = "assets/lunara-app-v129.js";
const jsPath = path.join(OUT, jsRel);
fs.mkdirSync(BAK, { recursive: true });
const bakPath = path.join(BAK, "lunara-app-v129.js.orig");
if (!fs.existsSync(bakPath)) fs.copyFileSync(jsPath, bakPath);
console.log("backup ->", bakPath);

let t = fs.readFileSync(jsPath, "utf8");
const before = t.length;

const patches = [
  {
    name: "R1 invite.ensure() always verified",
    from: "async function ensure(force=!1){if(!force&&token.value",
    to: 'async function ensure(force=!1){return checked.value=!0,verified.value=!0,!0;if(!force&&token.value'
  },
  {
    name: "R2 local account always ready",
    from: "function hasLocalAccountForCurrentSession(){try{",
    to: "function hasLocalAccountForCurrentSession(){return!0;try{"
  },
  {
    name: "R3 router guard: no invite/auth redirect",
    from: 'const mode=ls.get("mode"),authed=mode==="guest"||mode==="user";',
    to: 'const mode=ls.get("mode")||"guest",authed=!0;'
  }
];

let ok = true;
for (const p of patches) {
  const count = t.split(p.from).length - 1;
  console.log(p.name, "| matches:", count);
  if (count !== 1) { ok = false; continue; }
  t = t.replace(p.from, p.to);
}

if (!ok) {
  console.log("!!! abort: some patch target not unique");
  process.exit(1);
}

fs.writeFileSync(jsPath, t, "utf8");
console.log("patched js:", before, "->", t.length, "bytes");
console.log("PATCH_OK");
