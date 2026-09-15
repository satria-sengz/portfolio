// Visual + interaction check for the static export.
// Usage: node scripts/shots.mjs [baseUrl] [outDir]
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://127.0.0.1:4173/";
const out = process.argv[3] ?? "/tmp/shots";
mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--hide-scrollbars", "--disable-gpu"],
});

const errors = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(theme, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  page.on("console", (m) => { if (m.type() === "error") errors.push(`[${theme}] ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`[${theme}] pageerror ${e.message}`));
  await page.goto(`${base}?theme=${theme}`, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await sleep(800);
  return page;
}

// 1. Full pages
for (const [name, vp] of [["desktop", { width: 1280, height: 900 }], ["mobile", { width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 }]]) {
  for (const theme of ["light", "dark"]) {
    const page = await open(theme, vp);
    await page.screenshot({ path: `${out}/${name}-${theme}-full.png`, fullPage: true });
    await page.close();
  }
}

// 2. Sections on desktop light, plus interactions
const page = await open("light", { width: 1280, height: 900 });
const shot = async (sel, file) => {
  const el = await page.$(sel);
  if (!el) { errors.push(`missing ${sel}`); return; }
  await el.scrollIntoView();
  await sleep(300);
  await el.screenshot({ path: `${out}/${file}.png` });
};
await shot("#top", "s1-hero");
await sleep(2500);
await shot("#top", "s1-hero-later");
await shot("#story", "s2-story");
await shot("#skills", "s5-skills");
await shot("#experience", "s6-experience");
await shot("#contact", "s7-contact");

const clickText = async (text) => {
  const ok = await page.evaluate((t) => {
    const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim() === t);
    if (!b) return false;
    b.click();
    return true;
  }, text);
  if (!ok) errors.push(`button not found: ${text}`);
};

await clickText("Read receipt");
await sleep(3500);
await shot("#ocr", "c1-ocr-done");

await clickText("Dispatch a cross-service feature");
await sleep(5500);
await shot("#pipeline", "c2-pipeline-done");

await clickText("Route traffic to Go");
await sleep(4500);
await shot("#go", "c3-go-done");

await clickText("Submit a re-photographed receipt");
await sleep(4000);
await shot("#fraud", "c4-fraud-flagged");
await clickText("Submit the same file again");
await sleep(2000);
await shot("#fraud", "c4-fraud-blocked");

await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
await sleep(600);
await shot("#ocr", "c1-ocr-details");

// Text sanity: counters moved in the hero
const counters = await page.evaluate(() => [...document.querySelectorAll("#top b")].map((b) => b.textContent));
console.log("hero counters:", counters.join(" / "));

await page.close();

// 3. Mobile close-ups with interactions
const m = await open("light", { width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 });
const mshot = async (sel, file) => {
  const el = await m.$(sel);
  if (!el) { errors.push(`missing ${sel}`); return; }
  await el.scrollIntoView();
  await sleep(300);
  await el.screenshot({ path: `${out}/${file}.png` });
};
const mclick = async (text) => {
  const ok = await m.evaluate((t) => {
    const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim() === t);
    if (!b) return false;
    b.click();
    return true;
  }, text);
  if (!ok) errors.push(`mobile button not found: ${text}`);
};
await mshot("#top", "m1-hero");
await mclick("Read receipt");
await sleep(3500);
await mshot("#ocr", "m-ocr-done");
await mclick("Dispatch a cross-service feature");
await sleep(5500);
await mshot("#pipeline", "m-pipeline-done");
await mclick("Route traffic to Go");
await sleep(4500);
await mshot("#go", "m-go-done");
await mclick("Submit the same file again");
await sleep(2000);
await mshot("#fraud", "m-fraud-blocked");
await m.evaluate(() => { document.querySelector("#go details").open = true; });
await sleep(600);
await mshot("#go", "m-go-details");
await m.close();
await browser.close();
console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "no console errors");
