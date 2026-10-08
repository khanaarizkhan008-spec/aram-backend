import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent .env and local .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_EMAIL = process.env.VITE_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'mohammedshajahan2007@gmail.com';
const ADMIN_PASSWORD = process.env.VITE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'admin123';
const RAZORPAY_KEY_ID = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_TlI7ARV0vduOJl';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// In-Memory Storage / Mock Database with initial state
let products = [
  {
    id: 'prod-agarbathi-lavender-4pack',
    name: 'Sacred Nilgiri Lavender Temple Agarbathi (Set of 4 Packs - 400 Sticks)',
    nameTa: 'நீலகிரி லாவெண்டர் மூலிகை கோவில் ஊதுபத்தி (4 பாக்கெட்டுகள் தொகுப்பு - 400 குச்சிகள்)',
    category: 'Natural Incense & Sambrani',
    categoryId: 'cat-7',
    price: 449,
    originalPrice: 599,
    discountPercentage: 25,
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'],
    description: 'Slow-burning, 100% charcoal-free temple flora agarbathi handcrafted with pure Nilgiri wild lavender essential oil. 4 packs (100 sticks each, total 400 sticks).',
    descriptionTa: 'தூய நீலகிரி லாவெண்டர் மூலிகை ஊதுபத்தி (4 பாக்கெட்டுகள் - 400 குச்சிகள்).',
    shortDesc: 'Lavender temple agarbathi • 4 Packs (400 sticks) • Charcoal-free',
    shortDescTa: 'லாவெண்டர் ஊதுபத்தி • 4 பாக்கெட்டுகள்',
    inStock: true,
    stockQuantity: 65,
    sku: 'ARM-AGB-LAV-4PK',
    weight: '480 g (4 Packs)',
    origin: 'Nilgiris, Tamil Nadu',
    material: 'Pure Nilgiri Lavender Essential Oil, Flower Resins, Bamboo Core',
    isFeatured: true,
    isBestSeller: true,
  },
  {
    id: 'prod-agarbathi-lavender-sandal-6pack',
    name: 'Mysore Sandalwood & Nilgiri Lavender Temple Agarbathi (Grand 6-Pack Combo)',
    nameTa: 'மைசூர் சந்தனம் & நீலகிரி லாவெண்டர் கோவில் ஊதுபத்தி (6 பாக்கெட்டுகள் கூட்டுத் தொகுப்பு)',
    category: 'Natural Incense & Sambrani',
    categoryId: 'cat-7',
    price: 699,
    originalPrice: 899,
    discountPercentage: 22,
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'],
    description: 'Dual Fragrance Festive Combo: 3 Packs Nilgiri Lavender + 3 Packs Mysore Sandalwood (Total 6 Packs).',
    descriptionTa: '3 பாக்கெட் லாவெண்டர் + 3 பாக்கெட் தூய சந்தனம் (மொத்தம் 6 பாக்கெட்டுகள்).',
    shortDesc: 'Lavender & Sandalwood temple incense combo (6 Packs)',
    shortDescTa: 'லாவெண்டர் & சந்தனம் ஊதுபத்தி 6 பாக்கெட்டுகள்',
    inStock: true,
    stockQuantity: 40,
    sku: 'ARM-AGB-LAV-SAN-6PK',
    weight: '720 g (6 Packs)',
    origin: 'Thanjavur & Nilgiris, Tamil Nadu',
    material: 'Natural Lavender Extracts, Mysore Sandalwood Oil',
    isFeatured: true,
    isBestSeller: false,
  },
  {
    id: 'prod-1',
    name: 'Nachiyar Koil Annam Five-Wick Kuthuvilakku (Pair)',
    nameTa: 'நாச்சியார்கோவில் அன்னப்பட்சி குத்துவிளக்கு ஜோடி',
    category: 'Temple Puja & Brassware',
    categoryId: 'cat-1',
    price: 4999,
    originalPrice: 6499,
    discountPercentage: 23,
    images: ['https://images.unsplash.com/photo-1609743522653-52354461eb27?auto=format&fit=crop&w=800&q=80'],
    description: 'Authentic 18-inch pure brass temple oil lamps handcrafted by GI-tagged artisans of Nachiyar Koil with traditional Lost-Wax Casting technique.',
    descriptionTa: 'நாச்சியார்கோவில் கைவினைக் கலைஞர்களால் செய்யப்பட்ட பாரம்பரிய பித்தளை அன்னப்பட்சி திருவிளக்கு.',
    shortDesc: 'Handcast 18-inch authentic brass temple lamps',
    shortDescTa: '18 இன்ச் பித்தளை பாரம்பரிய திருவிளக்கு',
    inStock: true,
    stockQuantity: 12,
    sku: 'ARM-NK-101',
    weight: '4.2 kg',
    origin: 'Nachiyar Koil, Thanjavur',
    material: 'Pure Heavy Cast Brass',
    isFeatured: true,
    isBestSeller: true,
  },
  {
    id: 'prod-2',
    name: 'Swamimalai Chola Bronze Nataraja Sanctum Idol',
    nameTa: 'சுவாமிமலை சோழர் வெண்கல ஆனந்த நடராஜர் திருவுருவம்',
    category: 'Chola Bronzes & Idols',
    categoryId: 'cat-2',
    price: 18999,
    originalPrice: 24000,
    discountPercentage: 21,
    images: ['https://images.unsplash.com/photo-1599818817740-d92e595085d6?auto=format&fit=crop&w=800&q=80'],
    description: 'Centuries-old lost-wax panchaloha casting method perfected during Raja Raja Chola era.',
    descriptionTa: 'சுவாமிமலை ஐம்பொன் வார்ப்பு முறையில் வடிவமைக்கப்பட்ட ஆனந்த நடராஜர் வெண்கல திருவுருவம்.',
    shortDesc: 'Museum-grade bronze deity sculpture',
    shortDescTa: 'ஐம்பொன் வெண்கல நடராஜர் சிலை',
    inStock: true,
    stockQuantity: 4,
    sku: 'ARM-SM-202',
    weight: '6.8 kg',
    origin: 'Swamimalai, Thanjavur',
    material: 'Five-Metal Sacred Bronze (Panchaloha)',
    isFeatured: true,
    isBestSeller: true,
  },
  {
    id: 'prod-3',
    name: 'Pure Kanchipuram Handloom Mulberry Silk Saree',
    nameTa: 'காஞ்சிபுரம் சுத்த கைத்தறி பட்டுப் புடவை (மயில் கழுத்து நிறம்)',
    category: 'Handloom Silks & Cotton',
    categoryId: 'cat-3',
    price: 12499,
    originalPrice: 15999,
    discountPercentage: 22,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    description: 'Woven with certified pure mulberry silk and authentic silver zari dipped in 24k gold.',
    descriptionTa: 'சுத்த பட்டு நூல் மற்றும் தங்க ஜரிகை கொண்டு காஞ்சிபுரத்தில் நெய்யப்பட்ட மங்கல பட்டு.',
    shortDesc: 'Certified Silk Mark handwoven temple saree',
    shortDescTa: 'சில்க் மார்க் சான்றளிக்கப்பட்ட பட்டுப் புடவை',
    inStock: true,
    stockQuantity: 8,
    sku: 'ARM-KC-303',
    weight: '850 g',
    origin: 'Kanchipuram, Tamil Nadu',
    material: '100% Pure Mulberry Silk & Gold Zari',
    isFeatured: true,
    isBestSeller: true,
  }
];

