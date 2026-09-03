export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  features: string[];
  stock: number;
}

export const PRODUCTS: ProductDetail[] = [
  {
    id: 'prod-1',
    name: 'Minimalist Mechanical Keyboard',
    price: 129,
    category: 'Peripherals',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80',
    description: 'A compact 75% layout mechanical keyboard featuring hot-swappable tactile switches, pre-lubed stabilizers, and durable PBT keycaps.',
    features: ['Hot-swappable PCB', 'Custom sound dampening foam', 'RGB per-key illumination', 'USB-C detachable braided cable'],
    stock: 14,
  },
  {
    id: 'prod-2',
    name: 'Wireless Noise-Cancelling Headphones',
    price: 249,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Engineered for focus. Hybrid active noise cancellation with 40mm neodymium drivers delivers studio-grade acoustics anywhere.',
    features: ['35-hour battery life', 'Multi-point Bluetooth 5.3', 'Ultra-soft memory foam ear cushions', 'Built-in beamforming mics'],
    stock: 8,
  },
  {
    id: 'prod-3',
    name: 'Ergonomic Precision Mouse',
    price: 79,
    category: 'Peripherals',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    description: 'Designed around natural hand posture to reduce wrist strain during long coding and editing sessions.',
    features: ['26,000 DPI optical sensor', 'Silent mechanical switches', 'Magnetic hyper-scroll wheel', 'Dual wireless + 2.4GHz modes'],
    stock: 22,
  },
  {
    id: 'prod-4',
    name: 'Ultra-Wide Curved Monitor 34"',
    price: 549,
    category: 'Displays',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    description: 'Immersive 1500R curved display with 144Hz refresh rate, 99% sRGB coverage, and 90W USB-C single-cable docking.',
    features: ['3440 x 1440 WQHD resolution', '144Hz high refresh rate', '90W Power Delivery USB-C port', 'Height & tilt adjustable stand'],
    stock: 5,
  },
];