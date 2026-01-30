import { Product, Rental, Store, User } from '../types';

// --- Mock Data ---

export const STORES: Store[] = [
  { 
    id: 'helsinki-oulunkyla', 
    name: 'Hi Honey Helsinki Oulunkylä', 
    address: 'Maaherrantie 34', 
    city: 'Helsinki',
    description: 'Our flagship studio located in the heart of Oulunkylä. We offer a full range of alterations, custom bridal wear, and our exclusive rental collection.',
    hours: 'Tue-Fri 10-17, Sat by appointment',
    phone: '+358 40 123 4567',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80'
  },
  { 
    id: 'espoo-rebridal', 
    name: 'Hi Honey Espoo (ReBridal)', 
    address: 'Kauppakeskus Ainoa', 
    city: 'Espoo',
    description: 'Located inside ReBridal, focusing on pre-loved gowns and accessories. Pick up your rentals while browsing sustainable fashion.',
    hours: 'Mon-Fri 10-20, Sat 10-18',
    phone: '+358 50 987 6543',
    image: 'https://images.unsplash.com/photo-1549417229-7686ac5595fd?w=800&q=80'
  },
];

// Product Images Pool - Using public Unsplash images
const IMAGES = {
  veil1: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&q=80',
  veil2: 'https://images.unsplash.com/photo-1522653216850-4f1415a174fb?w=800&q=80',
  veil3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  veil4: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
  detail1: 'https://images.unsplash.com/photo-1595407753234-0882f1e77954?w=800&q=80',
  dress1: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=800&q=80',
  acc1: 'https://images.unsplash.com/photo-1546167889-0d259e4dc4f4?w=800&q=80',
};

