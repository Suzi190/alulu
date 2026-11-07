const http = require("http");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "preview");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".ico": "image/x-icon"
};
http
  .createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    let f = path.join(root, p);
    if (!f.startsWith(root)) {
      res.writeHead(403);
      return res.end("forbidden");
    }
    fs.stat(f, (e, st) => {
      if (!e && st.isDirectory()) f = path.join(f, "index.html");
      fs.readFile(f, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          return res.end("404 " + p);
        }
        res.writeHead(200, {
          "Content-Type": types[path.extname(f).toLowerCase()] || "application/octet-stream",
          "Cache-Control": "no-store",
          "Service-Worker-Allowed": "/"
        });
        res.end(data);
      });
    });
  })
  .listen(8765, "127.0.0.1", () => console.log("http://localhost:8765  ->  " + root));
