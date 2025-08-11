// server.js — SpaceMedia SSO-style redirect (Render-friendly)
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// === ENV: set these on Render ===
// Required
const BASE   = process.env.SPACEMEDIA_BASE_URL || "https://distro.artistamp.org";
// Use either a static bearer token OR (later) your API key+secret to auto-fetch one:
let TOKEN    = process.env.SPACEMEDIA_TOKEN || "";
const KEY    = process.env.SPACEMEDIA_KEY || "";      // optional
const SECRET = process.env.SPACEMEDIA_SECRET || "";   // optional

async function getToken() {
  if (TOKEN) return TOKEN;
  if (!KEY || !SECRET) throw new Error("No SPACEMEDIA_TOKEN or KEY/SECRET set");
  const r = await fetch(`${BASE}/api/v1/token`, {
    method: "POST",
    headers: { "X-Api-Key": f423b755-d3f2-4474-8f36-a31c20acf769, "X-Api-Secret": kP7oGKCBluMog4pNW8gaeAixSWJfXBoxYx7TpGwQ }
  });
  if (!r.ok) throw new Error(`Token fetch failed: ${r.status} ${await r.text()}`);
  const data = await r.json();
  TOKEN = data.token;
  return TOKEN;
}

// Health check (for sanity)
app.get("/health", (_req, res) => res.json({ ok: true, at: new Date().toISOString() }));

// Main entry: GHL menu should link here
app.get("/login-spacemedia", async (_req, res) => {
  try {
    await getToken(); // ensures token exists (or refreshes)
    // Simple: send user to SpaceMedia home (or change to a deep link if you have one)
    return res.redirect(`${BASE}/`);
  } catch (e) {
    return res.status(500).send("SSO error: " + e.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("SSO gateway running on :" + PORT));