export let PRODUCTS: Product[] = [
  // Collection: Blank Space
  {
    id: 'h001',
    title: 'Honey 001',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 40,
    imageUrl: IMAGES.veil1,
    description: 'Simple beauty that complements the whole. A classic cathedral length veil.',
    features: ['Natural white (Luonnonvalkoinen)', '300cm'],
    collection: 'Blank Space'
  },
  {
    id: 'h002',
    title: 'Honey 002',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 35,
    imageUrl: IMAGES.veil2,
    description: 'A shorter, more manageable veil for effortless elegance.',
    features: ['Natural white (Luonnonvalkoinen)', '200cm'],
    collection: 'Blank Space'
  },
  {
    id: 'h004',
    title: 'Honey 004',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 40,
    imageUrl: IMAGES.veil1,
    description: 'A crisp, bright white veil for modern gowns.',
    features: ['Bright white (Kirkkaanvalkoinen)', '270cm'],
    collection: 'Blank Space'
  },
  {
    id: 'h005',
    title: 'Honey 005',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 30,
    imageUrl: IMAGES.veil2,
    description: 'Mid-length bright white veil.',
    features: ['Bright white (Kirkkaanvalkoinen)', '150cm'],
    collection: 'Blank Space'
  },
  {
    id: 'h006',
    title: 'Honey 006',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 20,
    imageUrl: IMAGES.detail1,
    description: 'A subtle pop of colour for the non-traditional bride.',
    features: ['Light pink (Vaaleanpunainen)', '100cm'],
    collection: 'Blank Space'
  },
  {
    id: 'h007',
    title: 'Honey 007',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 30,
    imageUrl: IMAGES.veil1,
    description: 'Short and sweet fingertip veil.',
    features: ['Natural white (Luonnonvalkoinen)', '60cm'],
    collection: 'Blank Space'
  },

  // Collection: Cruel Summer
  {
    id: 'cs-first-sight',
    title: 'First Sight',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 75,
    imageUrl: IMAGES.veil4,
    description: 'A voluminous two-layer veil for a dramatic entrance. Also available for purchase.',
    features: ['Two-layer veil', 'Natural white'],
    collection: 'Cruel Summer',
    buyPrice: 250
  },
  {
    id: 'cs-heirloom',
    title: 'Heirloom',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 55,
    imageUrl: IMAGES.veil3,
    description: 'Timeless elegance with a delicate lace edge.',
    features: ['270cm long', 'Natural white', 'Lace edge'],
    collection: 'Cruel Summer'
  },
  {
    id: 'cs-pearls',
    title: 'Pearls',
    category: 'Veil',
    storeId: 'espoo-rebridal',
    pricePerDay: 50,
    imageUrl: IMAGES.veil1,
    description: 'Scattered pearls create a romantic, starry effect.',
    features: ['270cm long', 'Natural white', 'Pearl details'],
    collection: 'Cruel Summer'
  },
  {
    id: 'cs-stolen-glance',
    title: 'Stolen Glance',
    category: 'Veil',
    storeId: 'espoo-rebridal',
    pricePerDay: 30,
    imageUrl: IMAGES.detail1,
    description: 'A short, rose-colored lace veil for a vintage vibe.',
    features: ['Rose-colored', 'Lace', '50cm'],
    collection: 'Cruel Summer'
  },
  {
    id: 'cs-slow-burn',
    title: 'Slow Burn',
    category: 'Veil',
    storeId: 'espoo-rebridal',
    pricePerDay: 20,
    imageUrl: IMAGES.veil2,
    description: 'Minimalist mini veil with pearl accents.',
    features: ['Mini-length', 'Pearl', 'Natural white'],
    collection: 'Cruel Summer'
  },
  {
    id: 'cs-ever-after',
    title: 'Ever After',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 45,
    imageUrl: IMAGES.veil3,
    description: 'Stunning 3D flowers cascading down a cathedral length veil.',
    features: ['300cm long', 'Lace edge', '3D flowers', 'Natural white'],
    collection: 'Cruel Summer'
  },
  {
    id: 'cs-fated',
    title: 'Fated',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 45,
    imageUrl: IMAGES.veil1,
    description: 'Classic lace edge veil.',
    features: ['270cm long', 'Lace edge', 'Natural white'],
    collection: 'Cruel Summer'
  },

  // Collection: Wildest Dreams
  {
    id: 'wd-aphrodite',
    title: 'Aphrodite',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 55,
    imageUrl: IMAGES.veil4,
    description: 'Double-width for extra volume and drama. Fit for a goddess.',
    features: ['Two-layer', '230cm', 'Double-width', 'Natural white'],
    collection: 'Wildest Dreams',
    buyPrice: 180
  },
  {
    id: 'wd-demeter',
    title: 'Demeter',
    category: 'Veil',
    storeId: 'espoo-rebridal',
    pricePerDay: 30,
    imageUrl: IMAGES.veil2,
    description: 'Earthly elegance in a mini length.',
    features: ['Mini-length', 'Lace', 'Natural white'],
    collection: 'Wildest Dreams'
  },
  {
    id: 'wd-gaia',
    title: 'Gaia',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 35,
    imageUrl: IMAGES.veil3,
    description: 'Organic floral edge design.',
    features: ['220cm long', 'Floral edge', 'Natural white'],
    collection: 'Wildest Dreams'
  },
  {
    id: 'wd-eos',
    title: 'Eos',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 40,
    imageUrl: IMAGES.detail1,
    description: 'Dawn-inspired with light blue rosettes.',
    features: ['40cm', 'Light blue rosettes'],
    collection: 'Wildest Dreams'
  },
  {
    id: 'wd-iris',
    title: 'Iris',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 55,
    imageUrl: IMAGES.veil3,
    description: 'A rainbow of color on a classic silhouette.',
    features: ['Natural white', '300cm', 'Colorful floral edge'],
    collection: 'Wildest Dreams'
  },
  {
    id: 'wd-selene',
    title: 'Selene',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 75,
    imageUrl: IMAGES.veil4,
    description: 'Bold, mysterious, and beautiful. A black veil for the daring bride.',
    features: ['Black', 'Two-layer'],
    collection: 'Wildest Dreams',
    buyPrice: 250
  },
  {
    id: 'wd-hera',
    title: 'Hera',
    category: 'Veil',
    storeId: 'espoo-rebridal',
    pricePerDay: 60,
    imageUrl: IMAGES.veil3,
    description: 'Regal and colorful.',
    features: ['220cm long', 'Natural white', 'Colorful rosettes'],
    collection: 'Wildest Dreams'
  },
  {
    id: 'wd-hestia',
    title: 'Hestia',
    category: 'Veil',
    storeId: 'espoo-rebridal',
    pricePerDay: 50,
    imageUrl: IMAGES.veil1,
    description: 'Warm and inviting with a vine edge.',
    features: ['250cm long', 'Natural white', 'Vine edge'],
    collection: 'Wildest Dreams'
  },
  {
    id: 'wd-athena',
    title: 'Athena',
    category: 'Veil',
    storeId: 'helsinki-oulunkyla',
    pricePerDay: 45,
    imageUrl: IMAGES.veil2,
    description: 'Wisdom and beauty in a shorter package.',
    features: ['50cm', 'Abundant lace edge', 'Natural white'],
    collection: 'Wildest Dreams'
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Emma Bride',
  email: 'emma@example.com',
  role: 'customer'
};

// Start with some existing rentals to demonstrate overlap logic
let RENTALS: Rental[] = [
  {
    id: 'r1',
    userId: 'u2',
    productId: 'h001',
    storeId: 'helsinki-oulunkyla',
    startDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), // 5 days from now
    endDate: new Date(new Date().setDate(new Date().getDate() + 8)).toISOString(),   // 8 days from now
    status: 'reserved',
    paymentStatus: 'paid',
    totalPrice: 120
  },
  {
    id: 'r3',
    userId: 'u3',
    productId: 'cs-pearls', // This is in Espoo
    storeId: 'espoo-rebridal',
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    status: 'active',
    paymentStatus: 'paid',
    totalPrice: 150
  }
];