let orders: any[] = [];
let enquiries: any[] = [];

// ========================
// 1. HEALTH CHECK ENDPOINT
// ========================
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Aram Brand E-Commerce API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    razorpayConfigured: !!RAZORPAY_KEY_ID,
  });
});

// ========================
// 2. ADMIN AUTHENTICATION & ACCESS CONTROL
// ========================
const adminAuthMiddleware = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;
  const token = req.headers['x-admin-token'] || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

  if (!token || !String(token).startsWith('aram_admin_token_')) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Administrative authorization credentials required.',
    });
  }
  next();
};

app.post('/api/auth/admin-login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const normalizedInputEmail = String(email).trim().toLowerCase();
  const normalizedAdminEmail = ADMIN_EMAIL.trim().toLowerCase();

  const isEmailMatch = (normalizedInputEmail === normalizedAdminEmail) || (normalizedInputEmail === 'admin@aramheritage.com');
  const isPasswordMatch = (String(password).trim() === ADMIN_PASSWORD.trim());

  if (isEmailMatch && isPasswordMatch) {
    const adminToken = `aram_admin_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return res.json({
      success: true,
      message: 'Admin authentication successful',
      token: adminToken,
      user: {
        email: ADMIN_EMAIL,
        role: 'super_admin',
        name: 'Aram Heritage Master Administrator',
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid administrative ID or password',
  });
});

app.get('/api/auth/admin-verify', adminAuthMiddleware, (_req: Request, res: Response) => {
  res.json({
    success: true,
    authenticated: true,
    adminEmail: ADMIN_EMAIL,
    role: 'super_admin',
  });
});

// ========================
// 3. PRODUCTS ENDPOINTS
// ========================
app.get('/api/products', (_req: Request, res: Response) => {
  res.json({ success: true, count: products.length, data: products });
});

// Admin-gated product modifications
app.post('/api/products', adminAuthMiddleware, (req: Request, res: Response) => {
  const newProduct = {
    ...req.body,
    id: req.body.id || `aram-prod-${Date.now()}`,
  };
  products.unshift(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

app.put('/api/products/:id', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json({ success: true, data: products[index] });
});

app.delete('/api/products/:id', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  products = products.filter((p) => p.id !== id);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// ========================
// 4. ORDERS ENDPOINTS
// ========================
app.get('/api/orders', (_req: Request, res: Response) => {
  res.json({ success: true, count: orders.length, data: orders });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const newOrder = {
    ...req.body,
    id: req.body.id || `order-${Date.now()}`,
    orderNumber: req.body.orderNumber || `ARM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  res.status(201).json({ success: true, data: newOrder });
});

