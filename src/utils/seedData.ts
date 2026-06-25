import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import Product from '../models/Product';

const MONGODB_URI = process.env.MONGODB_URI as string;

const products = [
  // ─── GOLD (6 products) ───────────────────────────────────────────────────
  {
    name: '22K Gold Kundan Necklace Set',
    description:
      'Exquisite 22-karat gold Kundan necklace set featuring intricate meenakari work on the reverse. This bridal masterpiece includes a matching maang tikka and earrings, crafted by skilled artisans from Rajasthan. Each Kundan stone is hand-set in pure gold foil, giving it an unmatched brilliance.',
    price: 45000,
    originalPrice: 52000,
    category: 'gold',
    subcategory: 'set',
    images: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    ],
    stock: 5,
    weight: '42g',
    material: '22K Gold, Kundan Stones, Meenakari Enamel',
    occasion: ['Bridal', 'Wedding', 'Engagement'],
    isFeatured: true,
    ratings: 4.8,
    numReviews: 24,
  },
  {
    name: '18K Gold Diamond Ring',
    description:
      'Elegant solitaire diamond ring crafted in 18-karat gold. Features a 0.25-carat certified diamond set in a four-prong basket setting, flanked by delicate pavé diamonds on the band. Perfect for engagements and anniversaries. Comes with a GIA-certified diamond report.',
    price: 35000,
    originalPrice: 40000,
    category: 'gold',
    subcategory: 'rings',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
    ],
    stock: 8,
    weight: '4.2g',
    material: '18K Gold, 0.25ct Diamond',
    occasion: ['Engagement', 'Anniversary', 'Gift'],
    isFeatured: true,
    ratings: 4.9,
    numReviews: 37,
  },
  {
    name: 'Gold Filigree Jhumka Earrings',
    description:
      'Traditional gold filigree jhumka earrings with intricate wire work. These statement earrings feature a large bell-shaped jhumki suspended from a flat top stud, adorned with tiny granules and twisted wire designs. A perfect fusion of heritage craft and timeless beauty.',
    price: 12000,
    originalPrice: 14500,
    category: 'gold',
    subcategory: 'earrings',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&q=80',
    ],
    stock: 12,
    weight: '8.6g',
    material: '22K Gold',
    occasion: ['Festival', 'Wedding', 'Party'],
    isFeatured: false,
    ratings: 4.6,
    numReviews: 18,
  },
  {
    name: '22K Gold Bangle Set',
    description:
      'Set of four 22-karat gold bangles with a classic diamond-cut finish. Each bangle features a geometric pattern alternating between high-polish and satin textures, creating a beautiful interplay of light. Sold as a set of four bangles.',
    price: 28000,
    originalPrice: 32000,
    category: 'gold',
    subcategory: 'bangles',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9519f94816f7?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    ],
    stock: 6,
    weight: '32g (set of 4)',
    material: '22K Gold',
    occasion: ['Wedding', 'Festival', 'Puja'],
    isFeatured: true,
    ratings: 4.7,
    numReviews: 15,
  },
  {
    name: 'Gold Mangalsutra',
    description:
      'Traditional black-beaded gold mangalsutra with a classic pendant. The pendant features a heart-shaped design with micro-diamonds set in 18-karat gold. The chain consists of alternating black beads and gold beads — a sacred symbol of marriage crafted with modern elegance.',
    price: 18000,
    originalPrice: 21000,
    category: 'gold',
    subcategory: 'necklace',
    images: [
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
    ],
    stock: 10,
    weight: '12g',
    material: '18K Gold, Black Beads, Micro Diamonds',
    occasion: ['Wedding', 'Daily Wear'],
    isFeatured: false,
    ratings: 4.8,
    numReviews: 42,
  },
  {
    name: 'Gold Temple Necklace',
    description:
      'Magnificent South Indian temple necklace crafted in 22-karat gold. Features embossed motifs of deities, floral patterns, and peacocks — all hallmarks of traditional temple jewellery. This necklace is a wearable work of art, ideal for classical dance performances and grand weddings.',
    price: 52000,
    originalPrice: 60000,
    category: 'gold',
    subcategory: 'necklace',
    images: [
      'https://images.unsplash.com/photo-1608050072262-7b1f5dbd7e36?w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    ],
    stock: 3,
    weight: '55g',
    material: '22K Gold',
    occasion: ['Bridal', 'Classical Dance', 'Temple'],
    isFeatured: true,
    ratings: 5.0,
    numReviews: 9,
  },

  // ─── SILVER (6 products) ──────────────────────────────────────────────────
  {
    name: 'Pure Silver Oxidised Necklace',
    description:
      'Handcrafted pure 925 sterling silver necklace with an antique oxidised finish. Features an elaborate pendant with floral and tribal motifs, connected by a thick chain with repeating geometric links. Each piece is hand-oxidised by artisans to achieve the rich dark patina finish.',
    price: 3500,
    originalPrice: 4200,
    category: 'silver',
    subcategory: 'necklace',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    ],
    stock: 20,
    weight: '28g',
    material: '925 Sterling Silver, Oxidised Finish',
    occasion: ['Casual', 'Festival', 'Boho'],
    isFeatured: true,
    ratings: 4.5,
    numReviews: 33,
  },
  {
    name: 'Silver Toe Ring Set',
    description:
      'Traditional pure silver toe ring set consisting of 6 rings — 2 for each foot. Each ring features a different design: floral, geometric, and plain polished bands. The rings are adjustable and open-ended for a comfortable fit on any toe size.',
    price: 800,
    originalPrice: 950,
    category: 'silver',
    subcategory: 'rings',
    images: [
      'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?w=800&q=80',
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80',
    ],
    stock: 35,
    weight: '18g (set of 6)',
    material: '999 Pure Silver',
    occasion: ['Daily Wear', 'Wedding', 'Bridal'],
    isFeatured: false,
    ratings: 4.3,
    numReviews: 67,
  },
  {
    name: 'Silver Filigree Earrings',
    description:
      'Delicate sterling silver filigree drop earrings with intricate lattice work. These lightweight earrings feature a teardrop design created with fine silver wire twisted and woven into elaborate patterns. The fine craftsmanship makes them look fragile yet they are surprisingly durable.',
    price: 2200,
    originalPrice: 2700,
    category: 'silver',
    subcategory: 'earrings',
    images: [
      'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&q=80',
      'https://images.unsplash.com/photo-1526901726531-5fe23eb4a0e9?w=800&q=80',
    ],
    stock: 18,
    weight: '6g',
    material: '925 Sterling Silver',
    occasion: ['Office', 'Party', 'Casual'],
    isFeatured: false,
    ratings: 4.6,
    numReviews: 28,
  },
  {
    name: 'Silver Anklet Pair',
    description:
      'Traditional silver anklets (payal) with ghungroo bells. Each anklet is made of interlocking chain links with small hanging bells that create a melodious sound with every step. Both anklets are adjustable with a simple hook clasp. A bridal and festival staple.',
    price: 2800,
    originalPrice: 3200,
    category: 'silver',
    subcategory: 'anklets',
    images: [
      'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    ],
    stock: 22,
    weight: '24g (pair)',
    material: '999 Pure Silver, Ghungroo Bells',
    occasion: ['Wedding', 'Festival', 'Bridal'],
    isFeatured: true,
    ratings: 4.7,
    numReviews: 51,
  },
  {
    name: '925 Silver Ring',
    description:
      'Minimalist 925 sterling silver statement ring with a hammered finish. The wide band features alternating hammered and polished sections, creating an interesting texture that catches the light beautifully. Perfect for stacking with other rings or wearing alone as a statement piece.',
    price: 1800,
    originalPrice: 2100,
    category: 'silver',
    subcategory: 'rings',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    ],
    stock: 30,
    weight: '5g',
    material: '925 Sterling Silver',
    occasion: ['Daily Wear', 'Office', 'Casual'],
    isFeatured: false,
    ratings: 4.4,
    numReviews: 44,
  },
  {
    name: 'Silver Choker',
    description:
      'Bold 925 sterling silver choker necklace with a modern design. Features a series of interlocking crescent-shaped links that sit flush against the neck for a sleek, contemporary look. The toggle clasp ensures easy wearing. An ideal piece for layering or as a standalone statement.',
    price: 4500,
    originalPrice: 5200,
    category: 'silver',
    subcategory: 'necklace',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
    ],
    stock: 14,
    weight: '18g',
    material: '925 Sterling Silver',
    occasion: ['Party', 'Date Night', 'Formal'],
    isFeatured: false,
    ratings: 4.5,
    numReviews: 19,
  },

  // ─── ARTIFICIAL (8 products) ──────────────────────────────────────────────
  {
    name: 'Kundan Bridal Set',
    description:
      'Stunning Kundan bridal jewellery set comprising a necklace, earrings, maang tikka, and two hair pins. Set in gold-plated brass with high-quality Kundan polki stones and pearl drops. The back of the necklace and earrings are finished with intricate meenakari work in red and green enamel.',
    price: 2500,
    originalPrice: 3200,
    category: 'artificial',
    subcategory: 'set',
    images: [
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9519f94816f7?w=800&q=80',
    ],
    stock: 25,
    weight: '120g (full set)',
    material: 'Gold-plated Brass, Kundan Stones, Meenakari Enamel, Shell Pearls',
    occasion: ['Bridal', 'Wedding', 'Sangeet', 'Mehndi'],
    isFeatured: true,
    ratings: 4.7,
    numReviews: 89,
  },
  {
    name: 'Pearl Drop Earrings',
    description:
      'Elegant pearl drop earrings featuring lustrous shell pearls suspended from a gold-plated lotus flower stud. The pearl measures 10mm and has an excellent surface luster with a smooth nacre finish. Lightweight and comfortable for all-day wear, these earrings transition seamlessly from office to evening.',
    price: 850,
    originalPrice: 1100,
    category: 'artificial',
    subcategory: 'earrings',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&q=80',
    ],
    stock: 50,
    weight: '8g',
    material: 'Gold-plated Alloy, 10mm Shell Pearl',
    occasion: ['Office', 'Casual', 'Party', 'Gift'],
    isFeatured: false,
    ratings: 4.4,
    numReviews: 112,
  },
  {
    name: 'Meenakari Bangles Set',
    description:
      'Vibrant set of 6 Meenakari bangles in assorted colours — royal blue, emerald green, and ruby red. Each bangle is hand-painted with traditional Rajasthani floral patterns in brilliant enamel colours, set against a gold-plated base. The set makes a statement when worn together.',
    price: 1200,
    originalPrice: 1500,
    category: 'artificial',
    subcategory: 'bangles',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9519f94816f7?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    ],
    stock: 40,
    weight: '60g (set of 6)',
    material: 'Gold-plated Brass, Meenakari Enamel',
    occasion: ['Festival', 'Wedding', 'Navratri', 'Party'],
    isFeatured: true,
    ratings: 4.6,
    numReviews: 78,
  },
  {
    name: 'Statement Collar Necklace',
    description:
      'Bold statement collar necklace with geometric design in gold-toned metal. Features an architectural arrangement of hexagonal and triangular components that sit around the neckline. The matte gold finish gives it a contemporary look that pairs beautifully with both Indian and Western outfits.',
    price: 1500,
    originalPrice: 1900,
    category: 'artificial',
    subcategory: 'necklace',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80',
      'https://images.unsplash.com/photo-1608050072262-7b1f5dbd7e36?w=800&q=80',
    ],
    stock: 30,
    weight: '45g',
    material: 'Gold-plated Zinc Alloy',
    occasion: ['Party', 'Formal', 'Date Night'],
    isFeatured: false,
    ratings: 4.3,
    numReviews: 56,
  },
  {
    name: 'Crystal Chandelier Earrings',
    description:
      'Spectacular chandelier earrings featuring cascading tiers of Swarovski-style clear crystals in silver-tone settings. Three tiers of teardrop crystals catch the light and create beautiful reflections. The earrings measure 8cm in length — dramatic, glamorous, and perfect for evenings out.',
    price: 950,
    originalPrice: 1200,
    category: 'artificial',
    subcategory: 'earrings',
    images: [
      'https://images.unsplash.com/photo-1526901726531-5fe23eb4a0e9?w=800&q=80',
      'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&q=80',
    ],
    stock: 45,
    weight: '15g',
    material: 'Silver-plated Alloy, Crystal',
    occasion: ['Party', 'Prom', 'Wedding', 'Cocktail'],
    isFeatured: true,
    ratings: 4.5,
    numReviews: 93,
  },
  {
    name: 'Oxidised Boho Bracelet',
    description:
      'Handcrafted oxidised metal bracelet with a bohemian flair. Features an adjustable cuff design adorned with etched tribal patterns, turquoise stones, and hanging charm drops. The antique dark finish gives it an earthy, rustic look that pairs well with boho-chic outfits.',
    price: 650,
    originalPrice: 850,
    category: 'artificial',
    subcategory: 'bracelet',
    images: [
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
      'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?w=800&q=80',
    ],
    stock: 60,
    weight: '22g',
    material: 'Oxidised Brass, Turquoise Stone',
    occasion: ['Casual', 'Festival', 'Boho', 'Beach'],
    isFeatured: false,
    ratings: 4.2,
    numReviews: 145,
  },
  {
    name: 'Polki Pendant Set',
    description:
      'Uncut Polki diamond-inspired pendant set in gold-plated setting with matching earrings. The pendant features a large central uncut stone surrounded by smaller polki stones and seed pearl accents. The raw, unfinished look of polki gives this set a royal vintage character distinct from modern jewellery.',
    price: 1800,
    originalPrice: 2200,
    category: 'artificial',
    subcategory: 'pendant',
    images: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    ],
    stock: 20,
    weight: '35g (set)',
    material: 'Gold-plated Brass, Polki Stones, Seed Pearls',
    occasion: ['Wedding', 'Festival', 'Sangeet'],
    isFeatured: true,
    ratings: 4.6,
    numReviews: 47,
  },
  {
    name: 'Layered Chain Necklace',
    description:
      'Minimalist multi-strand layered chain necklace in gold-tone. Features three chains of varying lengths (16", 18", and 20") with different styles — a delicate Figaro chain, a flat cable chain, and a fine snake chain — all connected at a single lobster clasp for a cohesive layered look.',
    price: 750,
    originalPrice: 990,
    category: 'artificial',
    subcategory: 'necklace',
    images: [
      'https://images.unsplash.com/photo-1608050072262-7b1f5dbd7e36?w=800&q=80',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80',
    ],
    stock: 55,
    weight: '18g',
    material: 'Gold-plated Brass',
    occasion: ['Daily Wear', 'Office', 'Casual', 'Party'],
    isFeatured: false,
    ratings: 4.4,
    numReviews: 201,
  },
];

const seedDatabase = async (): Promise<void> => {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined. Check your .env file.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    console.log(`Inserting ${products.length} products...`);
    const inserted = await Product.insertMany(products);
    console.log(`Successfully inserted ${inserted.length} products.\n`);

    // Summary
    const goldCount = inserted.filter((p) => p.category === 'gold').length;
    const silverCount = inserted.filter((p) => p.category === 'silver').length;
    const artificialCount = inserted.filter((p) => p.category === 'artificial').length;
    const featuredCount = inserted.filter((p) => p.isFeatured).length;

    console.log('Seed Summary:');
    console.log(`  Gold products:       ${goldCount}`);
    console.log(`  Silver products:     ${silverCount}`);
    console.log(`  Artificial products: ${artificialCount}`);
    console.log(`  Featured products:   ${featuredCount}`);
    console.log(`  Total:               ${inserted.length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed. Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