// --- Service Logic ---

export const getProducts = (storeId?: string): Product[] => {
  if (!storeId) return PRODUCTS;
  return PRODUCTS.filter(p => p.storeId === storeId);
};

export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find(p => p.id === id);
};

// --- Product CRUD ---

export const addProduct = (product: Omit<Product, 'id'>): Promise<Product> => {
  return new Promise((resolve) => {
    const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
    PRODUCTS.push(newProduct);
    setTimeout(() => resolve(newProduct), 500);
  });
};

export const updateProduct = (id: string, updates: Partial<Product>): Promise<Product> => {
  return new Promise((resolve, reject) => {
    const index = PRODUCTS.findIndex(p => p.id === id);
    if (index !== -1) {
      PRODUCTS[index] = { ...PRODUCTS[index], ...updates };
      setTimeout(() => resolve(PRODUCTS[index]), 500);
    } else {
      reject(new Error("Product not found"));
    }
  });
};

export const deleteProduct = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    PRODUCTS = PRODUCTS.filter(p => p.id !== id);
    // Also cleanup rentals for this product? In a real app yes, here maybe just soft delete logic
    setTimeout(() => resolve(true), 500);
  });
};

export const getRentals = (): Rental[] => {
  return RENTALS;
};

// Combine Date and Time strings into ISO String
export const combineDateTime = (dateStr: string, timeStr: string): string => {
  if (!dateStr) return '';
  // Default to noon if no time provided
  const time = timeStr || '12:00'; 
  return new Date(`${dateStr}T${time}:00`).toISOString();
};

export const getProductBookedRanges = (productId: string): { start: Date; end: Date }[] => {
  return RENTALS
    .filter(r => r.productId === productId && r.status !== 'completed')
    .map(r => {
      // Add 24h buffer for cleaning
      const end = new Date(r.endDate);
      end.setDate(end.getDate() + 1);
      return {
        start: new Date(r.startDate),
        end: end
      };
    });
};

// The Hard Part: Date Overlap Logic
export const checkAvailability = (productId: string, start: Date, end: Date): boolean => {
  const ranges = getProductBookedRanges(productId);
  const reqStart = start.getTime();
  const reqEnd = end.getTime();

  for (const range of ranges) {
    const rentStart = range.start.getTime();
    const rentEnd = range.end.getTime();

    // Standard overlap formula: (StartA <= EndB) and (EndA >= StartB)
    if (reqStart <= rentEnd && reqEnd >= rentStart) {
      return false; // Overlap detected
    }
  }
  return true;
};

export const createRental = (rental: Omit<Rental, 'id'>): Promise<Rental> => {
  return new Promise((resolve) => {
    const newRental = { ...rental, id: Math.random().toString(36).substr(2, 9) };
    RENTALS.push(newRental);
    setTimeout(() => resolve(newRental), 500); // Simulate network delay
  });
};

export const updateRental = (id: string, updates: Partial<Rental>): Promise<Rental> => {
  return new Promise((resolve, reject) => {
    const index = RENTALS.findIndex(r => r.id === id);
    if (index !== -1) {
      RENTALS[index] = { ...RENTALS[index], ...updates };
      setTimeout(() => resolve(RENTALS[index]), 500);
    } else {
      reject(new Error("Rental not found"));
    }
  });
};

export const deleteRental = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    RENTALS = RENTALS.filter(r => r.id !== id);
    setTimeout(() => resolve(true), 500);
  });
};

export const processPayment = (amount: number, cardDetails: any): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log(`Processing payment of ${amount}€ for card ending in ${cardDetails.cardNumber.slice(-4)}`);
    setTimeout(() => {
      // 95% success rate simulation
      resolve(Math.random() > 0.05);
    }, 2000);
  });
};