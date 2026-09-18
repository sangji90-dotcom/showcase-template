/**
 * 데모용 제품 이미지 생성기.
 *
 * 실제 납품 시에는 고객사 제품 사진으로 전부 교체합니다(README 체크리스트).
 * 사진이 없는 상태에서도 카탈로그가 그럴듯해 보이도록,
 * 카테고리별로 색과 도형을 통일한 추상 이미지를 만듭니다.
 *
 *   node scripts/gen-sample-images.mjs
 *
 * 어떤 카드 비율(4:3 / 3:4 / 1:1)로 잘려도 형태가 살아남도록
 * 모든 요소를 중앙에 배치합니다.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const out = new URL('../src/assets/products/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const W = 1200;
const H = 900;
const CX = W / 2;
const CY = H / 2;

/** 카테고리별 색과 형태 — 목록에서 제품군이 한눈에 구분되게 */
const THEMES = {
  protection: { from: '#1e3a8a', to: '#3b82f6', shape: 'shield' },
  measure: { from: '#0f766e', to: '#14b8a6', shape: 'gauge' },
  parts: { from: '#3f3f46', to: '#71717a', shape: 'bolt' },
};

function shapeMarkup(kind) {
  const stroke = 'rgba(255,255,255,0.92)';
  const faint = 'rgba(255,255,255,0.28)';

  if (kind === 'shield') {
    // 덮개가 설비를 덮는 단면 — 위 아치(커버) + 아래 본체
    return `
      <path d="M ${CX - 210} ${CY + 10}
               A 210 150 0 0 1 ${CX + 210} ${CY + 10}"
            fill="none" stroke="${stroke}" stroke-width="14" stroke-linecap="round"/>
      <path d="M ${CX - 255} ${CY + 30}
               A 255 185 0 0 1 ${CX + 255} ${CY + 30}"
            fill="none" stroke="${faint}" stroke-width="10" stroke-linecap="round"/>
      <rect x="${CX - 130}" y="${CY + 45}" width="260" height="105" rx="12"
            fill="none" stroke="${stroke}" stroke-width="12"/>
      <line x1="${CX - 70}" y1="${CY + 98}" x2="${CX + 70}" y2="${CY + 98}"
            stroke="${faint}" stroke-width="10" stroke-linecap="round"/>`;
  }

  if (kind === 'gauge') {
    // 계기판 — 눈금과 바늘
    return `
      <circle cx="${CX}" cy="${CY}" r="170" fill="none" stroke="${faint}" stroke-width="10"/>
      <circle cx="${CX}" cy="${CY}" r="130" fill="none" stroke="${stroke}" stroke-width="12"/>
      <line x1="${CX}" y1="${CY}" x2="${CX + 78}" y2="${CY - 78}"
            stroke="${stroke}" stroke-width="14" stroke-linecap="round"/>
      <circle cx="${CX}" cy="${CY}" r="16" fill="${stroke}"/>
      <line x1="${CX}" y1="${CY - 200}" x2="${CX}" y2="${CY - 170}" stroke="${faint}" stroke-width="10"/>
      <line x1="${CX + 200}" y1="${CY}" x2="${CX + 170}" y2="${CY}" stroke="${faint}" stroke-width="10"/>
      <line x1="${CX - 200}" y1="${CY}" x2="${CX - 170}" y2="${CY}" stroke="${faint}" stroke-width="10"/>`;
  }

  // bolt — 육각 부속
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${CX + 150 * Math.cos(a)},${CY + 150 * Math.sin(a)}`;
  }).join(' ');
  return `
    <polygon points="${hex}" fill="none" stroke="${stroke}" stroke-width="12"/>
    <circle cx="${CX}" cy="${CY}" r="72" fill="none" stroke="${stroke}" stroke-width="12"/>
    <circle cx="${CX}" cy="${CY}" r="200" fill="none" stroke="${faint}" stroke-width="10"/>`;
}

/** 데모 제품 — src/content/products 의 slug 와 맞춰야 합니다 */
const ITEMS = [
  ['dc-450', 'protection', 'DC-450'],
  ['sp-120', 'protection', 'SP-120'],
  ['gr-200', 'protection', 'GR-200'],
  ['hs-80', 'protection', 'HS-80'],
  ['we-310', 'protection', 'WE-310'],
  ['tl-100', 'measure', 'TL-100'],
  ['vs-220', 'measure', 'VS-220'],
  ['pg-60', 'measure', 'PG-60'],
  ['nm-40', 'measure', 'NM-40'],
  ['mb-kit', 'parts', 'MB-KIT'],
  ['cg-25', 'parts', 'CG-25'],
  ['wc-16', 'parts', 'WC-16'],
];

for (const [slug, category, label] of ITEMS) {
  const theme = THEMES[category];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${theme.from}"/>
        <stop offset="100%" stop-color="${theme.to}"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    ${shapeMarkup(theme.shape)}
    <text x="${CX}" y="${H - 90}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
          font-size="52" font-weight="700" fill="rgba(255,255,255,0.95)"
          letter-spacing="4">${label}</text>
  </svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 84, mozjpeg: true }).toFile(`${out}${slug}.jpg`);
}

// 공유 미리보기용 기본 OG 이미지
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#3b82f6"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="80" y="330" font-family="Arial, Helvetica, sans-serif" font-size="76"
        font-weight="700" fill="#fff">노벤타</text>
  <text x="80" y="404" font-family="Arial, Helvetica, sans-serif" font-size="34"
        fill="rgba(255,255,255,0.88)">현장이 멈추지 않도록</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(new URL('../public/og-default.png', import.meta.url).pathname);

console.log(`제품 이미지 ${ITEMS.length}개와 OG 이미지를 생성했습니다.`);

/**
 * 예시 슬라이드 배너 1장.
 * hero 프리셋을 'carousel' 로 바꿀 때 바로 확인해 볼 수 있도록 만들어 둡니다.
 * (src/content/slides/example.md 는 draft: true 라 기본으로는 나오지 않습니다)
 */
const slidesOut = new URL('../src/assets/slides/', import.meta.url).pathname;
mkdirSync(slidesOut, { recursive: true });

const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="760">
  <defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4f7bd6"/>
  </linearGradient></defs>
  <rect width="1920" height="760" fill="url(#b)"/>
  <circle cx="500" cy="400" r="250" fill="rgba(255,255,255,0.12)"/>
  <circle cx="720" cy="560" r="130" fill="rgba(255,255,255,0.1)"/>
</svg>`;
await sharp(Buffer.from(banner))
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(`${slidesOut}example.jpg`);

console.log('예시 슬라이드 배너를 생성했습니다.');

