#!/usr/bin/env node
/**
 * Downloads every binary asset used by the target invitation site into public/.
 * Source: https://tuannhu-savewithlove.io.vn/invitation/groom
 *
 * Usage: node scripts/download-assets.mjs
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://tuannhu-savewithlove.io.vn';
const S3 = 'https://wedding-images-682033472690-ap-southeast-1-an.s3.ap-southeast-1.amazonaws.com/resize';

/** @type {Array<[string, string]>} [remoteUrl, localPathRelativeToPublic] */
const ASSETS = [
  // ---- Fonts (self-hosted on the target) ----
  [`${SITE}/assets/lora-regular-BFWPgoKa.ttf`, 'fonts/lora-regular.ttf'],
  [`${SITE}/assets/ergisa-regular-BjIsPHw1.otf`, 'fonts/ergisa-regular.otf'],
  [`${SITE}/assets/arcittya-begatri-uhI9BGsM.otf`, 'fonts/arcittya-begatri.otf'],
  [`${SITE}/assets/flavinda-BRiZvNRa.otf`, 'fonts/flavinda.otf'],
  [`${SITE}/assets/silenter-C5lpuIgs.ttf`, 'fonts/silenter.ttf'],
  [`${SITE}/assets/memv-BEhAMRCF.woff2`, 'fonts/memv.woff2'],
  [`${SITE}/assets/anisa-CjbZCygZ.otf`, 'fonts/anisa.otf'],

  // ---- Decorative / brand graphics ----
  [`${SITE}/assets/background-white-DyBmZfnI.png`, 'images/background-white.png'],
  [`${SITE}/assets/icon-and-CRbyywXf.png`, 'images/icon-and.png'],
  [`${SITE}/assets/logo-tn-Qucssfq5.png`, 'images/logo-tn.png'],
  [`${SITE}/assets/floral-frame-Bd8MK5Vt.png`, 'images/floral-frame.png'],
  [`${SITE}/assets/floral-corner-BfyLYji7.png`, 'images/floral-corner.png'],
  [`${SITE}/assets/flower-wax-seal-sF4AWk82.png`, 'images/flower-wax-seal.png'],
  [`${S3}/wax-seal.webp`, 'images/wax-seal.webp'],
  [`${S3}/cursor.webp`, 'images/cursor.webp'],

  // ---- Couple photos ----
  [`${S3}/couple/4N2A6880.webp`, 'images/couple/4N2A6880.webp'],
  [`${S3}/couple/4N2A6981.webp`, 'images/couple/4N2A6981.webp'],
  [`${S3}/couple/4N2A7808.webp`, 'images/couple/4N2A7808.webp'],
  [`${S3}/couple/4N2A8462.webp`, 'images/couple/4N2A8462.webp'],
  [`${S3}/holding-invitation/4N2A7591.webp`, 'images/holding-invitation/4N2A7591.webp'],

  // ---- Album photos ----
  [`${S3}/album/4N2A8362.webp`, 'images/album/4N2A8362.webp'],
  [`${S3}/album/4N2A6242.webp`, 'images/album/4N2A6242.webp'],
  [`${S3}/album/4N2A8060.webp`, 'images/album/4N2A8060.webp'],
  [`${S3}/album/4N2A8639.webp`, 'images/album/4N2A8639.webp'],
  [`${S3}/album/4N2A6817.webp`, 'images/album/4N2A6817.webp'],
  [`${S3}/album/4N2A7594.webp`, 'images/album/4N2A7594.webp'],
  [`${S3}/album/4N2A7290.webp`, 'images/album/4N2A7290.webp'],
  [`${S3}/album/4N2A6775.webp`, 'images/album/4N2A6775.webp'],
  [`${S3}/album/4N2A7749.webp`, 'images/album/4N2A7749.webp'],
  [`${S3}/album/4N2A6421.webp`, 'images/album/4N2A6421.webp'],
  [`${S3}/album/4N2A7168.webp`, 'images/album/4N2A7168.webp'],

  // ---- Audio ----
  ['https://camcui.vn/bai8.mp3', 'audio/wedding-song.mp3'],
];

const BATCH = 4;

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function download([url, rel]) {
  const dest = resolve(ROOT, 'public', rel);
  if (await exists(dest)) return { rel, status: 'cached' };
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0', Referer: `${SITE}/` },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  return { rel, status: 'ok', kb: Math.round(buf.length / 1024) };
}

const failures = [];
for (let i = 0; i < ASSETS.length; i += BATCH) {
  const chunk = ASSETS.slice(i, i + BATCH);
  const results = await Promise.allSettled(chunk.map(download));
  results.forEach((r, j) => {
    if (r.status === 'fulfilled') {
      const { rel, status, kb } = r.value;
      console.log(`  ${status === 'cached' ? '·' : '✓'} ${rel}${kb ? ` (${kb} KB)` : ''}`);
    } else {
      failures.push(`${chunk[j][1]}: ${r.reason.message}`);
      console.error(`  ✗ ${chunk[j][1]} — ${r.reason.message}`);
    }
  });
}

console.log(`\n${ASSETS.length - failures.length}/${ASSETS.length} assets available in public/`);
if (failures.length) {
  console.error('\nFailures:\n' + failures.map((f) => '  - ' + f).join('\n'));
  process.exit(1);
}
