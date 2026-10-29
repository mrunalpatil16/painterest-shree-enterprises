// server.js — run with: node server.js
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.raw({ type: "*/*", limit: "10mb" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const HF_TOKEN = "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";

// Working segmentation models on HuggingFace
const MODELS = [
 
  "facebook/mask2former-swin-large-ade-semantic",
  "facebook/maskformer-swin-base-ade",
  "mattmdjaga/segformer_b2_clothes",
];

app.post("/api/segment", async (req, res) => {
  const modelIndex = parseInt(req.query.model) || 0;
  const model = MODELS[Math.min(modelIndex, MODELS.length - 1)];
  
  console.log(`\n[HF] Trying: ${model}`);
  console.log(`[HF] Image size: ${req.body.length} bytes`);

  try {
    const url = `https://api-inference.huggingface.co/models/${model}`;
    console.log(`[HF] POST → ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
      body: req.body,
    });

    const text = await response.text();
    console.log(`[HF] Status: ${response.status}`);
    console.log(`[HF] Response: ${text.slice(0, 300)}`);

    res.status(response.status).type("application/json").send(text);
  } catch (err) {
    console.error("[HF] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("✅ Server running at http://localhost:3001");
  console.log("HF Token:", HF_TOKEN.slice(0, 10) + "...");
});
