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
    /*
     * 전화 링크를 넣으시려면 아래 모양으로 적습니다.
     *   { label: '전화', href: 'tel:0200000000' },
     *
     * 번호가 contact.phone 과 따로 적히는 자리라 둘이 어긋나기 쉽습니다.
     * 넣으실 거면 같은 번호인지 확인하세요. contact.phone 이 비어 있으면
     * 퀵 메뉴에서도 전화 링크가 빠집니다.
     */
  ],

  /**
   * 제품 상세 "유의사항" 탭.
   * 모든 제품에 공통인 안내만 둡니다. 제품마다 다른 값은 specs 로 넣으세요.
   * 비우면 탭이 나오지 않습니다.
   */
  productNotice: {
    items: [
      '최소 주문 수량과 납기는 제품에 따라 다릅니다. 문의 시 안내해 드립니다.',
      '표시된 사양은 개선을 위해 예고 없이 변경될 수 있습니다.',
      '화면에 보이는 색상은 기기에 따라 실제 제품과 다를 수 있습니다.',
      '이 사이트에서는 결제가 이루어지지 않습니다. 견적과 계약은 별도로 진행됩니다.',
    ],
  },

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
    /*
     * 비워두면 전화 관련 요소가 화면에서 아예 빠집니다 — 푸터 줄, 문의
     * 페이지 항목, 제품 상세 버튼, 모바일 하단 전화 버튼.
     *
     * 기본값을 빈 문자열로 둡니다. 02-0000-0000 같은 가짜 번호를 넣어두면
     * 고객사가 못 채우고 넘어갔을 때 그대로 공개되고, 눌러보는 사람이 생깁니다.
     *
     * ⚠ 개인 휴대전화는 권하지 않습니다. 사이트에 적힌 번호는 수집 프로그램이
     *   긁어가고, 한번 퍼지면 되돌릴 방법이 없습니다.
     */
    phone: '',
    address: '경기도 화성시 동탄산단로 000',
    businessNumber: '000-00-00000',
    ceo: '홍길동',
  },

  inquiry: {
    mode: 'external',
    /*
     * 문의 양식 주소입니다.
     *
     * 국내 서비스(네이버 폼 등)를 권합니다. 구글 폼은 서버가 국외에 있어
     * 개인정보 국외 이전에 해당하고(개인정보 보호법 제28조의8), 처리방침에
     * 이전 국가·이전받는 자·이용 목적·보유 기간을 따로 공개해야 합니다.
     * 국내 폼을 쓰면 그 항목이 통째로 빠집니다.
     *
     *   네이버 폼 : 폼 편집 → 공유 → 링크 주소
     *   구글 폼   : 보내기 → <> 탭의 iframe src 주소
     *
     * ⚠ 어느 쪽이든 문의를 받기 시작하면 고객사가 개인정보처리자가 됩니다.
     *   처리방침 공개(제30조)와 보호책임자 기재(제31조)가 따라옵니다.
     *   src/content/pages/privacy.md 의 괄호 자리를 반드시 채우세요.
     */
    embedUrl: 'https://form.naver.com/response/FORM_ID',
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
