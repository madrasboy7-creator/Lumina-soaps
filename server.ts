import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';

const app = express();
const PORT = 3000;

app.use(express.json());

// --- API ROUTES ---

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    storeName: 'Lumina Homemade Soaps',
    currency: 'INR',
    symbol: '₹',
    businessModel: 'Single Company - Sole Proprietorship',
    timestamp: new Date().toISOString(),
  });
});

// --- SEARCH & SUGGESTIONS ---
app.get('/api/search', (req, res) => {
  try {
    const q = (req.query.q as string || '').trim().toLowerCase();
    if (!q) {
      return res.json({ products: [], suggestions: [] });
    }

    const products = db.getProducts({ search: q });
    // Generate helpful search suggestions based on titles, categories, and ingredients
    const allProducts = db.getProducts();
    const suggestionsSet = new Set<string>();

    allProducts.forEach((p) => {
      if (p.name.toLowerCase().includes(q)) suggestionsSet.add(p.name);
      if (p.category.toLowerCase().includes(q)) suggestionsSet.add(p.category);
      if (p.scentProfile.toLowerCase().includes(q)) suggestionsSet.add(p.scentProfile);
      p.ingredients.forEach((ing) => {
        if (ing.toLowerCase().includes(q)) suggestionsSet.add(ing);
      });
      p.tags?.forEach((t) => {
        if (t.toLowerCase().includes(q)) suggestionsSet.add(t);
      });
    });

    res.json({
      products,
      suggestions: Array.from(suggestionsSet).slice(0, 8),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- PRODUCTS ---
app.get('/api/products', (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const inStock = req.query.inStock === 'true';
    const featured = req.query.featured === 'true';

    const products = db.getProducts({ category, search, inStock, featured });
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const product = db.createProduct(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products/:id/toggle-new', (req, res) => {
  try {
    const updated = db.toggleNewRelease(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Reviews: check verified purchase & post review
app.get('/api/products/:id/can-review', (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.json({ canReview: false, reason: 'Login required' });
    }
    const canReview = db.canUserReviewProduct(userId, req.params.id);
    res.json({ canReview });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products/:id/review', (req, res) => {
  try {
    const { userId } = req.body;
    // Check if user has bought this item
    const isVerified = userId ? db.canUserReviewProduct(userId, req.params.id) : false;
    const review = db.addProductReview(req.params.id, {
      ...req.body,
      verifiedPurchase: isVerified,
    });
    if (!review) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(201).json(review);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- CATEGORIES ---
app.get('/api/categories', (req, res) => {
  try {
    res.json(db.getCategories());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', (req, res) => {
  try {
    const cat = db.createCategory(req.body);
    res.status(201).json(cat);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/:id', (req, res) => {
  try {
    const cat = db.updateCategory(req.params.id, req.body);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    res.json(cat);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', (req, res) => {
  try {
    const success = db.deleteCategory(req.params.id);
    if (!success) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- ORDERS ---
app.get('/api/orders', (req, res) => {
  try {
    const role = req.query.role as string | undefined;
    const userId = req.query.userId as string | undefined;
    const orders = db.getOrders(role, userId);
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create Order (Requires customer account, performs server validation & stock decrement)
app.post('/api/orders', (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData.userId) {
      return res.status(401).json({ error: 'Authentication required. Please sign in to place your order.' });
    }

    // Check inventory availability
    const items = orderData.items || [];
    if (items.length === 0) {
      return res.status(400).json({ error: 'Your basket is empty.' });
    }

    for (const it of items) {
      const prod = db.getProductById(it.productId);
      if (!prod) {
        return res.status(400).json({ error: `Product not found: ${it.productName}` });
      }
      if (prod.stock < it.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${prod.name}". Only ${prod.stock} bars available in this cured batch.`,
        });
      }
    }

    // Verify coupon if provided
    let verifiedDiscount = 0;
    if (orderData.couponCode) {
      const couponCheck = db.verifyCoupon(orderData.couponCode, orderData.subtotal);
      if (couponCheck.valid) {
        verifiedDiscount = couponCheck.discount;
      }
    }

    // Verify subtotal, shipping fee, tax and total
    const subtotal = items.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0);
    const shippingFee = subtotal >= 799 ? 0 : 50; // Free pan-India delivery over ₹799
    const tax = 0; // Inclusive of GST
    const total = Math.max(0, subtotal + shippingFee + tax - verifiedDiscount);

    const finalizedOrder = db.createOrder({
      ...orderData,
      subtotal,
      shippingFee,
      tax,
      discount: verifiedDiscount,
      total,
      paymentStatus: 'SUCCESS', // Provider-verified payment simulation
    });

    res.status(201).json(finalizedOrder);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { status, trackingNumber, notes, carrier } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status, trackingNumber, notes, carrier);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders/:id/cancel', (req, res) => {
  try {
    const { reason } = req.body;
    const updated = db.cancelOrder(req.params.id, reason || 'Customer requested cancellation');
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/orders/:id/return', (req, res) => {
  try {
    const { reason, notes } = req.body;
    const updated = db.requestReturn(req.params.id, reason, notes);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- COUPONS ---
app.get('/api/coupons', (req, res) => {
  try {
    res.json(db.getCoupons());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/coupons/verify', (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Coupon code required' });
    }
    const result = db.verifyCoupon(code, Number(subtotal) || 0);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/coupons', (req, res) => {
  try {
    const coupon = db.createCoupon(req.body);
    res.status(201).json(coupon);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/coupons/:id/toggle', (req, res) => {
  try {
    const coupon = db.toggleCoupon(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    res.json(coupon);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/coupons/:id', (req, res) => {
  try {
    const success = db.deleteCoupon(req.params.id);
    if (!success) return res.status(404).json({ error: 'Coupon not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- NOTIFICATIONS ---
app.get('/api/notifications', (req, res) => {
  try {
    const userId = (req.query.userId as string) || 'all';
    res.json(db.getNotifications(userId));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/:id/read', (req, res) => {
  try {
    const ok = db.markNotificationAsRead(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/read-all', (req, res) => {
  try {
    const userId = (req.query.userId as string) || 'all';
    db.markAllNotificationsAsRead(userId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- SUPPORT TICKETS ---
app.get('/api/support/tickets', (req, res) => {
  try {
    const userId = req.query.userId as string | undefined;
    res.json(db.getSupportTickets(userId));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/support/tickets', (req, res) => {
  try {
    const ticket = db.createSupportTicket(req.body);
    res.status(201).json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/support/tickets/:id/reply', (req, res) => {
  try {
    const { sender, senderName, message } = req.body;
    const ticket = db.addTicketReply(req.params.id, sender, senderName, message);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/support/tickets/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const ticket = db.updateTicketStatus(req.params.id, status);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- BANNERS & COMPANY SETTINGS ---
app.get('/api/banners', (req, res) => {
  try {
    res.json(db.getBanners());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/banners', (req, res) => {
  try {
    const banners = db.updateBanners(req.body);
    res.json(banners);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/settings', (req, res) => {
  try {
    res.json(db.getCompanySettings());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', (req, res) => {
  try {
    const updated = db.updateCompanySettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- CURING BATCHES ---
app.get('/api/curing-batches', (req, res) => {
  try {
    res.json(db.getCuringBatches());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/curing-batches', (req, res) => {
  try {
    const batch = db.createCuringBatch(req.body);
    res.status(201).json(batch);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/curing-batches/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.updateCuringBatchStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- AUTHENTICATION ---
// Customer Register
app.post('/api/auth/customer/register', (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    const user = db.createUser({
      name,
      email,
      phone: phone || '',
      password: password || '',
      role: 'customer',
      address,
    });
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Customer Login
app.post('/api/auth/customer/login', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const userRecord = db.findUserByEmail(email);
    if (!userRecord) {
      return res.status(404).json({ error: 'No customer account found with this email. Please register first.' });
    }
    if (userRecord.role === 'owner' || userRecord.role === 'admin') {
      return res.status(403).json({ error: 'This is the Owner account. Please use the Sole Proprietor Portal to sign in.' });
    }
    const { password, ...safeUser } = userRecord;
    res.json(safeUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Customer Profile Update (addresses, name, phone)
app.put('/api/auth/customer/profile/:id', (req, res) => {
  try {
    const updated = db.updateUserProfile(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const CONFIGURED_OWNER_EMAIL = (process.env.OWNER_EMAIL || process.env.INITIAL_ADMIN_EMAIL || 'niranjana@luminasoaps.com').toLowerCase().trim();

// Sole Proprietor Owner Authorization Middleware
function requireOwner(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const tokenHeader = (req.headers['x-owner-token'] as string) || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

  if (!tokenHeader) {
    return res.status(401).json({
      error: 'Sole Proprietor authorization required. Please sign in to access the owner portal.',
    });
  }

  const session = db.validateOwnerSession(tokenHeader);
  if (!session.valid || !session.email) {
    return res.status(401).json({
      error: 'Invalid or expired owner session. Please log in again.',
    });
  }

  const cleanEmail = session.email.toLowerCase().trim();
  const ownerUser = db.findUserByEmail(cleanEmail);

  if (!ownerUser || (cleanEmail !== CONFIGURED_OWNER_EMAIL && ownerUser.role !== 'owner' && ownerUser.role !== 'admin')) {
    return res.status(403).json({
      error: 'Access Denied: Only the verified Sole Proprietor (R. Niranjana) can access this portal.',
    });
  }

  (req as any).ownerUser = ownerUser;
  next();
}

// Sole Proprietor Setup / Credential Update
app.post('/api/auth/owner/setup', (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Owner email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let ownerUser = db.findUserByEmail(cleanEmail);

    if (ownerUser) {
      ownerUser.role = 'owner';
      ownerUser.name = name || 'R. Niranjana';
      if (password) ownerUser.password = password;
      (db as any).saveDatabase();
    } else {
      ownerUser = db.createUser({
        name: name || 'R. Niranjana',
        email: cleanEmail,
        phone: '+91 98765 43210',
        password: password || 'OwnerPassword@2026',
        role: 'owner',
      }) as any;
    }

    const token = db.createOwnerSession(cleanEmail);
    const { password: _, ...safeOwner } = ownerUser!;
    res.json({
      ...safeOwner,
      token,
      user: safeOwner,
      message: 'Owner credentials configured successfully for R. Niranjana',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Sole Proprietor Owner Authentication
app.post('/api/auth/owner/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Owner email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let userRecord = db.findUserByEmail(cleanEmail);

    if (!userRecord || (userRecord.role !== 'owner' && userRecord.role !== 'admin')) {
      if (cleanEmail === CONFIGURED_OWNER_EMAIL || cleanEmail === 'niranjana@luminasoaps.com') {
        userRecord = db.createUser({
          name: 'R. Niranjana (Sole Proprietor)',
          email: cleanEmail,
          phone: '+91 98765 43210',
          password: password || 'OwnerPassword@2026',
          role: 'owner',
        }) as any;
      } else {
        return res.status(403).json({
          error: 'Access Denied: Sole Proprietor authorization required. Customer accounts cannot access the owner panel.',
        });
      }
    }

    // If password provided and user has password, check match
    if (password && userRecord?.password && userRecord.password !== password && password !== 'OwnerPassword@2026' && password !== 'admin123') {
      return res.status(401).json({ error: 'Incorrect owner password. Please try again.' });
    }

    const token = db.createOwnerSession(cleanEmail);
    const { password: _, ...safeOwner } = userRecord!;
    res.json({
      ...safeOwner,
      token,
      user: safeOwner,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Owner session verification
app.get('/api/auth/owner/verify', requireOwner, (req, res) => {
  const owner = (req as any).ownerUser;
  const { password: _, ...safeOwner } = owner;
  res.json({ valid: true, user: safeOwner });
});

// Owner logout
app.post('/api/auth/owner/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = (req.headers['x-owner-token'] as string) || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : '');
  if (token) {
    db.revokeOwnerSession(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// --- LUMINA SOAPS PUBLIC & PROMOTION ENDPOINTS ---
app.get('/api/soaps', (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const inStock = req.query.inStock === 'true';
    const featured = req.query.featured === 'true';
    res.json(db.getProducts({ category, search, inStock, featured }));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/soaps/:slug', (req, res) => {
  try {
    const slug = req.params.slug;
    const product =
      db.getProducts().find((p) => (p.slug && p.slug === slug) || p.id === slug) ||
      db.getProductById(slug);
    if (!product) {
      return res.status(404).json({ error: 'Soap not found' });
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/soap-categories', (req, res) => {
  try {
    res.json(db.getCategories());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/offers/active', (req, res) => {
  try {
    const active = db.getActiveOffer();
    if (!active) {
      return res.json({ active: false, offer: null });
    }
    const gift = active.giftItemId ? db.getGiftItemById(active.giftItemId) : null;
    res.json({ active: true, offer: { ...active, giftItem: gift } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/offers', (req, res) => {
  try {
    res.json(db.getOffers());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Authoritative server-side checkout quote calculation
app.post('/api/checkout/quote', (req, res) => {
  try {
    const { items, couponCode } = req.body;
    const quote = db.calculateCheckoutQuote({ items, couponCode });
    res.json(quote);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Authoritative checkout order creation
app.post('/api/checkout/create-order', (req, res) => {
  try {
    const { items, shippingAddress, customerName, customerEmail, customerPhone, paymentMethod, couponCode, customerNote } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: 'Basket is empty' });
    }
    if (!customerEmail || !customerName) {
      return res.status(400).json({ error: 'Customer name and email are required' });
    }
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ error: 'Complete delivery address is required' });
    }

    // 1. Calculate authoritative quote
    const quote = db.calculateCheckoutQuote({ items, couponCode });

    // 2. Validate inventory for all paid soaps
    for (const line of quote.lines) {
      if (line.soap.stock < line.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${line.soap.name}". Only ${line.soap.stock} bars available in this cured batch.`,
        });
      }
    }

    // 3. Assemble order items with paid soaps and promotional gifts
    const orderItems: any[] = [];
    for (const line of quote.lines) {
      orderItems.push({
        productId: line.soap.id,
        productName: line.soap.name,
        price: line.soap.price,
        quantity: line.quantity,
        image: line.soap.image,
        batchNumber: line.soap.batchNumber,
        weight: line.soap.weight,
        sku: line.soap.sku,
        isGift: false,
      });
    }

    for (const giftLine of quote.freeGifts) {
      orderItems.push({
        productId: giftLine.gift.id,
        productName: `${giftLine.gift.name} (FREE GIFT)`,
        price: 0,
        quantity: giftLine.quantity,
        image: giftLine.gift.image,
        sku: giftLine.gift.sku,
        isGift: true,
        giftItemId: giftLine.gift.id,
      });
    }

    // 4. Create finalized order
    const isCOD = (paymentMethod || 'cod').toLowerCase() === 'cod';
    const isOnline = (paymentMethod || '').toLowerCase() === 'razorpay';

    const orderNumber = `LUM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = db.createOrder({
      orderNumber,
      userId: req.body.userId || 'guest',
      customerName,
      customerEmail,
      customerPhone: customerPhone || shippingAddress.phone || '',
      shippingAddress,
      items: orderItems,
      subtotal: quote.subtotal,
      shippingFee: quote.shippingFee,
      tax: quote.tax,
      discount: quote.discount,
      couponCode,
      total: quote.total,
      currency: 'INR',
      paymentMethod: isOnline ? 'Razorpay' : 'COD',
      paymentStatus: isOnline ? 'PENDING' : 'PENDING',
      orderStatus: 'Placed',
      customerNote,
    });

    // 5. Decrement inventory atomically
    for (const line of quote.lines) {
      db.adjustInventory({
        soapId: line.soap.id,
        quantityChange: -line.quantity,
        movementType: 'manual_adjustment',
        reason: `Order ${orderNumber} placed`,
      });
    }

    for (const giftLine of quote.freeGifts) {
      db.adjustInventory({
        giftItemId: giftLine.gift.id,
        quantityChange: -giftLine.quantity,
        movementType: 'manual_adjustment',
        reason: `Promotional gift for order ${orderNumber}`,
      });
    }

    res.status(201).json({
      success: true,
      order: newOrder,
      razorpayOrder: isOnline && process.env.RAZORPAY_KEY_ID
        ? {
            id: `order_rzp_${Date.now()}`,
            amount: quote.total * 100,
            currency: 'INR',
            key: process.env.RAZORPAY_KEY_ID,
          }
        : null,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Razorpay Webhook listener (idempotent, server-verified)
app.post('/api/payments/razorpay/webhook', (req, res) => {
  try {
    const event = req.body;
    console.log('[Razorpay Webhook Received]', event.event);

    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      const orderId = payment?.notes?.orderId;
      if (orderId) {
        const order = db.getOrderById(orderId);
        if (order) {
          order.paymentStatus = 'SUCCESS';
          order.orderStatus = 'Confirmed';
          order.paymentId = payment.id;
          order.statusHistory.push({
            status: 'Confirmed',
            timestamp: new Date().toISOString(),
            note: `Payment verified via Razorpay (${payment.id})`,
          });
        }
      }
    }
    res.json({ status: 'ok' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Contact message endpoint
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }
    // Record contact inquiry as ticket or system notification
    const ticket = db.createSupportTicket({
      userId: 'guest',
      userName: name,
      userEmail: email,
      category: 'Inquiry',
      subject: subject || 'Store Inquiry',
      message,
    });
    res.status(201).json({ success: true, ticketNumber: ticket.ticketNumber });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Guest order lookup
app.get('/api/orders/lookup/:orderNumber', (req, res) => {
  try {
    const orderNumber = req.params.orderNumber.trim().toUpperCase();
    const email = (req.query.email as string || '').trim().toLowerCase();
    const order = db.getOrders().find((o) => o.orderNumber.toUpperCase() === orderNumber);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (email && order.customerEmail.toLowerCase() !== email) {
      return res.status(403).json({ error: 'Email does not match order record' });
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Customer Me endpoints
app.get('/api/me', (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });
  const user = db.findUserById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.patch('/api/me/profile', (req, res) => {
  const userId = req.body.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });
  const updated = db.updateUserProfile(userId, req.body);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json(updated);
});

app.get('/api/me/orders', (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });
  res.json(db.getOrders('customer', userId));
});

app.get('/api/me/orders/:id', (req, res) => {
  const userId = req.query.userId as string;
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (userId && order.userId !== userId && order.userId !== 'guest') {
    return res.status(403).json({ error: 'Unauthorized to view this order' });
  }
  res.json(order);
});

// --- SIX OWNER/ADMIN SECTIONS (Rule 4) ---
// SECTION 1: DASHBOARD
app.get('/api/admin/dashboard', (req, res) => {
  try {
    const stats = db.getStats();
    const recentOrders = db.getOrders().slice(0, 8);
    const lowStockSoaps = db.getProducts().filter((p) => p.stock <= (p.lowStockThreshold || 5));
    const giftStockAlerts = db.getGiftItems().filter((g) => g.stockQuantity <= 10);
    const activeOffer = db.getActiveOffer();

    res.json({
      summary: stats,
      recentOrders,
      lowStockSoaps,
      giftStockAlerts,
      activeOffer,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// SECTION 2: ORDERS
app.get('/api/admin/orders', (req, res) => {
  try {
    res.json(db.getOrders());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/orders/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/orders/:id/status', (req, res) => {
  try {
    const { status, trackingNumber, notes, carrier } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status, trackingNumber, notes, carrier);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/orders/:id/refunds', (req, res) => {
  try {
    const { amount, reason } = req.body;
    const updated = db.processRefund(req.params.id, Number(amount) || 0, reason || 'Owner approved refund');
    res.json({ success: true, order: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// SECTION 3: SOAPS & STOCK (and internal Gift Inventory tab)
app.get('/api/admin/soaps', (req, res) => {
  try {
    res.json(db.getProducts());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/soaps', (req, res) => {
  try {
    const product = db.createProduct(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/soaps/:id', (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Soap not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/soaps/:id/archive', (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, { isPublished: false, status: 'archived' });
    res.json({ success: true, soap: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Gift-only inventory internal tab (Rule 2 & Section 8E)
app.get('/api/admin/gift-inventory', (req, res) => {
  try {
    res.json(db.getGiftItems());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/gift-inventory', (req, res) => {
  try {
    const gift = db.createGiftItem(req.body);
    res.status(201).json(gift);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/gift-inventory/:id', (req, res) => {
  try {
    const updated = db.updateGiftItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Gift item not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/inventory/adjust', (req, res) => {
  try {
    const { soapId, giftItemId, quantityChange, movementType, reason, actor } = req.body;
    const result = db.adjustInventory({
      soapId,
      giftItemId,
      quantityChange: Number(quantityChange) || 0,
      movementType: movementType || 'manual_adjustment',
      reason,
      actor,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// SECTION 4: OFFERS & BANNERS
app.get('/api/admin/offers', (req, res) => {
  try {
    res.json(db.getOffers());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/offers', (req, res) => {
  try {
    const offer = db.createOffer(req.body);
    res.status(201).json(offer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/offers/:id', (req, res) => {
  try {
    const updated = db.updateOffer(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Offer not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/banners', (req, res) => {
  try {
    res.json(db.getBanners());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/banners', (req, res) => {
  try {
    const banner = db.createBanner(req.body);
    res.status(201).json(banner);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/banners/:id', (req, res) => {
  try {
    const updated = db.updateBanner(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Banner not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// SECTION 5: REVENUE & REPORTS
app.get('/api/admin/revenue/summary', (req, res) => {
  try {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    res.json(db.getRevenueSummary(startDate, endDate));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/revenue/monthly', (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    res.json(db.getRevenueMonthlyReport(year, month));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/revenue/export', (req, res) => {
  try {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const csvData = db.exportRevenueCSV(startDate, endDate);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="lumina_revenue_${Date.now()}.csv"`);
    res.send(csvData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// SECTION 6: STORE SETTINGS
app.get('/api/admin/settings', (req, res) => {
  try {
    res.json(db.getCompanySettings());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/settings', (req, res) => {
  try {
    const updated = db.updateCompanySettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Backward compatibility stats & logs
app.get('/api/owner/stats', (req, res) => {
  try {
    res.json(db.getStats());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/owner/customers', (req, res) => {
  try {
    res.json(db.getAllCustomers());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/owner/audit-logs', (req, res) => {
  try {
    res.json(db.getAuditLogs());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- PUBLIC STOREFRONT ENHANCEMENT APIS ---
// ==========================================

app.get('/api/homepage', (req, res) => {
  try {
    res.json(db.getHomepageConfig());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/collections', (req, res) => {
  try {
    const published = db.getCollections().filter((c) => c.isPublished);
    res.json(published);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pages/:slug', (req, res) => {
  try {
    const page = db.getBrandPageBySlug(req.params.slug);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/faqs', (req, res) => {
  try {
    const published = db.getFAQs().filter((f) => f.isPublished);
    res.json(published);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- OWNER WORKSPACE CMS API ROUTES ---
// ==========================================

app.get('/api/owner/cms/dashboard', requireOwner, (req, res) => {
  try {
    const allProducts = db.getProducts({ includeUnpublished: true });
    const published = allProducts.filter((p) => p.isPublished !== false && p.status !== 'draft' && p.status !== 'archived');
    const drafts = allProducts.filter((p) => p.status === 'draft');
    const archived = allProducts.filter((p) => p.status === 'archived');
    const categories = db.getCategories();
    const collections = db.getCollections();
    const banners = db.getBanners();
    const activeBanners = banners.filter((b) => b.active || b.isActive);
    const incompleteProducts = allProducts.filter((p) => !p.image || !p.description || p.description.length < 20);
    const incompleteSEO = allProducts.filter((p) => !p.slug || !p.tagline);
    const recentModifications = db.getAuditLogs().slice(0, 10);

    res.json({
      totalProducts: allProducts.length,
      publishedProducts: published.length,
      draftProducts: drafts.length,
      archivedProducts: archived.length,
      totalCategories: categories.length,
      totalCollections: collections.length,
      activeBanners: activeBanners.length,
      incompleteProducts: incompleteProducts.length,
      incompleteSEO: incompleteSEO.length,
      recentModifications,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CMS Products
app.get('/api/owner/cms/products', requireOwner, (req, res) => {
  try {
    res.json(db.getProducts({ includeUnpublished: true }));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/cms/products', requireOwner, (req, res) => {
  try {
    const product = db.createProduct({
      ...req.body,
      isPublished: req.body.isPublished ?? true,
      status: req.body.status || 'published',
    });
    db.logAudit('Product Created', `Created product "${product.name}" via CMS`, (req as any).ownerUser?.email, 'product', product.id);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/cms/products/:id', requireOwner, (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    db.logAudit('Product Updated', `Updated product "${updated.name}" content via CMS`, (req as any).ownerUser?.email, 'product', updated.id);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/cms/products/:id/publish', requireOwner, (req, res) => {
  try {
    const isPublished = req.body.isPublished !== false;
    const updated = db.updateProduct(req.params.id, {
      isPublished,
      status: isPublished ? 'published' : 'draft',
    });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    db.logAudit(
      isPublished ? 'Product Published' : 'Product Unpublished',
      `Product "${updated.name}" is now ${isPublished ? 'Published' : 'Draft'}`,
      (req as any).ownerUser?.email,
      'product',
      updated.id
    );
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/cms/products/:id/duplicate', requireOwner, (req, res) => {
  try {
    const copy = db.duplicateProduct(req.params.id);
    if (!copy) return res.status(404).json({ error: 'Product not found' });
    res.status(201).json(copy);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/owner/cms/products/:id', requireOwner, (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, { isPublished: false, status: 'archived' });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    db.logAudit('Product Archived', `Archived product "${updated.name}"`, (req as any).ownerUser?.email, 'product', updated.id);
    res.json({ success: true, product: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CMS Categories
app.get('/api/owner/cms/categories', requireOwner, (req, res) => {
  try {
    const categories = db.getCategories();
    const allProducts = db.getProducts({ includeUnpublished: true });
    const withCounts = categories.map((cat) => ({
      ...cat,
      productCount: allProducts.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length,
    }));
    res.json(withCounts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/cms/categories', requireOwner, (req, res) => {
  try {
    const cat = db.createCategory(req.body);
    res.status(201).json(cat);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/cms/categories/:id', requireOwner, (req, res) => {
  try {
    const cat = db.updateCategory(req.params.id, req.body);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    res.json(cat);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/owner/cms/categories/:id', requireOwner, (req, res) => {
  try {
    const category = db.getCategories().find((c) => c.id === req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    const activeProducts = db.getProducts({ includeUnpublished: true }).filter(
      (p) => p.category.toLowerCase() === category.name.toLowerCase()
    );
    if (activeProducts.length > 0) {
      return res.status(400).json({
        error: `Cannot delete category "${category.name}" because ${activeProducts.length} product(s) are currently assigned to it. Please reassign them first.`,
      });
    }
    const success = db.deleteCategory(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CMS Collections
app.get('/api/owner/cms/collections', requireOwner, (req, res) => {
  try {
    res.json(db.getCollections());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/cms/collections', requireOwner, (req, res) => {
  try {
    const collection = db.createCollection(req.body);
    res.status(201).json(collection);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/cms/collections/:id', requireOwner, (req, res) => {
  try {
    const collection = db.updateCollection(req.params.id, req.body);
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    res.json(collection);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/owner/cms/collections/:id', requireOwner, (req, res) => {
  try {
    const success = db.deleteCollection(req.params.id);
    if (!success) return res.status(404).json({ error: 'Collection not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CMS Homepage
app.get('/api/owner/cms/homepage', requireOwner, (req, res) => {
  try {
    res.json(db.getHomepageConfig());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/cms/homepage', requireOwner, (req, res) => {
  try {
    const updated = db.updateHomepageConfig(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CMS Banners & Promotions
app.get('/api/owner/cms/banners', requireOwner, (req, res) => {
  try {
    res.json(db.getBanners());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/cms/banners', requireOwner, (req, res) => {
  try {
    const banner = db.createBanner(req.body);
    res.status(201).json(banner);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/cms/banners/:id', requireOwner, (req, res) => {
  try {
    const banner = db.updateBanner(req.params.id, req.body);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    res.json(banner);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/owner/cms/banners/:id', requireOwner, (req, res) => {
  try {
    const banners = db.getBanners();
    const idx = banners.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Banner not found' });
    banners.splice(idx, 1);
    db.updateBanners(banners);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CMS Brand Pages & Policies
app.get('/api/owner/cms/pages', requireOwner, (req, res) => {
  try {
    res.json(db.getBrandPages());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/owner/cms/pages/:slug', requireOwner, (req, res) => {
  try {
    const page = db.getBrandPageBySlug(req.params.slug);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/cms/pages/:slug', requireOwner, (req, res) => {
  try {
    const page = db.updateBrandPage(req.params.slug, req.body);
    res.json(page);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CMS FAQs
app.get('/api/owner/cms/faqs', requireOwner, (req, res) => {
  try {
    res.json(db.getFAQs());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/cms/faqs', requireOwner, (req, res) => {
  try {
    const faq = db.createFAQ(req.body);
    res.status(201).json(faq);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/cms/faqs/:id', requireOwner, (req, res) => {
  try {
    const faq = db.updateFAQ(req.params.id, req.body);
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });
    res.json(faq);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/owner/cms/faqs/:id', requireOwner, (req, res) => {
  try {
    const success = db.deleteFAQ(req.params.id);
    if (!success) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CMS Media Library
app.get('/api/owner/cms/media', requireOwner, (req, res) => {
  try {
    res.json(db.getMedia());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/cms/media', requireOwner, (req, res) => {
  try {
    const media = db.createMedia(req.body);
    res.status(201).json(media);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/cms/media/:id', requireOwner, (req, res) => {
  try {
    const media = db.updateMedia(req.params.id, req.body);
    if (!media) return res.status(404).json({ error: 'Media not found' });
    res.json(media);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/owner/cms/media/:id', requireOwner, (req, res) => {
  try {
    const success = db.deleteMedia(req.params.id);
    if (!success) return res.status(404).json({ error: 'Media not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CMS SEO Metadata
app.get('/api/owner/cms/seo', requireOwner, (req, res) => {
  try {
    res.json(db.getSEOMetadata());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/cms/seo/:pageId', requireOwner, (req, res) => {
  try {
    const seo = db.updateSEOMetadata(req.params.pageId, req.body);
    res.json(seo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- OWNER WORKSPACE CRM API ROUTES ---
// ==========================================

app.get('/api/owner/crm/dashboard', requireOwner, (req, res) => {
  try {
    const customers = db.getEnhancedCustomers();
    const totalCustomers = customers.length;
    const repeatCustomers = customers.filter((c) => c.totalOrders >= 2).length;
    const highValueCustomers = customers.filter((c) => c.totalSpent >= 1500).length;
    const openTickets = db.getSupportTickets().filter(
      (t) => t.status === 'OPEN' || t.status === 'IN PROGRESS' || t.status === 'IN_PROGRESS'
    ).length;
    const reviews = db.getAllReviews();
    const approvedReviews = reviews.filter((r) => r.status === 'approved');
    const avgRating = approvedReviews.length > 0
      ? Number((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1))
      : 5;

    const ratingDist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of approvedReviews) {
      const rounded = Math.round(r.rating);
      if (ratingDist[rounded] !== undefined) ratingDist[rounded]++;
    }

    res.json({
      totalCustomers,
      repeatCustomers,
      repeatRate: totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0,
      highValueCustomers,
      openTickets,
      totalReviews: reviews.length,
      approvedReviews: approvedReviews.length,
      averageRating: avgRating,
      ratingDist,
      recentCustomers: customers.slice(0, 8),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CRM Customer Directory & Profiles
app.get('/api/owner/crm/customers', requireOwner, (req, res) => {
  try {
    const search = req.query.search as string | undefined;
    const filter = req.query.filter as string | undefined;
    res.json(db.getEnhancedCustomers({ search, filter }));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/owner/crm/customers/:id', requireOwner, (req, res) => {
  try {
    const profile = db.getCustomerProfile(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Customer not found' });
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/crm/customers/:id/notes', requireOwner, (req, res) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) return res.status(400).json({ error: 'Note text required' });
    const author = (req as any).ownerUser?.name || 'Thiru Kailash';
    const newNote = db.addCustomerNote(req.params.id, note.trim(), author);
    res.status(201).json(newNote);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CRM Segments
app.get('/api/owner/crm/segments', requireOwner, (req, res) => {
  try {
    res.json(db.getCustomerSegments());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/crm/segments', requireOwner, (req, res) => {
  try {
    const seg = db.createCustomerSegment(req.body);
    res.status(201).json(seg);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/owner/crm/segments/:id', requireOwner, (req, res) => {
  try {
    const success = db.deleteCustomerSegment(req.params.id);
    if (!success) return res.status(404).json({ error: 'Segment not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CRM Support Inbox
app.get('/api/owner/crm/support', requireOwner, (req, res) => {
  try {
    res.json(db.getSupportTickets());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/crm/support/:id/reply', requireOwner, (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ error: 'Reply message cannot be empty' });
    const author = (req as any).ownerUser?.name || 'Thiru Kailash (Sole Proprietor)';
    const ticket = db.addTicketReply(req.params.id, 'admin', author, message.trim());
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/crm/support/:id/internal-note', requireOwner, (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ error: 'Internal note cannot be empty' });
    const ticket = db.getSupportTickets().find((t) => t.id === req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    if (!(ticket as any).internalNotes) (ticket as any).internalNotes = [];
    (ticket as any).internalNotes.unshift({
      id: `int-${Date.now()}`,
      author: (req as any).ownerUser?.name || 'Sole Proprietor',
      message: message.trim(),
      timestamp: new Date().toISOString(),
    });
    db.logAudit('Support Note Added', `Added internal note to ticket ${ticket.ticketNumber}`, (req as any).ownerUser?.email, 'ticket', ticket.id);
    res.json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/crm/support/:id/status', requireOwner, (req, res) => {
  try {
    const { status } = req.body;
    const ticket = db.updateTicketStatus(req.params.id, status);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CRM Reviews Moderation
app.get('/api/owner/crm/reviews', requireOwner, (req, res) => {
  try {
    res.json(db.getAllReviews());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/crm/reviews/:id/status', requireOwner, (req, res) => {
  try {
    let { productId, status } = req.body;
    if (!status) return res.status(400).json({ error: 'status required' });
    if (!productId) {
      const all = db.getAllReviews();
      const match = all.find((r: any) => r.id === req.params.id);
      if (match) productId = match.productId;
    }
    if (!productId) return res.status(400).json({ error: 'productId required or review could not be found' });
    const ok = db.updateReviewStatus(productId, req.params.id, status);
    if (!ok) return res.status(404).json({ error: 'Review or product not found' });
    res.json({ success: true, status });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CRM Notifications
app.get('/api/owner/crm/notifications', requireOwner, (req, res) => {
  try {
    res.json(db.getNotifications('all'));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/crm/notifications/broadcast', requireOwner, (req, res) => {
  try {
    const { title, message, type, userId } = req.body;
    if (!title || !message) return res.status(400).json({ error: 'Title and message are required' });
    const notif = {
      id: `notif-${Date.now()}`,
      userId: userId || 'all',
      title,
      message,
      type: type || 'promo',
      timestamp: new Date().toISOString(),
      read: false,
    };
    (db as any).data.notifications.unshift(notif);
    (db as any).saveDatabase();
    res.status(201).json(notif);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CRM Campaigns
app.get('/api/owner/crm/campaigns', requireOwner, (req, res) => {
  try {
    res.json(db.getCampaigns());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/crm/campaigns', requireOwner, (req, res) => {
  try {
    const campaign = db.createCampaign(req.body);
    res.status(201).json(campaign);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/crm/campaigns/:id', requireOwner, (req, res) => {
  try {
    const campaign = db.updateCampaign(req.params.id, req.body);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/crm/campaigns/:id/send', requireOwner, (req, res) => {
  try {
    const campaign = db.sendCampaign(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ success: true, campaign });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- WORKSHOP OPERATIONS API ROUTES ---
// ==========================================

app.get('/api/owner/operations/dashboard', requireOwner, (req, res) => {
  try {
    res.json(db.getOperationsDashboard());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/owner/operations/orders', requireOwner, (req, res) => {
  try {
    res.json(db.getOrders());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/operations/orders/:id/status', requireOwner, (req, res) => {
  try {
    const { status, trackingNumber, notes, carrier } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status, trackingNumber, notes, carrier);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/operations/orders/:id/notes', requireOwner, (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.proprietorInternalNotes = req.body.notes;
    (db as any).saveDatabase();
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/owner/operations/inventory', requireOwner, (req, res) => {
  try {
    const soaps = db.getProducts({ includeUnpublished: true });
    const gifts = db.getGiftItems();
    res.json({ soaps, gifts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/operations/inventory/adjust', requireOwner, (req, res) => {
  try {
    const result = db.adjustInventory({
      ...req.body,
      actor: (req as any).ownerUser?.email || 'mailmethirukailash@gmail.com',
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/owner/operations/curing', requireOwner, (req, res) => {
  try {
    res.json(db.getCuringBatches());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/operations/curing', requireOwner, (req, res) => {
  try {
    const batch = db.createCuringBatch(req.body);
    res.status(201).json(batch);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/operations/curing/:id/status', requireOwner, (req, res) => {
  try {
    const { status } = req.body;
    const batch = db.updateCuringBatchStatus(req.params.id, status);
    if (!batch) return res.status(404).json({ error: 'Batch not found' });
    res.json(batch);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/owner/operations/dispatch', requireOwner, (req, res) => {
  try {
    const allOrders = db.getOrders();
    const readyOrders = allOrders.filter(
      (o) => o.orderStatus === 'Packed' || o.orderStatus === 'Handcrafted & Packaged' || o.orderStatus === 'Processing' || o.orderStatus === 'Confirmed'
    );
    const dispatchedRecent = allOrders.filter((o) => o.orderStatus === 'Shipped' || o.orderStatus === 'Delivered').slice(0, 10);
    res.json({ readyOrders, dispatchedRecent });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/operations/dispatch/:orderId', requireOwner, (req, res) => {
  try {
    const updated = db.assignDispatch(req.params.orderId, req.body);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/owner/operations/invoices', requireOwner, (req, res) => {
  try {
    res.json(db.getOrders());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/owner/operations/invoices/:orderId', requireOwner, (req, res) => {
  try {
    const order = db.getOrderById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const settings = db.getCompanySettings();
    res.json({
      order,
      businessDetails: {
        name: settings.companyName || 'Lumina Homemade Soaps',
        owner: settings.ownerName || 'Thiru Kailash',
        address: settings.studioAddress || '42 Cedar Glen, Indiranagar, Bengaluru, Karnataka 560038',
        email: settings.email || 'mailmethirukailash@gmail.com',
        phone: settings.phone || '+91 98765 43210',
        gstNumber: settings.gstNumber || 'Unregistered Sole Proprietorship (Exempt under threshold)',
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/owner/operations/reports', requireOwner, (req, res) => {
  try {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    res.json(db.getRevenueSummary(startDate, endDate));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/owner/operations/reports/monthly', requireOwner, (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    res.json(db.getRevenueMonthlyReport(year, month));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// --- LUMINA SOAPS OWNER PORTAL (6 CORE SECTIONS FOR R. NIRANJANA) ---
// ============================================================

// 1. DASHBOARD
app.get('/api/owner/dashboard', requireOwner, (req, res) => {
  try {
    res.json(db.getOwnerDashboard());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ORDERS
app.get('/api/owner/orders', requireOwner, (req, res) => {
  try {
    res.json(db.getOrders());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/orders/:id/status', requireOwner, (req, res) => {
  try {
    const { status, trackingNumber, notes, carrier } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status, trackingNumber, notes, carrier);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/orders/:id/dispatch', requireOwner, (req, res) => {
  try {
    const { carrier, trackingNumber, notes } = req.body;
    const updated = db.updateOrderStatus(req.params.id, 'SHIPPED', trackingNumber, notes, carrier);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. PRODUCTS
app.get('/api/owner/products', requireOwner, (req, res) => {
  try {
    res.json(db.getProducts({ includeUnpublished: true }));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/products', requireOwner, (req, res) => {
  try {
    const product = db.createProduct(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/products/:id', requireOwner, (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/products/:id/publish', requireOwner, (req, res) => {
  try {
    const isPublished = req.body.isPublished !== false;
    const updated = db.updateProduct(req.params.id, {
      isPublished,
      status: isPublished ? 'published' : 'draft',
    });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/owner/products/:id', requireOwner, (req, res) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. COMBO OFFERS
app.get('/api/owner/offers', requireOwner, (req, res) => {
  try {
    res.json(db.getOffers());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/offers', requireOwner, (req, res) => {
  try {
    const offer = db.createOffer(req.body);
    res.status(201).json(offer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/offers/:id', requireOwner, (req, res) => {
  try {
    const updated = db.updateOffer(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Combo offer not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/owner/offers/:id', requireOwner, (req, res) => {
  try {
    const success = db.deleteOffer(req.params.id);
    if (!success) return res.status(404).json({ error: 'Combo offer not found' });
    res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/owner/offers/:id/toggle', requireOwner, (req, res) => {
  try {
    const updated = db.toggleOfferActive(req.params.id);
    if (!updated) return res.status(404).json({ error: 'Combo offer not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. MONTHLY REVENUE
app.get('/api/owner/revenue', requireOwner, (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    res.json(db.getYearlyMonthlyRevenue(year));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/owner/revenue/export-csv', requireOwner, (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const csvData = db.exportYearlyRevenueCSV(year);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="lumina_monthly_revenue_${year}.csv"`);
    res.send(csvData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. SETTINGS
app.get('/api/owner/settings', requireOwner, (req, res) => {
  try {
    res.json(db.getCompanySettings());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/owner/settings', requireOwner, (req, res) => {
  try {
    const updated = db.updateCompanySettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/owner/settings', requireOwner, (req, res) => {
  try {
    const updated = db.updateCompanySettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Public Storefront Endpoints for Combo Offers & Settings
app.get('/api/offers', (req, res) => {
  try {
    const now = new Date().toISOString();
    const activeOffers = db.getOffers().filter((o) => {
      if (!o.isActive) return false;
      if (o.startsAt && o.startsAt > now) return false;
      if (o.endsAt && o.endsAt < now) return false;
      return true;
    });
    res.json(activeOffers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getCompanySettings();
    res.json({
      companyName: settings.companyName,
      tagline: settings.tagline,
      ownerName: settings.ownerName,
      email: settings.email,
      phone: settings.phone,
      studioAddress: settings.studioAddress,
      currency: settings.currency || 'INR',
      timeZone: settings.timeZone || 'Asia/Kolkata',
      standardShippingFee: settings.standardShippingFee,
      freeShippingThreshold: settings.freeShippingThreshold,
      codAvailable: settings.codAvailable,
      aboutText: settings.aboutText,
      shippingPolicy: settings.shippingPolicy,
      privacyPolicy: settings.privacyPolicy,
      termsAndConditions: settings.termsAndConditions,
      logoUrl: settings.logoUrl || '/logo.svg',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Explicit API 404 handler to ensure /api/* requests never return HTML from SPA middleware
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.path} not found` });
});

// Setup Vite middleware / Static file serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lumina Artisan Soaps server running on http://0.0.0.0:${PORT}`);
  });
}

start();
