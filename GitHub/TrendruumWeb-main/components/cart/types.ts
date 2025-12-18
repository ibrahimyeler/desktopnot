export interface Product {
  _id: string | { $oid: string };
  images?: Array<{
    url: string;
    fullpath: string;
  }>;
  medias?: {
    url: string;
    fullpath: string;
  };
}

export interface BasketItem {
  id: string;
  basket_id: string;
  basket_group_id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  price: number;
  updated_at: string;
  created_at: string;
  variants?: {
    [key: string]: string;
  };
  product?: {
    name: string;
    price: number;
    images?: Array<{
      url: string;
      fullpath: string;
    }>;
    medias?: Array<{
      url: string;
      fullpath: string;
    }> | {
      url: string;
      fullpath: string;
      name?: string;
      type?: string;
      id?: string;
    };
    status?: string;
    slug: string;
    updated_at: string;
    created_at: string;
    id: string;
    brand?: {
      name: string;
      id: string;
    };
    brand_id?: string;
    variants?: Array<{
      slug: string;
      name: string;
      value_name: string;
      value_slug: string;
      imageable: boolean;
      updated_at: string;
      created_at: string;
    }>;
  };
  total_price: number;
}

export interface BasketGroup {
  basket_id: string;
  seller_id: string;
  seller: {
    name: string;
    id: string;
    slug?: string;
    point?: number;
    rating?: number;
  };
  updated_at: string;
  created_at: string;
  total_price: number;
  id: string;
  basket_group_items: BasketItem[];
}

