export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  images: string[];
  description: string;
  materials: string;
  care: string;
  reviews: Review[];
  isBestSeller?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export type Category = 'earrings' | 'necklaces' | 'rings' | 'bracelets' | 'best-sellers';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CategoryItem {
  id: Category;
  name: string;
  icon: string;
  image: string;
}
