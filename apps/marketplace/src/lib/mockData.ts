import type { ParishStore, ParishSummary, StoreProduct, DonationGoal, StoreVendor } from '@/types/store';

// ─────────────────────────────────────────────────────────────────────────────
// Parish 1 — St. Edmond, Lafayette LA
// ─────────────────────────────────────────────────────────────────────────────
const ST_MARY: ParishStore = {
  id: 'st-edmond',
  name: 'St. Edmond',
  tagline: 'At the Corner of Mercy and Love',
  heroImageUrl: 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/stedmund_church.jpg',
  logoUrl: 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/PM-_LogoSaintEdmond.jpg',
  primaryColor: '#1A56A0',
  accentColor: '#0088CC',
  city: 'Lafayette',
  state: 'LA',
  products: [
    { id: 'sm-p1', name: 'Rosary Beads — Hematite', description: 'Handcrafted hematite rosary with sterling silver cross.', price: 24.99, imageUrl: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=600&q=80', images: ['https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=600&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'], category: 'religious', inStock: true, badge: 'Bestseller', parishId: 'st-edmond', parishName: 'St. Edmond' },
    { id: 'sm-p2', name: 'Saint Michael Medal', description: 'Solid bronze patron saint medal with engraved prayer on the back.', price: 18.50, imageUrl: 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=400&q=75', category: 'religious', inStock: true, parishId: 'st-edmond', parishName: 'St. Edmond' },
    { id: 'sm-p3', name: 'Holy Water Bottle', description: 'Elegant glass bottle with silver cap. Blessed water included.', price: 12.00, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75', category: 'religious', inStock: false, parishId: 'st-edmond', parishName: 'St. Edmond' },
    { id: 'sm-p4', name: 'Parish Hoodie — Navy', description: 'St. Edmond embroidered hoodie. 80% cotton, 20% polyester.', price: 45.00, imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=75', category: 'merch', inStock: true, badge: 'New', parishId: 'st-edmond', parishName: 'St. Edmond' },
    { id: 'sm-p5', name: 'Parish Tote Bag', description: 'Canvas tote with St. Edmond cross logo. 100% organic cotton.', price: 22.00, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=75', category: 'merch', inStock: true, parishId: 'st-edmond', parishName: 'St. Edmond' },
    { id: 'sm-p6', name: 'Daily Prayer Journal', description: 'Leather-bound journal for daily prayer, reflection, and gratitude.', price: 19.99, imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&q=75', category: 'religious', inStock: true, parishId: 'st-edmond', parishName: 'St. Edmond' },
  ],
  donationGoals: [
    { id: 'sm-d1', title: 'New Organ Fund', description: 'Help us replace our aging pipe organ to enrich Sunday Mass at St. Edmond.', goalAmount: 50000, raisedAmount: 31250, imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&q=75', endsAt: '2025-12-31', parishId: 'st-edmond', parishName: 'St. Edmond' },
    { id: 'sm-d2', title: 'Youth Ministry Camp', description: 'Send 30 teens from St. Edmond to a Catholic summer retreat this July.', goalAmount: 8000, raisedAmount: 5400, imageUrl: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=600&q=75', endsAt: '2025-06-30', parishId: 'st-edmond', parishName: 'St. Edmond' },
  ],
  vendors: [
    {
      id: 'sm-v1', name: "Meraki", tagline: 'Homemade pastries baked with love.',
      logoUrl: 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/storage/MERAKI_LOGO-22.jpg',
      bannerUrl: 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/storage/MERAKI_BACK-23.jpg',
      category: 'Food & Beverage', parishId: 'st-edmond', parishName: 'St. Edmond',
      about: "Family-owned bakery serving the St. Edmond community since 2002. Everything is made fresh daily using recipes passed down through three generations.",
      services: [
        { id: 'sm-v1-s1', vendorId: 'sm-v1', name: 'Pastry Box (Dozen)', description: 'Box of 12 freshly baked assorted pastries. Perfect for after-Mass gatherings.', price: 18.00, imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=75', available: true, badge: 'Bestseller' },
        { id: 'sm-v1-s2', vendorId: 'sm-v1', name: 'Fresh Bread Loaf', description: 'Traditional artisan bread, baked fresh daily. Pick up at the bakery.', price: 6.00, imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7b?w=400&q=75', available: true },
        { id: 'sm-v1-s3', vendorId: 'sm-v1', name: 'First Communion Cake', description: 'Custom 8-inch celebration cake with religious decoration. Order 1 week ahead.', price: 85.00, priceLabel: 'starting at', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=75', available: true },
      ],
    },
    {
      id: 'sm-v2', name: 'Holy Cross Flowers', tagline: 'Floral arrangements for every sacred occasion.',
      logoUrl: 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/MockData/pexels-eugene-golovesov-1810803-28038077.jpg',
      bannerUrl: 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/MockData/pexels-adanaiuliana-12189793.jpg',
      category: 'Florals', parishId: 'st-edmond', parishName: 'St. Edmond',
      about: "Holy Cross Flowers has decorated St. Edmond's altar every Sunday for 15 years. We specialize in liturgical and celebration florals rooted in faith and beauty.",
      services: [
        { id: 'sm-v2-s1', vendorId: 'sm-v2', name: 'Sunday Altar Arrangement', description: 'Fresh seasonal floral arrangement for the Sunday Mass altar. Delivered Saturday.', price: 120.00, priceLabel: 'starting at', imageUrl: 'https://images.unsplash.com/photo-1487530811015-780cfc49b0bd?w=400&q=75', available: true },
        { id: 'sm-v2-s2', vendorId: 'sm-v2', name: 'Funeral Wreath', description: 'White lily and rose wreath for a dignified and prayerful farewell.', price: 95.00, imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&q=75', available: true },
        { id: 'sm-v2-s3', vendorId: 'sm-v2', name: 'Bridal Bouquet', description: 'Custom bridal bouquet for Catholic church weddings. Consultation included.', price: 150.00, priceLabel: 'starting at', imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=75', available: true },
      ],
    },
    {
      id: 'sm-v3', name: 'Familia Insurance', tagline: 'Protecting families with faith and integrity since 1998.',
      logoUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=200&fit=crop&q=75',
      bannerUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80',
      category: 'Financial Services', parishId: 'st-edmond', parishName: 'St. Edmond',
      about: "Familia Insurance has served the Lafayette Catholic community for over 25 years. We offer parishioner discounts and bilingual service. A portion of every policy supports St. Edmond.",
      services: [
        { id: 'sm-v3-s1', vendorId: 'sm-v3', name: 'Auto Insurance Quote', description: 'Free comprehensive auto insurance comparison. Parishioner discounts available.', price: 0, priceLabel: 'Free', imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=75', available: true },
        { id: 'sm-v3-s2', vendorId: 'sm-v3', name: 'Life Insurance Review', description: "30-minute life policy review — protect your family's future with an expert.", price: 0, priceLabel: 'Free', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=75', available: true },
        { id: 'sm-v3-s3', vendorId: 'sm-v3', name: 'Home & Auto Bundle', description: 'Combined home and auto bundle with exclusive parish member discount.', price: 89.00, priceLabel: 'from per month', imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=75', available: true },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Parish 2 — St. Katharine Drexel, Weston FL
// ─────────────────────────────────────────────────────────────────────────────
const ST_PATRICKS: ParishStore = {
  id: 'st-katharine',
  name: 'St. Katharine Drexel',
  tagline: 'One Body, One Spirit, One Family',
  heroImageUrl: 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/SKD+Fachada.png',
  logoUrl: 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/stkat_logo.jpg',
  primaryColor: '#1A4D2E',
  accentColor: '#0088CC',
  city: 'Weston',
  state: 'FL',
  products: [
    { id: 'sp-p1', name: 'Bronze Crucifix — Wall', description: 'Hand-cast bronze wall crucifix with detailed corpus. Suitable for home or office.', price: 34.00, imageUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&q=80', images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80'], category: 'religious', inStock: true, badge: 'Handcrafted', parishId: 'st-katharine', parishName: 'St. Katharine Drexel' },
    { id: 'sp-p2', name: 'St. Katharine Drexel Medal', description: 'Sterling silver patron saint medal, blessed at Sunday Mass.', price: 14.00, imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=75', category: 'religious', inStock: true, parishId: 'st-katharine', parishName: 'St. Katharine Drexel' },
    { id: 'sp-p3', name: 'Illustrated Catholic Bible', description: 'Full-color illustrated New American Bible, hardcover edition.', price: 42.00, imageUrl: 'https://images.unsplash.com/photo-1585845328078-7b5fdb2e3e04?w=400&q=75', category: 'religious', inStock: true, parishId: 'st-katharine', parishName: 'St. Katharine Drexel' },
    { id: 'sp-p4', name: 'Parish Zip-Up Hoodie', description: 'St. Katharine Drexel embroidered zip-up. Green with white crest.', price: 52.00, imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=75', category: 'merch', inStock: true, badge: 'New', parishId: 'st-katharine', parishName: 'St. Katharine Drexel' },
    { id: 'sp-p5', name: 'Parish Baseball Cap', description: 'Embroidered cap with the St. Katharine Drexel crest. One size fits most.', price: 28.00, imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=75', category: 'merch', inStock: true, parishId: 'st-katharine', parishName: 'St. Katharine Drexel' },
    { id: 'sp-p6', name: 'Blessed Beeswax Candle', description: 'Pure beeswax pillar candle, hand-poured and blessed at Sunday Mass.', price: 16.00, imageUrl: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?w=400&q=75', category: 'religious', inStock: false, parishId: 'st-katharine', parishName: 'St. Katharine Drexel' },
  ],
  donationGoals: [
    { id: 'sp-d1', title: 'Chapel Renovation Fund', description: 'Help us restore and beautify our chapel to better serve our growing St. Katharine Drexel community.', goalAmount: 120000, raisedAmount: 67800, imageUrl: 'https://images.unsplash.com/photo-1532009877282-3340270e0529?w=600&q=75', endsAt: '2025-11-15', parishId: 'st-katharine', parishName: 'St. Katharine Drexel' },
    { id: 'sp-d2', title: 'Mission Trip Fund', description: 'Send 20 parishioners on a service mission trip to support Catholic communities in need.', goalAmount: 35000, raisedAmount: 12400, imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=75', endsAt: '2026-03-17', parishId: 'st-katharine', parishName: 'St. Katharine Drexel' },
  ],
  vendors: [
    {
      id: 'sp-v1', name: "O'Brien's Irish Deli", tagline: 'Authentic deli fare loved by the community since 1981.',
      logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop&q=75',
      bannerUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      category: 'Food & Beverage', parishId: 'st-katharine', parishName: 'St. Katharine Drexel',
      about: "A Weston favorite for over four decades. O'Brien's sources from local farms and donates 5% of every parish event order directly to St. Katharine Drexel.",
      services: [
        { id: 'sp-v1-s1', vendorId: 'sp-v1', name: 'Parish Luncheon Tray', description: 'Deli meat and cheese party tray, serves 15–20. Special pricing for parish events.', price: 65.00, imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=75', available: true, badge: 'Parish Special' },
        { id: 'sp-v1-s2', vendorId: 'sp-v1', name: 'Artisan Bread Loaf', description: 'Freshly baked artisan loaf. Made every morning in-house.', price: 9.00, imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7b?w=400&q=75', available: true },
        { id: 'sp-v1-s3', vendorId: 'sp-v1', name: 'Signature Sandwich', description: 'House-cured meat on fresh-baked bread with house-made condiments.', price: 14.50, imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=75', available: true },
      ],
    },
    {
      id: 'sp-v2', name: 'Emerald Isle Books', tagline: 'New and used Catholic and local interest books.',
      logoUrl: 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/MockData/pexels-celine-3776818-35285385.jpg',
      bannerUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
      category: 'Books & Media', parishId: 'st-katharine', parishName: 'St. Katharine Drexel',
      about: "Curated Catholic literature and local interest titles. Every purchase helps fund the parish library and reading programs for youth at St. Katharine Drexel. We host monthly book clubs for parishioners.",
      services: [
        { id: 'sp-v2-s1', vendorId: 'sp-v2', name: 'Catholic Lectionary (Current Year)', description: 'Sunday and weekday lectionary for the current liturgical year.', price: 28.00, imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=75', available: true },
        { id: 'sp-v2-s2', vendorId: 'sp-v2', name: 'Faith Formation Bundle', description: 'Curated 3-book bundle on Catholic faith, history, and prayer.', price: 45.00, imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=75', available: true, badge: 'Bundle' },
        { id: 'sp-v2-s3', vendorId: 'sp-v2', name: 'Book Club Membership', description: 'Monthly Catholic reads, delivered to your door. Cancel anytime.', price: 19.00, priceLabel: 'per month', imageUrl: 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/MockData/pexels-alleksana-7430714.jpg', available: true },
      ],
    },
    {
      id: 'sp-v3', name: 'Kelly & Sons Law', tagline: 'Family and estate law. Free parish consultation.',
      logoUrl: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=200&h=200&fit=crop&q=75',
      bannerUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
      category: 'Legal Services', parishId: 'st-katharine', parishName: 'St. Katharine Drexel',
      about: "Family law firm proudly serving the parish since 1995. We offer free initial consultations to all St. Katharine Drexel parishioners and donate a portion of fees to the parish.",
      services: [
        { id: 'sp-v3-s1', vendorId: 'sp-v3', name: 'Parishioner Consultation', description: 'Free 20-minute legal consultation for St. Katharine Drexel parishioners.', price: 0, priceLabel: 'Free', imageUrl: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=400&q=75', available: true, badge: 'Free' },
        { id: 'sp-v3-s2', vendorId: 'sp-v3', name: 'Immigration Petition Review', description: 'Document review for family-based immigration petitions.', price: 250.00, priceLabel: 'starting at', imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=75', available: true },
        { id: 'sp-v3-s3', vendorId: 'sp-v3', name: 'Simple Will Package', description: "Single or couple's will with power of attorney included.", price: 399.00, priceLabel: 'flat rate', imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=75', available: true },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Parish 3 — Our Lady of Guadalupe, San Diego CA
// ─────────────────────────────────────────────────────────────────────────────
const OUR_LADY: ParishStore = {
  id: 'our-lady-of-guadalupe-la',
  name: 'Our Lady of Guadalupe',
  tagline: 'Una comunidad unida en fe, familia y esperanza.',
  heroImageUrl: 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/Our+Lady+Guadalupe%2C+San+Diego.+CA+-+Image+2+(center).png',
  logoUrl: 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/Our+Lady+Guadalupe%2C+San+Diego.+CA+-+Logo.jpg',
  primaryColor: '#7B1D35',
  accentColor: '#E07C24',
  city: 'San Diego',
  state: 'CA',
  products: [
    { id: 'lg-p1', name: 'Guadalupe Icon — Framed', description: 'Hand-painted Guadalupe icon on wood, blessed by parish priest. 8×10 in.', price: 55.00, imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=75', category: 'religious', inStock: true, badge: 'Handmade', parishId: 'our-lady-of-guadalupe-la', parishName: 'Our Lady of Guadalupe' },
    { id: 'lg-p2', name: 'Talavera Rosary Beads', description: 'Colorful hand-painted Talavera clay beads with silver crucifix.', price: 28.00, imageUrl: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=400&q=75', category: 'religious', inStock: true, parishId: 'our-lady-of-guadalupe-la', parishName: 'Our Lady of Guadalupe' },
    { id: 'lg-p3', name: 'Prayer Votive Candle Set', description: 'Set of 6 blessed votive candles in traditional glass holders.', price: 18.00, imageUrl: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?w=400&q=75', category: 'religious', inStock: true, parishId: 'our-lady-of-guadalupe-la', parishName: 'Our Lady of Guadalupe' },
    { id: 'lg-p4', name: 'Parish T-Shirt — Terracotta', description: 'Soft-wash tee with embroidered Guadalupe silhouette. 100% Peruvian cotton.', price: 32.00, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=75', category: 'merch', inStock: true, badge: 'New', parishId: 'our-lady-of-guadalupe-la', parishName: 'Our Lady of Guadalupe' },
    { id: 'lg-p5', name: 'Hand-Painted Mug', description: 'Ceramic mug with Guadalupe folk art pattern. Dishwasher safe.', price: 20.00, imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=75', category: 'merch', inStock: true, parishId: 'our-lady-of-guadalupe-la', parishName: 'Our Lady of Guadalupe' },
  ],
  donationGoals: [
    { id: 'lg-d1', title: 'Sanctuary Mural Fund', description: 'Commission a local muralist to paint the life of Our Lady of Guadalupe in our main nave.', goalAmount: 25000, raisedAmount: 18900, imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=75', endsAt: '2025-09-15', parishId: 'our-lady-of-guadalupe-la', parishName: 'Our Lady of Guadalupe' },
    { id: 'lg-d2', title: 'ESL Evening Ministry', description: 'Fund free English classes for 60 immigrant families in our parish hall, 3 nights a week.', goalAmount: 12000, raisedAmount: 9750, imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=75', endsAt: '2025-07-31', parishId: 'our-lady-of-guadalupe-la', parishName: 'Our Lady of Guadalupe' },
  ],
  vendors: [
    {
      id: 'lg-v1', name: 'Panadería Lupita', tagline: 'Traditional Mexican pan dulce and celebration cakes.',
      logoUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&h=200&fit=crop&q=75',
      bannerUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
      category: 'Food & Beverage', parishId: 'our-lady-of-guadalupe-la', parishName: 'Our Lady of Guadalupe',
      about: "Family panadería serving San Diego since 1978. Our pan dulce is made with the same recipes from Oaxaca that abuelita brought over. Every sale supports our parish community.",
      services: [
        { id: 'lg-v1-s1', vendorId: 'lg-v1', name: 'Pan Dulce Dozen', description: 'Assorted dozen: conchas, cuernitos, polvorones, and empanadas de cajeta.', price: 14.00, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=75', available: true, badge: 'Bestseller' },
        { id: 'lg-v1-s2', vendorId: 'lg-v1', name: 'Quinceañera Cake', description: '3-tier vanilla-almond cake decorated with Guadalupe motif. Order 2 weeks ahead.', price: 250.00, priceLabel: 'starting at', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=75', available: true },
        { id: 'lg-v1-s3', vendorId: 'lg-v1', name: 'Tamale Catering (Dozen)', description: 'Red chile pork or rajas con queso tamales. Minimum 4 dozen for events.', price: 22.00, imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=75', available: true },
      ],
    },
    {
      id: 'lg-v2', name: 'Casa de Flores', tagline: 'Altar florals, quinceañera and wedding arrangements.',
      logoUrl: 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/MockData/pexels-magda-ehlers-pexels-13182055.jpg',
      bannerUrl: 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/MockData/pexels-mavihnt-36752494.jpg',
      category: 'Florals', parishId: 'our-lady-of-guadalupe-la', parishName: 'Our Lady of Guadalupe',
      about: "Casa de Flores has decorated Our Lady of Guadalupe for every feast day for 12 years. We specialize in traditional Mexican florals including marigold ofrendas and altar arrangements.",
      services: [
        { id: 'lg-v2-s1', vendorId: 'lg-v2', name: 'Altar Ofrenda Arrangement', description: 'Marigold and rose ofrenda arrangement for home altars. Seasonal availability.', price: 55.00, imageUrl: 'https://images.unsplash.com/photo-1487530811015-780cfc49b0bd?w=400&q=75', available: true, badge: 'Seasonal' },
        { id: 'lg-v2-s2', vendorId: 'lg-v2', name: 'Quinceañera Florals Package', description: 'Bouquet, table centerpieces, and chapel pew arrangements included.', price: 450.00, priceLabel: 'starting at', imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=75', available: true },
        { id: 'lg-v2-s3', vendorId: 'lg-v2', name: 'Weekly Home Delivery', description: 'Fresh seasonal bouquet delivered every Friday. Pause or cancel anytime.', price: 35.00, priceLabel: 'per week', imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&q=75', available: true },
      ],
    },
    {
      id: 'lg-v3', name: 'Seguro Latino', tagline: 'Affordable auto, home, and life insurance en español.',
      logoUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop&q=75',
      bannerUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80',
      category: 'Financial Services', parishId: 'our-lady-of-guadalupe-la', parishName: 'Our Lady of Guadalupe',
      about: "Bilingual insurance agency dedicated to the Latino Catholic community in San Diego. We donate 2% of every premium to Our Lady of Guadalupe's ESL Ministry.",
      services: [
        { id: 'lg-v3-s1', vendorId: 'lg-v3', name: 'Auto Coverage — Free Quote', description: 'State minimum and full coverage options. Bilingual agents available.', price: 0, priceLabel: 'Free quote', imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=75', available: true },
        { id: 'lg-v3-s2', vendorId: 'lg-v3', name: "Renter's Insurance", description: "Affordable coverage for apartment and home renters. Monthly or annual.", price: 12.00, priceLabel: 'from per month', imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=75', available: true },
      ],
    },
    {
      id: 'lg-v4', name: 'Construcciones Rivera', tagline: 'Residential remodeling and commercial construction.',
      logoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop&q=75',
      bannerUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      category: 'Construction', parishId: 'our-lady-of-guadalupe-la', parishName: 'Our Lady of Guadalupe',
      about: "Licensed and bonded contractor with 20 years in San Diego. Rivera Construction maintains Our Lady of Guadalupe's parish hall and offers special pricing to parishioners.",
      services: [
        { id: 'lg-v4-s1', vendorId: 'lg-v4', name: 'Kitchen Remodel Estimate', description: 'Free in-home kitchen remodel consultation and detailed estimate.', price: 0, priceLabel: 'Free', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=75', available: true, badge: 'Free' },
        { id: 'lg-v4-s2', vendorId: 'lg-v4', name: 'Bathroom Renovation', description: 'Full guest or primary bath renovation. Licensed & bonded. 2-year warranty.', price: 4500.00, priceLabel: 'starting at', imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=75', available: true },
        { id: 'lg-v4-s3', vendorId: 'lg-v4', name: 'Parish Hall Maintenance', description: 'Quarterly maintenance package for parish halls and community spaces.', price: 800.00, priceLabel: 'per quarter', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=75', available: true },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Store registry
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_STORES: Record<string, ParishStore> = {
  [ST_MARY.id]: ST_MARY,
  [ST_PATRICKS.id]: ST_PATRICKS,
  [OUR_LADY.id]: OUR_LADY,
};

export function getStore(storeId: string): ParishStore | null {
  return MOCK_STORES[storeId] ?? null;
}

export function getDonation(donationId: string): DonationGoal | null {
  for (const store of Object.values(MOCK_STORES)) {
    const found = store.donationGoals.find((d) => d.id === donationId);
    if (found) return found;
  }
  return null;
}

export function getProduct(productId: string): StoreProduct | null {
  for (const store of Object.values(MOCK_STORES)) {
    const found = store.products.find((p) => p.id === productId);
    if (found) return found;
  }
  return null;
}

export function getVendor(vendorId: string): StoreVendor | null {
  for (const store of Object.values(MOCK_STORES)) {
    const found = store.vendors.find((v) => v.id === vendorId);
    if (found) return found;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Global aggregated views
// ─────────────────────────────────────────────────────────────────────────────

export function getAllParishes(): ParishSummary[] {
  return Object.values(MOCK_STORES).map((s) => ({
    id: s.id, name: s.name, tagline: s.tagline,
    heroImageUrl: s.heroImageUrl, logoUrl: s.logoUrl,
    primaryColor: s.primaryColor, accentColor: s.accentColor,
    city: s.city, state: s.state,
    productCount: s.products.length,
    donationCount: s.donationGoals.length,
    vendorCount: s.vendors.length,
  }));
}

export function getAllProducts(): StoreProduct[] {
  return Object.values(MOCK_STORES).flatMap((s) => s.products);
}

export function getAllDonations(): DonationGoal[] {
  return Object.values(MOCK_STORES).flatMap((s) => s.donationGoals);
}

export function getAllVendors(): StoreVendor[] {
  return Object.values(MOCK_STORES).flatMap((s) => s.vendors);
}

export function getUniqueVendorCategories(): string[] {
  return Array.from(new Set(getAllVendors().map((v) => v.category))).sort();
}
