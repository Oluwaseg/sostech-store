import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from '../src/libs/logger';
import { Category } from '../src/models/Category';
import { Subcategory } from '../src/models/SubCategory';
import { User } from '../src/models/User';
import { Product } from '../src/models/Product';

dotenv.config();

interface SeedProduct {
  name: string;
  description: string;
  sku: string;
  basePrice: number;
  stock: number;
  category: string; // category name
  subcategory?: string; // subcategory name
  brand?: string;
  tags: string[];
  isPublished: boolean;
  visibility: 'public' | 'private' | 'archived';
  images?: {
    url: string;
    publicId: string;
    isThumbnail: boolean;
  }[];
}

const seedProducts: SeedProduct[] = [
  // Electronics - Smartphones
  {
    name: 'iPhone 15 Pro Max',
    description:
      'Latest Apple flagship smartphone with A17 Pro chip, titanium design, and advanced camera system',
    sku: 'APPLE-IP15PM-001',
    basePrice: 149999,
    stock: 25,
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'Apple',
    tags: ['smartphone', 'ios', 'flagship', 'apple'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=500',
        publicId: 'sostech/products/iphone-15-1',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Premium Android smartphone with Snapdragon 8 Gen 3, 200MP camera, and dynamic AMOLED display',
    sku: 'SAMSUNG-S24U-001',
    basePrice: 139999,
    stock: 30,
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'Samsung',
    tags: ['smartphone', 'android', 'flagship', 'samsung'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500',
        publicId: 'sostech/products/galaxy-s24-1',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Google Pixel 8 Pro',
    description:
      'Google flagship with Tensor G3, advanced AI features, and exceptional computational photography',
    sku: 'GOOGLE-P8P-001',
    basePrice: 119999,
    stock: 20,
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'Google',
    tags: ['smartphone', 'android', 'pixel', 'google'],
    isPublished: true,
    visibility: 'public',
  },
  {
    name: 'OnePlus 12',
    description:
      'Fast and smooth Android experience with Snapdragon 8 Gen 3, 120Hz AMOLED display, and 100W charging',
    sku: 'ONEPLUS-12-001',
    basePrice: 64999,
    stock: 40,
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'OnePlus',
    tags: ['smartphone', 'android', 'gaming', 'oneplus'],
    isPublished: true,
    visibility: 'public',
  },

  // Electronics - Laptops
  {
    name: 'MacBook Pro 16" M3 Max',
    description:
      'Powerful laptop for professionals with M3 Max chip, 16" Liquid Retina XDR display, and exceptional battery life',
    sku: 'APPLE-MBP16M3-001',
    basePrice: 249999,
    stock: 15,
    category: 'Electronics',
    subcategory: 'Laptops & Computers',
    brand: 'Apple',
    tags: ['laptop', 'macbook', 'professional', 'apple'],
    isPublished: true,
    visibility: 'public',
  },
  {
    name: 'Dell XPS 15',
    description:
      'Premium Windows laptop with Intel Core i9, RTX 4090, 15.6" OLED display, and sleek design',
    sku: 'DELL-XPS15-001',
    basePrice: 189999,
    stock: 18,
    category: 'Electronics',
    subcategory: 'Laptops & Computers',
    brand: 'Dell',
    tags: ['laptop', 'windows', 'gaming', 'professional'],
    isPublished: true,
    visibility: 'public',
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    description:
      'Business laptop with Intel vPro, 14" IPS display, excellent keyboard, and portability',
    sku: 'LENOVO-X1C-001',
    basePrice: 139999,
    stock: 22,
    category: 'Electronics',
    subcategory: 'Laptops & Computers',
    brand: 'Lenovo',
    tags: ['laptop', 'business', 'windows', 'lenovo'],
    isPublished: true,
    visibility: 'public',
  },

  // Electronics - Headphones
  {
    name: 'Sony WH-1000XM5',
    description:
      'Premium noise-cancelling headphones with 30-hour battery life, industry-leading ANC, and premium sound',
    sku: 'SONY-WH1000XM5-001',
    basePrice: 29999,
    stock: 35,
    category: 'Electronics',
    subcategory: 'Headphones & Audio',
    brand: 'Sony',
    tags: ['headphones', 'wireless', 'noise-cancelling', 'premium'],
    isPublished: true,
    visibility: 'public',
  },
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    description:
      'Premium in-ear headphones with ANC, spatial audio, seamless Apple integration, and 6-hour battery',
    sku: 'APPLE-AIRPODS2-001',
    basePrice: 24999,
    stock: 50,
    category: 'Electronics',
    subcategory: 'Headphones & Audio',
    brand: 'Apple',
    tags: ['earbuds', 'wireless', 'airpods', 'apple'],
    isPublished: true,
    visibility: 'public',
  },
  {
    name: 'Bose QuietComfort Ultra Headphones',
    description:
      'Bose premium headphones with industry-leading noise cancellation and immersive sound quality',
    sku: 'BOSE-QCU-001',
    basePrice: 34999,
    stock: 25,
    category: 'Electronics',
    subcategory: 'Headphones & Audio',
    brand: 'Bose',
    tags: ['headphones', 'wireless', 'noise-cancelling', 'bose'],
    isPublished: true,
    visibility: 'public',
  },

  // Fashion - Men's Clothing
  {
    name: 'Premium Cotton T-Shirt',
    description:
      'Classic mens t-shirt made from 100% premium cotton with comfortable fit and durability',
    sku: 'FASHION-TSHIRT-001',
    basePrice: 1499,
    stock: 100,
    category: 'Fashion',
    subcategory: "Men's Clothing",
    brand: 'ClassicWear',
    tags: ['clothing', 'tshirt', 'mens', 'casual'],
    isPublished: true,
    visibility: 'public',
  },
  {
    name: 'Formal Business Shirt',
    description:
      'Professional formal shirt in white and blue, perfect for office and business meetings',
    sku: 'FASHION-FORMAL-001',
    basePrice: 3499,
    stock: 60,
    category: 'Fashion',
    subcategory: "Men's Clothing",
    brand: 'FormalWear',
    tags: ['clothing', 'formal', 'mens', 'business'],
    isPublished: true,
    visibility: 'public',
  },

  // Fashion - Shoes
  {
    name: 'Running Athletic Shoes',
    description:
      'Lightweight running shoes with cushioned sole, breathable mesh, and excellent support',
    sku: 'FASHION-RUNNING-001',
    basePrice: 4999,
    stock: 80,
    category: 'Fashion',
    subcategory: 'Shoes',
    brand: 'SportGear',
    tags: ['shoes', 'running', 'athletic', 'sports'],
    isPublished: true,
    visibility: 'public',
  },
  {
    name: 'Casual Sneakers',
    description:
      'Trendy casual sneakers in multiple colors with comfortable padding and stylish design',
    sku: 'FASHION-SNEAKER-001',
    basePrice: 3999,
    stock: 90,
    category: 'Fashion',
    subcategory: 'Shoes',
    brand: 'StreetStyle',
    tags: ['shoes', 'sneakers', 'casual', 'mens'],
    isPublished: true,
    visibility: 'public',
  },

  // Home & Garden - Furniture
  {
    name: 'Wooden Dining Table',
    description:
      'Elegant dining table made from solid wood, seats 6 people, with beautiful finish',
    sku: 'HOME-DINING-001',
    basePrice: 24999,
    stock: 12,
    category: 'Home & Garden',
    subcategory: 'Furniture',
    brand: 'HomeDecor',
    tags: ['furniture', 'dining', 'wooden', 'home'],
    isPublished: true,
    visibility: 'public',
  },
  {
    name: 'Comfortable Office Chair',
    description:
      'Ergonomic office chair with lumbar support, adjustable height, and breathable mesh back',
    sku: 'HOME-CHAIR-001',
    basePrice: 8999,
    stock: 40,
    category: 'Home & Garden',
    subcategory: 'Furniture',
    brand: 'OfficeMax',
    tags: ['furniture', 'chair', 'office', 'ergonomic'],
    isPublished: true,
    visibility: 'public',
  },

  // Sports & Outdoors
  {
    name: 'Yoga Mat',
    description:
      'Premium non-slip yoga mat with extra cushioning for comfort during exercise',
    sku: 'SPORTS-YOGA-001',
    basePrice: 1999,
    stock: 150,
    category: 'Sports & Outdoors',
    subcategory: 'Fitness Equipment',
    brand: 'FitLife',
    tags: ['yoga', 'fitness', 'mat', 'exercise'],
    isPublished: true,
    visibility: 'public',
  },
  {
    name: 'Camping Tent',
    description:
      '4-person camping tent with waterproof material and easy setup for outdoor adventures',
    sku: 'SPORTS-TENT-001',
    basePrice: 5999,
    stock: 30,
    category: 'Sports & Outdoors',
    subcategory: 'Outdoor Gear',
    brand: 'OutdoorGear',
    tags: ['camping', 'tent', 'outdoor', 'adventure'],
    isPublished: true,
    visibility: 'public',
  },

  // Books & Media
  {
    name: 'The Art of Programming',
    description:
      'Comprehensive guide to programming concepts and best practices for developers',
    sku: 'BOOKS-PROG-001',
    basePrice: 1299,
    stock: 50,
    category: 'Books & Media',
    subcategory: 'Non-Fiction Books',
    brand: 'TechPress',
    tags: ['book', 'programming', 'education', 'technology'],
    isPublished: true,
    visibility: 'public',
  },
  {
    name: 'Fiction Adventure Novel',
    description:
      'Thrilling adventure novel with engaging characters and unexpected plot twists',
    sku: 'BOOKS-FICTION-001',
    basePrice: 599,
    stock: 80,
    category: 'Books & Media',
    subcategory: 'Fiction Books',
    brand: 'NovelPress',
    tags: ['book', 'fiction', 'adventure', 'novel'],
    isPublished: true,
    visibility: 'public',
  },

  // Beauty & Personal Care
  {
    name: 'Moisturizing Face Cream',
    description:
      'Hydrating face cream with natural ingredients for soft and glowing skin',
    sku: 'BEAUTY-CREAM-001',
    basePrice: 999,
    stock: 200,
    category: 'Beauty & Personal Care',
    subcategory: 'Skincare',
    brand: 'BeautySpa',
    tags: ['skincare', 'cream', 'moisturizer', 'natural'],
    isPublished: true,
    visibility: 'public',
  },
  {
    name: 'Premium Makeup Set',
    description:
      'Complete makeup set with foundation, lipstick, eyeshadow, and brushes',
    sku: 'BEAUTY-MAKEUP-001',
    basePrice: 2499,
    stock: 75,
    category: 'Beauty & Personal Care',
    subcategory: 'Makeup',
    brand: 'GlamourPro',
    tags: ['makeup', 'cosmetics', 'beauty', 'set'],
    isPublished: true,
    visibility: 'public',
  },

  // Toys & Games
  {
    name: 'Action Figure Collection',
    description:
      'Set of 5 detailed action figures with articulated joints and accessories',
    sku: 'TOYS-ACTION-001',
    basePrice: 1499,
    stock: 60,
    category: 'Toys & Games',
    subcategory: 'Action Figures',
    brand: 'ActionPlay',
    tags: ['toys', 'action-figures', 'collectibles', 'figurines'],
    isPublished: true,
    visibility: 'public',
  },
  {
    name: 'Latest AAA Video Game',
    description:
      'Epic adventure video game for PS5/Xbox Series X with stunning graphics and immersive gameplay',
    sku: 'GAMES-AAA-001',
    basePrice: 4999,
    stock: 45,
    category: 'Toys & Games',
    subcategory: 'Video Games',
    brand: 'GameStudio',
    tags: ['video-game', 'gaming', 'ps5', 'xbox'],
    isPublished: true,
    visibility: 'public',
  },

  // Automotive
  {
    name: 'Car Seat Covers Set',
    description:
      'Premium car seat covers with cushioning for comfort and protection',
    sku: 'AUTO-SEAT-001',
    basePrice: 3499,
    stock: 55,
    category: 'Automotive',
    subcategory: 'Car Accessories',
    brand: 'AutoCare',
    tags: ['car-accessories', 'seat-covers', 'automotive'],
    isPublished: true,
    visibility: 'public',
  },
];

async function connectDB(): Promise<void> {
  try {
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/sostech-store';

    await mongoose.connect(mongoUri);
    logger.info(`MongoDB connected to: ${mongoUri}`);
  } catch (error) {
    logger.error(
      `Failed to connect to MongoDB: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    process.exit(1);
  }
}

async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error(
      `Failed to disconnect from MongoDB: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    process.exit(1);
  }
}

async function seedProductsData(): Promise<void> {
  try {
    await connectDB();

    // Get a default user (admin) who will be the creator
    const adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      logger.error(
        'No admin user found. Please create an admin user first.'
      );
      await disconnectDB();
      process.exit(1);
    }

    logger.info(`Using admin user: ${adminUser.name} (${adminUser.email})`);

    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const seedProduct of seedProducts) {
      try {
        // Check if product already exists by SKU
        const existingProduct = await Product.findOne({ sku: seedProduct.sku });

        if (existingProduct) {
          logger.warn(
            `Product with SKU "${seedProduct.sku}" already exists. Skipping...`
          );
          skippedCount++;
          continue;
        }

        // Find category
        const category = await Category.findOne({
          name: seedProduct.category,
        });

        if (!category) {
          logger.error(
            `Category "${seedProduct.category}" not found for product "${seedProduct.name}"`
          );
          errorCount++;
          continue;
        }

        // Find subcategory if provided
        let subcategoryId: mongoose.Types.ObjectId | undefined;
        if (seedProduct.subcategory) {
          const subcategory = await Subcategory.findOne({
            name: seedProduct.subcategory,
          });

          if (!subcategory) {
            logger.error(
              `Subcategory "${seedProduct.subcategory}" not found for product "${seedProduct.name}"`
            );
            errorCount++;
            continue;
          }

          subcategoryId = subcategory._id;
        }

        // Create product
        const newProduct = await Product.create({
          name: seedProduct.name,
          description: seedProduct.description,
          sku: seedProduct.sku,
          basePrice: seedProduct.basePrice,
          stock: seedProduct.stock,
          category: category._id,
          subcategory: subcategoryId,
          brand: seedProduct.brand,
          tags: seedProduct.tags,
          isPublished: seedProduct.isPublished,
          visibility: seedProduct.visibility,
          images: seedProduct.images || [],
          createdBy: adminUser._id,
        });

        logger.info(`Created product: ${newProduct.name} (${newProduct.sku})`);
        createdCount++;
      } catch (error) {
        logger.error(
          `Failed to create product "${seedProduct.name}": ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        errorCount++;
      }
    }

    logger.info(
      `\n========== PRODUCT SEED COMPLETE ==========\nCreated: ${createdCount} products\nSkipped: ${skippedCount} products\nErrors: ${errorCount}\nTotal: ${seedProducts.length}\n=========================================`
    );

    await disconnectDB();
  } catch (error) {
    logger.error(
      `Seed script failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    await disconnectDB();
    process.exit(1);
  }
}

// Run the seed script
seedProductsData().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});
