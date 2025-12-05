import { Product, CategoryItem } from '@/types';

export const categories: CategoryItem[] = [
  {
    id: 'earrings',
    name: 'EARRINGS',
    icon: 'earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&q=80',
  },
  {
    id: 'necklaces',
    name: 'NECKLACES',
    icon: 'necklace',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80',
  },
  {
    id: 'rings',
    name: 'RINGS',
    icon: 'ring',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&q=80',
  },
  {
    id: 'bracelets',
    name: 'BRACELETS',
    icon: 'bracelet',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&q=80',
  },
  {
    id: 'best-sellers',
    name: 'BEST SELLERS',
    icon: 'star',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80',
  },
];

export const products: Product[] = [
  // Earrings
  {
    id: '1',
    name: 'SPARKLE Star Stud Earrings | 18K Gold Over Sterling Silver',
    price: 49.99,
    category: 'earrings',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    ],
    description: 'These stunning star stud earrings feature intricate detailing with sparkling crystals set in 18K gold over sterling silver. Perfect for everyday elegance or special occasions.',
    materials: '18K Gold plated over 925 Sterling Silver. Cubic Zirconia stones. Hypoallergenic and nickel-free.',
    care: 'Store in a cool, dry place. Avoid contact with perfumes, lotions, and water. Clean gently with a soft cloth.',
    reviews: [
      { id: 'r1', author: 'Sarah M.', rating: 5, comment: 'Absolutely gorgeous! The quality is amazing.', date: '2024-01-15' },
      { id: 'r2', author: 'Emily R.', rating: 5, comment: 'Love these earrings! Get so many compliments.', date: '2024-01-10' },
    ],
    isBestSeller: true,
  },
  {
    id: '2',
    name: 'DEMI-FIN Hoop Earrings | Sterling Silver',
    price: 49.99,
    category: 'earrings',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
    ],
    description: 'Classic hoop earrings crafted in sterling silver with a modern demi-fine finish. Lightweight and comfortable for all-day wear.',
    materials: '925 Sterling Silver. Rhodium plated for extra shine and durability.',
    care: 'Store separately to avoid scratching. Clean with silver polishing cloth.',
    reviews: [
      { id: 'r3', author: 'Michelle K.', rating: 4, comment: 'Beautiful hoops, very lightweight!', date: '2024-01-08' },
    ],
    isBestSeller: true,
  },
  {
    id: '3',
    name: 'LUNA Crescent Moon Drop Earrings | 14K Gold',
    price: 89.99,
    category: 'earrings',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
    ],
    description: 'Elegant crescent moon drop earrings in 14K solid gold. A celestial design perfect for the modern woman.',
    materials: '14K Solid Gold. Hand-polished finish.',
    care: 'Store in jewelry box. Avoid harsh chemicals.',
    reviews: [],
    isBestSeller: false,
  },
  // Necklaces
  {
    id: '4',
    name: 'INFINITY Chain Necklace | 18K Gold Vermeil',
    price: 79.99,
    category: 'necklaces',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    ],
    description: 'A delicate chain necklace featuring an infinity pendant. Symbolizes eternal love and connection.',
    materials: '18K Gold Vermeil over Sterling Silver.',
    care: 'Remove before showering. Store flat to prevent tangling.',
    reviews: [
      { id: 'r4', author: 'Jessica L.', rating: 5, comment: 'Perfect everyday necklace!', date: '2024-01-12' },
    ],
    isBestSeller: true,
  },
  {
    id: '5',
    name: 'PEARL Classic Pendant Necklace | Sterling Silver',
    price: 69.99,
    category: 'necklaces',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    ],
    description: 'Timeless pearl pendant on a sterling silver chain. Classic elegance for any occasion.',
    materials: 'Freshwater Pearl, 925 Sterling Silver chain.',
    care: 'Keep pearls away from perfume. Wipe with soft cloth after wearing.',
    reviews: [],
    isBestSeller: false,
  },
  // Rings
  {
    id: '6',
    name: 'ETERNAL Band Ring | 18K Gold',
    price: 129.99,
    category: 'rings',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80',
    ],
    description: 'A sleek, minimalist band ring in solid 18K gold. Perfect for stacking or wearing alone.',
    materials: '18K Solid Gold.',
    care: 'Remove when washing hands. Polish with gold cloth.',
    reviews: [
      { id: 'r5', author: 'Amanda T.', rating: 5, comment: 'Beautiful quality, love stacking these!', date: '2024-01-05' },
    ],
    isBestSeller: true,
  },
  {
    id: '7',
    name: 'SOLITAIRE Diamond Ring | Sterling Silver',
    price: 159.99,
    category: 'rings',
    images: [
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    ],
    description: 'Classic solitaire ring with a brilliant-cut cubic zirconia center stone.',
    materials: '925 Sterling Silver, AAA Cubic Zirconia.',
    care: 'Store separately. Clean with jewelry cleaner.',
    reviews: [],
    isBestSeller: false,
  },
  // Bracelets
  {
    id: '8',
    name: 'CHAIN Link Bracelet | 18K Gold',
    price: 99.99,
    category: 'bracelets',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
    ],
    description: 'Bold chain link bracelet in 18K gold. A statement piece for the confident woman.',
    materials: '18K Gold Plated Brass.',
    care: 'Avoid water and chemicals. Store in pouch.',
    reviews: [
      { id: 'r6', author: 'Nicole B.', rating: 4, comment: 'Gorgeous bracelet, perfect weight!', date: '2024-01-03' },
    ],
    isBestSeller: true,
  },
  {
    id: '9',
    name: 'BANGLE Minimalist Cuff | Sterling Silver',
    price: 59.99,
    category: 'bracelets',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    ],
    description: 'Sleek minimalist cuff bangle in polished sterling silver. Adjustable fit.',
    materials: '925 Sterling Silver.',
    care: 'Polish regularly to maintain shine.',
    reviews: [],
    isBestSeller: false,
  },
  {
    id: '10',
    name: 'TENNIS Diamond Bracelet | 18K White Gold',
    price: 199.99,
    category: 'bracelets',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      'https://images.unsplash.com/photo-573408301185-9146fe634ad0?w=800&q=80',
    ],
    description: 'Elegant tennis bracelet featuring a continuous line of sparkling stones.',
    materials: '18K White Gold Plated, Cubic Zirconia.',
    care: 'Handle with care. Store flat.',
    reviews: [],
    isBestSeller: false,
  },
];

export const getBestSellers = (): Product[] => {
  return products.filter(p => p.isBestSeller);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'best-sellers') {
    return getBestSellers();
  }
  return products.filter(p => p.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};
