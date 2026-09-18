/**
 * ============================================================
 *  고객사별 교체 지점 #1 — 사이트 전역 설정
 * ============================================================
 *  새 고객사에 납품할 때 이 파일과 src/styles/tokens.css 두 개만
 *  바꾸면 브랜드 교체가 끝나도록 설계되어 있습니다.
 *  코드(컴포넌트/페이지)는 원칙적으로 건드리지 않습니다.
 * ============================================================
 */

import type {
  NavItem,
  Category,
  LayoutPreset,
  SiteConfig,
} from './src/lib/site-config.types';

// 기존 import 경로(`site.config` 에서 타입을 가져오던 곳)를 위해 다시 내보냅니다
export type { NavItem, Category, LayoutPreset, SiteConfig };

export const siteConfig: SiteConfig = {
  site: 'https://example.com',
  company: '노벤타',
  tagline: '현장이 멈추지 않도록',
  description:
    '노벤타는 생산 현장의 설비를 보호하고 상태를 기록하는 장비를 만듭니다. 용도에 맞는 제품을 찾아보고 문의해 주세요.',
  logo: null,
  ogImage: '/og-default.png',
  lang: 'ko',

  layout: {
    hero: 'split',
    productCard: 'card',
    featured: 'grid',
    homeSections: ['featured', 'categories', 'cta'],
  },

  nav: [
    { label: '제품', href: '/products' },
    { label: '회사소개', href: '/about' },
    { label: '문의', href: '/contact' },
  ],

  utilityNav: {
    right: [
      { label: '회사소개', href: '/about/' },
      { label: '문의', href: '/contact/' },
    ],
  },

  quickLinks: [
    { label: '문의하기', href: '/contact/' },
    { label: '전화', href: 'tel:02-0000-0000' },
  ],

  categories: [
    {
      id: 'protection',
      label: '보호장비',
      description: '분진·충격·진동으로부터 설비를 지키는 제품군입니다.',
    },
    {
      id: 'measure',
      label: '계측기기',
      description: '현장의 온도·진동·압력을 기록하고 이상을 알립니다.',
    },
    {
      id: 'parts',
      label: '부속품',
      description: '설치와 배선에 필요한 부속 자재입니다.',
    },
  ],

  contact: {
    email: 'contact@example.com',
    phone: '02-0000-0000',
    address: '경기도 화성시 동탄산단로 000',
    businessNumber: '000-00-00000',
    ceo: '홍길동',
  },

  inquiry: {
    mode: 'external',
    // Google Forms → 보내기 → <> 탭의 iframe src 주소를 그대로 붙여넣습니다.
    embedUrl: 'https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true',
  },

  productsPerPage: 12,
  featuredCount: 4,
  enableSearch: true,

  verification: {
    // naver: 'abc123...',
    // google: 'xyz789...',
  },

  analytics: {
    // cloudflareToken: '0123456789abcdef...',
  },

  // 영업용 데모 공개 시 true. 실제 납품 시에는 반드시 false.
  demoBanner: {
    enabled: true,
  },
};

export default siteConfig;
