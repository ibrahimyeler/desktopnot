import type { MenuItem, MenuSection } from '@/app/context/MenuContext';

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  href?: string;
  children?: CategoryNode[];
}

const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 've')
    .replace(/\s+/g, ' ')
    .trim();

const stripUrlPrefix = (value: string) => value.replace(/^https?:\/\/[^/]+/i, '');

const slugDisplayNameMap: Record<string, string> = {
  kadin: 'Kadın',
  erkek: 'Erkek',
  'anne-cocuk': 'Anne & Çocuk',
  'ev-mobilya': 'Ev & Mobilya',
  supermarket: 'Süpermarket & Petshop',
  kozmetik: 'Kozmetik',
  'ayakkabi-canta': 'Ayakkabı & Çanta',
  elektronik: 'Elektronik',
  'spor-outdoor': 'Spor & Outdoor',
  'kitap-kirtasiye-hobi': 'Kitap & Kırtasiye & Hobi',
};

const getDisplayNameForSlug = (slug: string) => slugDisplayNameMap[slug] || slug;

const normalizeMenuItemName = (categorySlug: string, name: string) => {
  const trimmedName = name?.trim() ?? '';
  if (!trimmedName) {
    return trimmedName;
  }
  const baseName = getDisplayNameForSlug(categorySlug);
  const lowerBase = baseName.toLocaleLowerCase('tr-TR');
  const lowerName = trimmedName.toLocaleLowerCase('tr-TR');

  const prefixes = [
    `${lowerBase} `,
    `${lowerBase}-`,
    `${lowerBase} &`,
    `${lowerBase} /`,
  ];

  for (const prefix of prefixes) {
    if (lowerName.startsWith(prefix)) {
      const sliceIndex = trimmedName.length - lowerName.length + prefix.length;
      return trimmedName.slice(sliceIndex).trim();
    }
  }

  return trimmedName;
};

const normalizeSlugForKey = (value?: string) => {
  if (!value) return '';
  const raw = stripUrlPrefix(value).trim().replace(/^\/+/, '').split('?')[0];
  if (!raw) return '';
  return raw
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
};

const createHref = (item: { url?: string; slug?: string }) => {
  let href = (item.url ?? item.slug ?? '').toString().trim();
  if (!href) {
    return '#';
  }
  if (/^https?:\/\//i.test(href)) {
    return href;
  }
  if (!href.startsWith('/')) {
    href = `/${href}`;
  }
  href = href.replace(/\/{2,}/g, '/');
  return href;
};

const getItemId = (item: MenuItem | CategoryNode | Record<string, unknown>, fallback: string) => {
  const rawId = (item as MenuItem).id;
  if (typeof rawId === 'string' && rawId) {
    return rawId;
  }
  if (rawId && typeof rawId === 'object' && '$oid' in rawId && typeof rawId.$oid === 'string') {
    return rawId.$oid;
  }
  if ('slug' in item && typeof item.slug === 'string' && item.slug) {
    return item.slug;
  }
  if ('name' in item && typeof item.name === 'string' && item.name) {
    return normalizeSlugForKey(item.name) || fallback;
  }
  return fallback;
};

const normalizeCategoryNode = (node: CategoryNode): CategoryNode => ({
  ...node,
  href: node.href ?? createHref({ url: node.slug }),
  children: node.children?.map(normalizeCategoryNode) ?? [],
});

const findRootSection = (categorySlug: string, menuSections?: Record<string, MenuSection>) => {
  if (!menuSections) return undefined;
  const primaryKey = `${categorySlug}-ana-kategoriler`;
  if (menuSections[primaryKey]) {
    return menuSections[primaryKey];
  }
  // Fallback to first section whose location starts with {categorySlug}- and contains ana-kategori kelimesi
  return Object.values(menuSections).find(
    (section) =>
      section.location?.startsWith(`${categorySlug}-`) &&
      normalizeText(section.location).includes('ana') &&
      normalizeText(section.location).includes('kategori'),
  );
};

const findChildSection = (
  categorySlug: string,
  item: MenuItem,
  menuSections?: Record<string, MenuSection>,
) => {
  if (!menuSections) return undefined;
  const candidates = new Set<string>();
  if (item.slug) {
    candidates.add(`${categorySlug}-${item.slug}`);
    candidates.add(`${categorySlug}-${normalizeSlugForKey(item.slug)}`);
  }
  if (item.url) {
    const normalizedUrl = normalizeSlugForKey(item.url);
    if (normalizedUrl) {
      candidates.add(`${categorySlug}-${normalizedUrl}`);
    }
  }

  for (const candidate of candidates) {
    if (candidate && menuSections[candidate]) {
      return menuSections[candidate];
    }
  }

  // Fallback by matching section name
  const targetName = normalizeText(item.name);
  return Object.values(menuSections).find(
    (section) =>
      section.location?.startsWith(`${categorySlug}-`) &&
      section.menuItems &&
      normalizeText(section.name || '') === targetName,
  );
};

const cloneCategory = (category?: CategoryNode | null): CategoryNode | null => {
  if (!category) return null;
  const cloned: CategoryNode = {
    id: category.id,
    name: category.name,
    slug: category.slug,
    href: category.href,
    children: category.children
      ? category.children
          .map((child) => cloneCategory(child))
          .filter((child): child is CategoryNode => child !== null)
      : [],
  };
  return normalizeCategoryNode(cloned);
};

