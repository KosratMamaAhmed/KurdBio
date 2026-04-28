import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// گۆڕانکاری گرنگ: لێرەدا پۆرتەکە دەبێت داینامیک بێت بۆ ئەوەی لەسەر هۆستینگەکان کار بکات
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "Kosrat_Mama_@@92";

// Cloudflare Configuration
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_NAMESPACE_ID = process.env.CLOUDFLARE_NAMESPACE_ID;

app.use(express.json());

// --- Persistent KV Database Access ---
const kv = {
  async get(key: string) {
    if (!CF_API_TOKEN) return null;
    const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_NAMESPACE_ID}/values/${key}`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
        timeout: 8000
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      console.error(`KV GET ERROR [${key}]:`, error.message);
      return null;
    }
  },
  async put(key: string, value: any) {
    if (!CF_API_TOKEN) return;
    const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_NAMESPACE_ID}/values/${key}`;
    try {
      await axios.put(url, value, {
        headers: { 
          Authorization: `Bearer ${CF_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        timeout: 8000
      });
    } catch (error: any) {
      console.error(`KV PUT ERROR [${key}]:`, error.message);
    }
  }
};

// --- API Router ---
const api = express.Router();

api.get("/status", (req, res) => {
  res.json({ 
    online: true, 
    database: CF_API_TOKEN ? "Cloudflare KV" : "Not Configured",
    timestamp: new Date().toISOString()
  });
});

api.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (identifier === "admin" && password === (process.env.ADMIN_PASSWORD || "admin123")) {
      const token = jwt.sign({ id: "admin", role: "admin" }, JWT_SECRET);
      return res.json({ token, user: { id: "admin", username: "admin", isAdmin: true } });
    }

    const user = await kv.get(`user:${identifier}`);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "ناو یان تێپەڕەوشە هەڵەیە" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, isAdmin: false } });
  } catch (err: any) {
    res.status(500).json({ error: "هەڵەی سێرڤەر: " + err.message });
  }
});

api.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await kv.get(`user:${username}`);
    if (existing) return res.status(400).json({ error: "ئەم ناوە پێشتر بەکارهێنراوە" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = "u_" + Date.now();
    const newUser = { id: userId, username, email, password: hashedPassword };
    
    await kv.put(`user:${username}`, newUser);
    await kv.put(`user:${email}`, newUser);
    
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: "تۆمارکردن سەرکەوتوو نەبوو" });
  }
});

api.all("*", (req, res) => res.status(404).json({ error: "API Route Not Found" }));

// --- App Entry Point ---
async function bootstrap() {
  app.use("/api", api);

  // گۆڕانکاری گرنگ بۆ خوێندنەوەی فایلەکانی React بە دروستی
  const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true";
  
  if (isProduction) {
    const distPath = path.join(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
    } else {
      console.error("فۆڵدەری 'dist' نەدۆزرایەوە! پێویستە 'npm run build' بکەیت.");
    }
  } else {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite middleware failed to load, API remains active.");
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n[SERVER RUNNING] Port: ${PORT}\n`);
  });
}

bootstrap().catch(err => {
  console.error("Critical Start Error:", err);
});