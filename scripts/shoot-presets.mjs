/**
 * 모든 프리셋 조합을 빌드해 스크린샷으로 확인하고,
 * 모바일 가로 스크롤 / 콘솔 에러를 검사합니다.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import { serveDist } from './lib/serve.mjs';

const OUT = '/tmp/claude-0/presets';
mkdirSync(OUT, { recursive: true });
const CONFIG = 'site.config.ts';
const original = readFileSync(CONFIG, 'utf8');

const combos = [
  ['stacked', 'card'],
  ['split', 'card'],
  ['minimal', 'overlay'],
  ['split', 'list'],
];

const problems = [];

try {
  for (const [hero, productCard] of combos) {
    const re = /layout: \{\s*hero: '[a-z]+',\s*productCard: '[a-z]+',\s*\}/;
    if (!re.test(original)) throw new Error('config 패치 실패 — 정규식 확인');
    const patched = original.replace(
      re,
      `layout: {\n    hero: '${hero}',\n    productCard: '${productCard}',\n  }`
    );
    writeFileSync(CONFIG, patched);

    const b = spawnSync('npm', ['run', 'build'], { encoding: 'utf8' });
    if (b.status !== 0) {
      problems.push(`${hero}/${productCard}: 빌드 실패`);
      console.log(b.stdout.slice(-500));
      continue;
    }

    const srv = await serveDist(new URL('../dist', import.meta.url).pathname);
    try {
      const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      const errs = [];
      page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
      page.on('pageerror', (e) => errs.push(String(e)));

      await page.goto(srv.url + '/', { waitUntil: 'networkidle' });
      await page.screenshot({ path: `${OUT}/${hero}-${productCard}-home.png`, fullPage: false });

      await page.goto(srv.url + '/products/', { waitUntil: 'networkidle' });
      await page.screenshot({ path: `${OUT}/${hero}-${productCard}-list.png`, fullPage: false });

      // 필터가 여전히 동작하는지
      await page.click('[data-filter="office"]');
      await page.waitForTimeout(250);
      const vis = await page.locator('[data-item]:not([hidden])').count();
      if (vis !== 2) problems.push(`${hero}/${productCard}: 필터 결과 ${vis} (기대 2)`);

      // 모바일 가로 스크롤
      const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
      await m.goto(srv.url + '/products/', { waitUntil: 'networkidle' });
      const overflow = await m.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1
      );
      if (overflow) problems.push(`${hero}/${productCard}: 모바일 가로 스크롤 발생`);
      await m.screenshot({ path: `${OUT}/${hero}-${productCard}-mobile.png`, fullPage: false });

      if (errs.length) problems.push(`${hero}/${productCard}: 콘솔 에러 ${errs.join(' | ')}`);
      await browser.close();
      console.log(`${hero}/${productCard} ok`);
    } finally {
      await srv.close();
    }
  }
} finally {
  writeFileSync(CONFIG, original);
}

console.log(problems.length ? `\n문제:\n- ${problems.join('\n- ')}` : '\n문제 없음');
