import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { relative, sep } from "node:path";

if (!existsSync("out")) throw new Error("Next.js export directory was not created.");
if (existsSync("dist")) rmSync("dist", { recursive: true, force: true });
cpSync("out", "dist", { recursive: true });
mkdirSync("dist/server", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });
cpSync(".openai/hosting.json", "dist/.openai/hosting.json");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2"
};

const files = [];
const walk = (folder) => {
  for (const name of readdirSync(folder)) {
    const path = `${folder}/${name}`;
    if (statSync(path).isDirectory()) walk(path);
    else files.push(path);
  }
};
walk("out");

const assets = Object.fromEntries(files.map((path) => {
  const url = `/${relative("out", path).split(sep).join("/")}`;
  const extension = path.slice(path.lastIndexOf(".")).toLowerCase();
  return [url, [mime[extension] || "application/octet-stream", readFileSync(path).toString("base64")]];
}));

writeFileSync(
  "dist/server/index.js",
  `const assets = ${JSON.stringify(assets)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname === "/" ? "/index.html" : url.pathname;
    let asset = assets[path];
    if (!asset && !path.includes(".")) asset = assets[path + ".html"];
    if (!asset) return new Response("Not found", { status: 404 });
    const binary = atob(asset[1]);
    const body = Uint8Array.from(binary, char => char.charCodeAt(0));
    return new Response(body, {
      headers: {
        "content-type": asset[0],
        "cache-control": path.includes("/_next/static/") ? "public, max-age=31536000, immutable" : "public, max-age=300"
      }
    });
  }
};
`
);
