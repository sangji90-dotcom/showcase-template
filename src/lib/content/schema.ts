import { z } from 'astro/zod';
import siteConfig from '../../../site.config';

/**
 * ============================================================
 *  상품 스키마 (데이터 소스 중립)
 * ============================================================
 *  로컬 마크다운과 CMS가 **같은 스키마**를 공유합니다.
 *  소스를 바꿔도 페이지/컴포넌트는 손대지 않습니다.
 *
 *  유일한 차이는 이미지 필드입니다.
 *   - local  : image() 헬퍼 (빌드 시 최적화)
 *   - sanity : URL + 치수 객체
 *  그래서 이미지 필드만 인자로 주입받습니다.
 * ============================================================
 */

const CATEGORY_IDS = siteConfig.categories.map((c) => c.id);

export const categoryField = z.string().refine((v) => CATEGORY_IDS.includes(v), {
  message: `category는 site.config.ts에 정의된 값이어야 합니다: ${CATEGORY_IDS.join(', ')}`,
});

export function createProductSchema<T extends z.ZodType>(imageField: T) {
  return z.object({
    title: z.string().min(1),
    summary: z.string().min(1).max(120),
    category: categoryField,

    thumbnail: imageField,
    gallery: z.array(imageField).default([]),

    specs: z.record(z.string(), z.string()).default({}),
    tags: z.array(z.string()).default([]),

    price: z.number().int().nonnegative().optional(),
    priceNote: z.string().default('가격 문의'),

    featured: z.boolean().default(false),
    order: z.number().default(999),
    status: z.enum(['active', 'discontinued', 'coming-soon']).default('active'),
    draft: z.boolean().default(false),

    seoDescription: z.string().optional(),
  });
}

export const pageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  showHero: z.boolean().default(true),
});