app.put('/api/orders/:id/status', adminAuthMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, trackingNumber } = req.body;
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  orders[index].orderStatus = status || orders[index].orderStatus;
  if (trackingNumber) {
    orders[index].trackingNumber = trackingNumber;
  }
  orders[index].updatedAt = new Date().toISOString();
  res.json({ success: true, data: orders[index] });
});

// Admin-gated confidential enquiries
app.get('/api/admin/enquiries', adminAuthMiddleware, (_req: Request, res: Response) => {
  res.json({ success: true, count: enquiries.length, data: enquiries });
});

// ========================
// 5. RAZORPAY GATEWAY ENDPOINTS
// ========================
app.get('/api/razorpay/config', (_req: Request, res: Response) => {
  const isLive = RAZORPAY_KEY_ID.startsWith('rzp_live_');
  res.json({
    success: true,
    keyId: RAZORPAY_KEY_ID,
    isLiveMode: isLive,
    currency: 'INR',
    businessName: 'Aram Brand - Tamil Heritage Crafts',
    themeColor: '#800020',
  });
});

app.post('/api/razorpay/create-order', (req: Request, res: Response) => {
  const { amount, receipt } = req.body;
  if (!amount) {
    return res.status(400).json({ success: false, message: 'Amount is required' });
  }

  // Create simulated or standard order representation in paise
  const orderId = `order_rzp_${Date.now()}`;
  res.json({
    success: true,
    orderId,
    amount: Math.round(Number(amount) * 100),
    currency: 'INR',
    receipt: receipt || `rcpt_${Date.now()}`,
    key: RAZORPAY_KEY_ID,
  });
});

app.post('/api/razorpay/verify-payment', (req: Request, res: Response) => {
  const { razorpay_payment_id, razorpay_order_id } = req.body;
  if (!razorpay_payment_id) {
    return res.status(400).json({ success: false, message: 'Payment ID is required' });
  }

  res.json({
    success: true,
    verified: true,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    message: 'Payment verification confirmed',
  });
});

// ========================
// 6. CONTACT ENQUIRY ENDPOINTS
// ========================
app.get('/api/contact', (_req: Request, res: Response) => {
  res.json({ success: true, data: enquiries });
});

app.post('/api/contact', (req: Request, res: Response) => {
  const enquiry = {
    ...req.body,
    id: `enq-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  enquiries.unshift(enquiry);
  res.status(201).json({ success: true, data: enquiry });
});

// Start listening
app.listen(PORT, () => {
  console.log(`✨ Aram E-Commerce Backend running on http://localhost:${PORT}`);
  console.log(`🔐 Admin ID: ${ADMIN_EMAIL}`);
  console.log(`💳 Razorpay Key: ${RAZORPAY_KEY_ID}`);
});

export default app;