const convertMenuItemChildren = (
  categorySlug: string,
  items: MenuItem[],
  menuSections?: Record<string, MenuSection>,
  visitedIds: Set<string> = new Set(),
): CategoryNode[] =>
  items.map((item) => {
    const itemId = getItemId(item, `${categorySlug}-${normalizeSlugForKey(item.slug)}`);
    
    // Circular reference kontrolü - eğer bu item zaten işlendiyse, children'ı boş bırak
    if (visitedIds.has(itemId)) {
      const displayName = normalizeMenuItemName(categorySlug, item.name);
      return normalizeCategoryNode({
        id: itemId,
        name: displayName,
        slug: item.slug || item.url || item.name,
        href: createHref(item),
        children: [],
      });
    }
    
    // Bu item'ı ziyaret edildi olarak işaretle
    const newVisitedIds = new Set(visitedIds);
    newVisitedIds.add(itemId);
    
    const childSection = findChildSection(categorySlug, item, menuSections);
    const displayName = normalizeMenuItemName(categorySlug, item.name);
    return normalizeCategoryNode({
      id: itemId,
      name: displayName,
      slug: item.slug || item.url || item.name,
      href: createHref(item),
      children: childSection
        ? convertMenuItemChildren(
            categorySlug,
            Array.isArray(childSection.menuItems) ? childSection.menuItems : [],
            menuSections,
            newVisitedIds,
          )
        : [],
    });
  });

const flattenCategories = (categories: CategoryNode[]): CategoryNode[] => {
  const result: CategoryNode[] = [];
  categories.forEach((cat) => {
    result.push(cat);
    if (cat.children?.length) {
      result.push(...flattenCategories(cat.children));
    }
  });
  return result;
};

export const buildCategoryTree = ({
  categorySlug,
  menuSections,
  fallbackCategory,
  navigationLinks = [],
  categories = [],
}: {
  categorySlug: string;
  menuSections?: Record<string, MenuSection>;
  fallbackCategory?: CategoryNode | null;
  navigationLinks?: MenuItem[];
  categories?: CategoryNode[];
}): CategoryNode | null => {
  // 1. Dynamic sections from API
  const rootSection = findRootSection(categorySlug, menuSections);
  const childSectionsFromMenu = menuSections
    ? Object.values(menuSections).filter(
        (section) =>
          section.location?.startsWith(`${categorySlug}-`) &&
          section.location !== `${categorySlug}-ana-kategoriler`,
      )
    : [];

  const deriveMenuItemsFromSections = () =>
    childSectionsFromMenu.map((section) => {
      const derivedSlug =
        section.location?.replace(`${categorySlug}-`, '') || normalizeSlugForKey(section.name);
      const derivedUrl = derivedSlug || section.location || section.name;
      return {
        id: section.id || section.location || derivedSlug,
        name: section.name,
        slug: derivedSlug,
        url: derivedUrl,
        children: Array.isArray(section.menuItems) ? section.menuItems : [],
      } as MenuItem;
    });

  let rootMenuItems: MenuItem[] = [];
  let rootName = getDisplayNameForSlug(categorySlug);

  if (rootSection) {
    rootName = rootSection.name || rootName;
    if (Array.isArray(rootSection.menuItems) && rootSection.menuItems.length > 0) {
      rootMenuItems = rootSection.menuItems;
    }
  }

  if (!rootMenuItems.length && childSectionsFromMenu.length > 0) {
    rootMenuItems = deriveMenuItemsFromSections();
  }

  if (rootMenuItems.length > 0) {
    const dynamicCategory: CategoryNode = {
      id: categorySlug,
      name: rootName,
      slug: categorySlug,
      href: `/${categorySlug}`,
      children: convertMenuItemChildren(categorySlug, rootMenuItems, menuSections),
    };
    if (dynamicCategory.children && dynamicCategory.children.length > 0) {
      return dynamicCategory;
    }
  }

  // 2. Fallback to provided static data
  const fallback = cloneCategory(fallbackCategory);
  if (fallback && fallback.children && fallback.children.length > 0) {
    return fallback;
  }

  // 3. Look into provided categories prop (legacy)
  const categoryMatch = flattenCategories(categories).find(
    (cat) => cat.slug === categorySlug || normalizeSlugForKey(cat.slug) === normalizeSlugForKey(categorySlug),
  );
  if (categoryMatch) {
    return normalizeCategoryNode(categoryMatch);
  }

  // 4. Use navigation links if available
  const navItem =
    navigationLinks.find((link) => link.slug === categorySlug) ||
    navigationLinks.find((link) => link.name === getDisplayNameForSlug(categorySlug));

  if (navItem) {
    return normalizeCategoryNode({
      id: getItemId(navItem, categorySlug),
      name: normalizeMenuItemName(categorySlug, navItem.name),
      slug: navItem.slug,
      href: createHref(navItem),
      children: (navItem.children || []).map((child) =>
        normalizeCategoryNode({
          id: getItemId(child, child.slug || child.name),
          name: normalizeMenuItemName(categorySlug, child.name),
          slug: child.slug,
          href: createHref(child),
          children: [],
        }),
      ),
    });
  }

  return null;
};

