import axios from "axios";
import { API_V1_URL } from "@/lib/config";
import HomeClient from "./HomeClient";

interface Item {
  slug: string;
  value: any;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  medias: {
    url: string;
    type: string;
  }[];
  price: number;
  discounted_price: number | null;
  seller?: {
    id: string;
    name: string;
  } | null;
  brand?: {
    name: string;
    slug: string;
  } | null;
  stock?: number;
  status?: string;
  rating?: number;
  average_rating?: number;
  reviewCount?: number;
  review_count?: number;
  badges?: {
    fast_shipping?: boolean;
    free_shipping?: boolean;
    cargo_free?: boolean;
    new_product?: boolean;
    best_selling?: boolean;
    same_day?: boolean;
    [key: string]: any;
  };
}

interface Field {
  slug: string;
  items: Item[];
}

interface Section {
  id: string;
  slug: string;
  fields: Field[];
}

interface ApiField {
  slug: string;
  items?: Item[];
}

interface ApiSection {
  id: string;
  slug: string;
  fields?: ApiField[];
}

const SELECTED_PRODUCT_LIMIT = 50;
const MEDIA_LIMIT = 3;

const pickProductSummary = (product: Product) => ({
  id: String(product.id ?? ""),
  slug: product.slug ?? String(product.id ?? ""),
  name: product.name,
  price: product.price,
  discounted_price: product.discounted_price,
  stock: product.stock,
  status: product.status,
  rating: product.rating,
  average_rating: product.average_rating,
  review_count: product.review_count,
  medias: Array.isArray(product.medias) ? product.medias.slice(0, MEDIA_LIMIT) : [],
  seller: product.seller
    ? {
        id: product.seller.id,
        name: product.seller.name,
      }
    : null,
  brand: product.brand
    ? {
        name: product.brand.name,
        slug: product.brand.slug,
      }
    : null,
  badges: product.badges
    ? {
        ...product.badges,
        free_shipping:
          product.badges.free_shipping ??
          product.badges.cargo_free ??
          product.badges.freeShipping ??
          false,
        cargo_free:
          product.badges.cargo_free ??
          product.badges.free_shipping ??
          product.badges.freeShipping ??
          false,
      }
    : undefined,
});

type ProductSummary = ReturnType<typeof pickProductSummary>;

const compareByAvailability = (a: ProductSummary, b: ProductSummary) => {
  const stockA = a.stock ?? 0;
  const stockB = b.stock ?? 0;
  if (stockA === 0 && stockB > 0) return 1;
  if (stockA > 0 && stockB === 0) return -1;
  return a.id.localeCompare(b.id);
};

function optimizeSectionData(sections: ApiSection[]): Section[] {
  return sections
    .filter((section) => section?.id && section?.slug)
    .map((section) => ({
      id: section.id,
      slug: section.slug,
      fields:
        section.fields
          ?.filter((field): field is ApiField => Boolean(field?.slug))
          .map((field) => ({
            slug: field.slug,
            items:
              field.items
                ?.filter((item): item is Item => Boolean(item?.slug))
                .map((item) => {
                  if (item.slug === "selected-products" && Array.isArray(item.value)) {
                    return {
                      ...item,
                      value: item.value
                        .slice(0, SELECTED_PRODUCT_LIMIT)
                        .map(pickProductSummary)
                        .sort(compareByAvailability),
                    };
                  }
                  return item;
                }) ?? [],
          })) ?? [],
    }));
}

async function getHomePageData(): Promise<Section[]> {
  const HOME_PAGE_ENDPOINT = `${API_V1_URL}/pages/homepage?page=1&per_page=100`;
  const REQUEST_HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // 100 ürün çekmek daha uzun sürebilir, timeout'u artır
      const timeout = 30000 + attempt * 10000; // 30s, 40s, 50s
      const response = await axios.get(HOME_PAGE_ENDPOINT, {
        timeout,
        headers: REQUEST_HEADERS,
      });
      const data = response.data;

      if (data.meta?.status === "success" && data.data?.sections) {
        const seenIds = new Set<string>();
        const uniqueSections: ApiSection[] = [];
        (data.data.sections as ApiSection[]).forEach((section) => {
          if (!section?.id || seenIds.has(section.id)) {
            return;
          }
          seenIds.add(section.id);
          uniqueSections.push(section);
        });
        return optimizeSectionData(uniqueSections);
      }
      return [];
    } catch (e: any) {
      // Daha detaylı hata loglama
      const errorInfo = {
        message: e?.message || String(e) || 'Unknown error',
        code: e?.code || 'NO_CODE',
        status: e?.response?.status || 'NO_STATUS',
        statusText: e?.response?.statusText || 'NO_STATUS_TEXT',
        timeout: e?.code === "ECONNABORTED" || e?.message?.includes('timeout'),
        attempts: attempt + 1,
        timestamp: new Date().toISOString(),
        url: HOME_PAGE_ENDPOINT,
      };

      if (
        attempt < maxRetries &&
        (e?.code === "ECONNABORTED" || e?.response?.status === 502 || e?.response?.status === 504)
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
        continue;
      }
      if (attempt === maxRetries) {
      }
    }
  }
  return [];
}

export const revalidate = 60;

export default async function Home() {
  const sections = await getHomePageData();
  return <HomeClient sections={sections} />;
}
