import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Dev-only plugin that mirrors Vercel's /api serverless behavior locally.
// Each file in /api/*.js with a default async (req, res) handler becomes
// reachable at /api/<basename>. This lets the same code run in Lovable
// preview AND on Vercel without changes.
function vercelApiDevPlugin() {
  const apiDir = path.resolve(__dirname, "api");
  return {
    name: "vercel-api-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) return next();
        try {
          const url = new URL(req.url, "http://localhost");
          const name = url.pathname.replace(/^\/api\//, "").split("/")[0];
          if (!name || name.startsWith("_")) return next();
          const file = path.join(apiDir, name + ".js");
          if (!fs.existsSync(file)) return next();

          // Bust cache so edits hot-reload.
          const mod = await import(
            pathToFileURL(file).href + "?t=" + Date.now()
          );
          const handler = mod.default;
          if (typeof handler !== "function") return next();

          // Build a minimal req/res that matches what Vercel passes.
          const query = Object.fromEntries(url.searchParams.entries());
          const fakeReq = Object.assign(req, { query });
          const fakeRes = {
            statusCode: 200,
            _headers: {},
            setHeader(k, v) {
              this._headers[k.toLowerCase()] = v;
              res.setHeader(k, v);
            },
            status(code) {
              this.statusCode = code;
              res.statusCode = code;
              return this;
            },
            json(data) {
              if (!this._headers["content-type"]) {
                res.setHeader("Content-Type", "application/json");
              }
              res.statusCode = this.statusCode;
              res.end(JSON.stringify(data));
            },
            send(data) {
              res.statusCode = this.statusCode;
              res.end(typeof data === "string" ? data : JSON.stringify(data));
            },
            end(data) {
              res.statusCode = this.statusCode;
              res.end(data);
            },
          };

          await handler(fakeReq, fakeRes);
        } catch (err) {
          console.error("[api dev]", err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ status: false, message: "Dev API handler crashed", error: String(err) })
          );
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), vercelApiDevPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
    port: 8080,
    allowedHosts: true,
  },
});
