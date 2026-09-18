/**
 * cPanel / CloudLinux: Setup Node.js App → Application startup file = server.js
 * Port dolazi iz okruženja (PORT / NODE_PORT).
 *
 * Deploy workflow: Docker build lokalno → upload .next + public (+ ovaj fajl) → Restart.
 * Na serveru NIJESI potreban `next build` ako uploaduješ kompletan `.next` iz Dockera.
 */
"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const { parse } = require("url");
const next = require("next");

const dir = __dirname;
try {
  process.chdir(dir);
} catch (e) {
  console.error("[server.js] process.chdir:", e);
}

const dev = process.env.NEXT_DEV_SERVER === "true";

if (!dev) {
  const buildIdPath = path.join(dir, ".next", "BUILD_ID");
  if (!fs.existsSync(buildIdPath)) {
    console.error(
      "[server.js] Nema produkcijskog builda (nedostaje .next/BUILD_ID).\n" +
        "Uploaduj `.next` iz Docker deploy workflowa, ili pokreni npm run build.\n" +
        `Očekivano: ${buildIdPath}`
    );
    process.exit(1);
  }
}

const hostname = process.env.HOST ?? process.env.BIND_HOST ?? "0.0.0.0";
const port = parseInt(process.env.PORT ?? process.env.NODE_PORT ?? "3000", 10);

const app = next({ dev, dir });
const nextHandler = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        nextHandler(req, res, parsedUrl);
      } catch (e) {
        console.error("request error", req.url, e);
        res.statusCode = 500;
        res.end("internal server error");
      }
    })
    .listen(port, hostname, () => {
      console.log(
        `Next.js listening on http://${hostname}:${port} dev=${dev} dir=${dir}`
      );
    });
});
