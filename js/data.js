// In a real deployment, replace this with a fetch() to your product API.
export const categories = ['All', 'Audio', 'Wearables', 'Home', 'Accessories']

export const products = [
  {
    id: 'p1',
    title: 'Wireless Over-Ear Headphones',
    category: 'Audio',
    price: 89.99,
    rating: 4.6,
    image: 'https://picsum.photos/seed/p1/600/600',
    description:
      'Noise-isolating wireless headphones with 30-hour battery life and plush memory-foam ear cups.',
  },
  {
    id: 'p2',
    title: 'Fitness Tracker Band',
    category: 'Wearables',
    price: 49.5,
    rating: 4.2,
    image: 'https://picsum.photos/seed/p2/600/600',
    description:
      'Track steps, heart rate, and sleep with a lightweight band and a 10-day battery life.',
  },
  {
    id: 'p3',
    title: 'Smart LED Desk Lamp',
    category: 'Home',
    price: 34.0,
    rating: 4.4,
    image: 'https://picsum.photos/seed/p3/600/600',
    description:
      'Adjustable brightness and color temperature desk lamp with USB charging port.',
  },
  {
    id: 'p4',
    title: 'Leather Laptop Sleeve',
    category: 'Accessories',
    price: 27.25,
    rating: 4.8,
    image: 'https://picsum.photos/seed/p4/600/600',
    description:
      'Slim, water-resistant sleeve with a soft microfiber lining, fits up to 15" laptops.',
  },
  {
    id: 'p5',
    title: 'Portable Bluetooth Speaker',
    category: 'Audio',
    price: 59.99,
    rating: 4.5,
    image: 'https://picsum.photos/seed/p5/600/600',
    description:
      'Compact, waterproof speaker with rich bass and 12 hours of playtime.',
  },
  {
    id: 'p6',
    title: 'Smart Watch Series X',
    category: 'Wearables',
    price: 149.0,
    rating: 4.3,
    image: 'https://picsum.photos/seed/p6/600/600',
    description:
      'GPS-enabled smartwatch with always-on display and workout tracking.',
  },
  {
    id: 'p7',
    title: 'Ceramic Pour-Over Coffee Set',
    category: 'Home',
    price: 42.0,
    rating: 4.7,
    image: 'https://picsum.photos/seed/p7/600/600',
    description:
      'Hand-glazed ceramic dripper and carafe set for a smooth, full-bodied brew.',
  },
  {
    id: 'p8',
    title: 'Minimalist Wallet',
    category: 'Accessories',
    price: 22.5,
    rating: 4.1,
    image: 'https://picsum.photos/seed/p8/600/600',
    description:
      'RFID-blocking slim wallet with a quick-access pull tab, holds up to 8 cards.',
  },
]

export function getProductById(id) {
  return products.find((p) => p.id === id)
}
