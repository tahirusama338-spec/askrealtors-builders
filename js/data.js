/**
 * ASK Realtors & Builders — Central Data Store  v3
 * All private contact info lives in the admin layer only.
 * Public listings contain ZERO seller/buyer contact info.
 *
 * Schema v3 adds: custom_city, custom_society, block, street, landmark,
 *   key_features (array), other_features, thumbnails, video_poster,
 *   media_processing_status, updated_at
 */

const DB_VERSION = '4'; // bump to force reseed on schema change

// ============================================================
// SEED DATA — Sample listings, buyers, inquiries
// ============================================================

const SEED_LISTINGS = [
  {
    id: 'L001',
    title: '1 Kanal Luxury Corner Plot in DHA Phase 1',
    property_type: 'Residential Plot',
    custom_property_type: '',
    city: 'Multan',
    society: 'DHA',
    block: 'A',
    plot_size_value: 1,
    plot_size_unit: 'Kanal',
    plot_size: '1 Kanal',
    price_per_unit: 32500000,
    price_per_unit_label: '3.25 Crore',
    total_price: 32500000,
    price: 32500000,
    price_label: '3.25 Crore',
    description: 'A prime corner plot in the most sought-after phase of DHA Multan. Perfectly level, all utilities available, in a developed street. Ideal for a dream home or investment.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    ],
    videos: [],
    is_exclusive: false,
    is_featured: true,
    status: 'active',
    created_at: '2024-01-15',
    features: ['Corner Plot', 'Developed Street', 'All Utilities'],
  },
  {
    id: 'L002',
    title: '10 Marla Modern Villa — Royal Orchard Block C',
    property_type: 'House',
    custom_property_type: '',
    city: 'Multan',
    society: 'Royal Orchard',
    block: 'C',
    plot_size_value: 10,
    plot_size_unit: 'Marla',
    plot_size: '10 Marla',
    price_per_unit: 1850000,
    price_per_unit_label: '18.5 Lakh',
    total_price: 18500000,
    price: 18500000,
    price_label: '1.85 Crore',
    description: 'Stunning fully-furnished modern villa with 5 beds, 5 baths, double drawing room, servant quarters, and beautifully landscaped garden. Brand new construction — never lived in.',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    ],
    videos: [],
    is_exclusive: true,
    is_featured: true,
    status: 'active',
    created_at: '2024-01-20',
    features: ['5 Beds', '5 Baths', 'Furnished', 'Garden'],
  },
  {
    id: 'L003',
    title: '5 Marla Residential Plot — Buch Villas Sector A',
    property_type: 'Residential Plot',
    custom_property_type: '',
    city: 'Multan',
    society: 'Buch Villas',
    block: 'Sector A',
    plot_size_value: 5,
    plot_size_unit: 'Marla',
    plot_size: '5 Marla',
    price_per_unit: 1160000,
    price_per_unit_label: '11.6 Lakh',
    total_price: 5800000,
    price: 5800000,
    price_label: '58 Lakh',
    description: 'Excellent 5 Marla plot in a prime location within Buch Villas. Ideal for construction with all facilities available. Road-facing, extra land benefit.',
    images: [
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
    ],
    videos: [],
    is_exclusive: false,
    is_featured: true,
    status: 'active',
    created_at: '2024-02-01',
    features: ['Road Facing', 'All Utilities', 'Clear Title'],
  },
  {
    id: 'L004',
    title: '2 Kanal Farmhouse — WAPDA Town Phase 2',
    property_type: 'Farm House',
    custom_property_type: '',
    city: 'Multan',
    society: 'WAPDA Town',
    block: 'Phase 2',
    plot_size_value: 2,
    plot_size_unit: 'Kanal',
    plot_size: '2 Kanal',
    price_per_unit: 22500000,
    price_per_unit_label: '2.25 Crore',
    total_price: 45000000,
    price: 45000000,
    price_label: '4.5 Crore',
    description: 'Triple-story luxury farmhouse on 2 Kanal with swimming pool, fully equipped gym, rooftop sitting area, spacious garage for 4 cars. Ultimate luxury living.',
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    ],
    videos: [],
    is_exclusive: true,
    is_featured: true,
    status: 'active',
    created_at: '2024-02-10',
    features: ['Swimming Pool', 'Gym', 'Rooftop', '3 Storey'],
  },
  {
    id: 'L005',
    title: '10 Marla Plot — DHA Phase 6 Block F',
    property_type: 'Residential Plot',
    custom_property_type: '',
    city: 'Multan',
    society: 'DHA',
    block: 'F',
    plot_size_value: 10,
    plot_size_unit: 'Marla',
    plot_size: '10 Marla',
    price_per_unit: 1420000,
    price_per_unit_label: '14.2 Lakh',
    total_price: 14200000,
    price: 14200000,
    price_label: '1.42 Crore',
    description: 'West-open 10 Marla plot in DHA Phase 6, Block F. Well-developed area with full possession. Ideal family home construction.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80',
    ],
    videos: [],
    is_exclusive: false,
    is_featured: false,
    status: 'active',
    created_at: '2024-02-15',
    features: ['West Open', 'Possession Ready', 'Developed Block'],
  },
  {
    id: 'L006',
    title: '5 Marla Corner House — Royal Orchard Block D',
    property_type: 'House',
    custom_property_type: '',
    city: 'Multan',
    society: 'Royal Orchard',
    block: 'D',
    plot_size_value: 5,
    plot_size_unit: 'Marla',
    plot_size: '5 Marla',
    price_per_unit: 1900000,
    price_per_unit_label: '19 Lakh',
    total_price: 9500000,
    price: 9500000,
    price_label: '95 Lakh',
    description: 'Beautiful 5 Marla corner house with 3 beds, 3 baths, drawing room, and car porch. Ready to move in, with a well-maintained interior.',
    images: [
      'https://images.unsplash.com/photo-1585773690176-a5a8b96d2eee?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    ],
    videos: [],
    is_exclusive: false,
    is_featured: false,
    status: 'active',
    created_at: '2024-03-01',
    features: ['Corner Plot', '3 Beds', 'Car Porch', 'Ready'],
  },
];

const SEED_BUYER_REQUIREMENTS = [
  {
    id: 'B001',
    title: 'Looking for 1 Kanal Plot in DHA Multan',
    city: 'Multan',
    society: 'DHA',
    plot_size: '1 Kanal',
    budget_min: 25000000,
    budget_max: 35000000,
    budget_label: '2.5 – 3.5 Crore',
    property_type: 'Plot',
    notes: 'Preferably in Phase 1 or 2, corner or park-facing preferred.',
    status: 'open',
    created_at: '2024-02-01',
  },
  {
    id: 'B002',
    title: 'Wanted: 10 Marla House in Royal Orchard',
    city: 'Multan',
    society: 'Royal Orchard',
    plot_size: '10 Marla',
    budget_min: 15000000,
    budget_max: 22000000,
    budget_label: '1.5 – 2.2 Crore',
    property_type: 'House',
    notes: 'Furnished preferred. Urgent buyer.',
    status: 'open',
    created_at: '2024-02-05',
  },
  {
    id: 'B003',
    title: 'Seeking 5 Marla Plot — Buch Villas or WAPDA Town',
    city: 'Multan',
    society: 'Buch Villas',
    plot_size: '5 Marla',
    budget_min: 5000000,
    budget_max: 7000000,
    budget_label: '50 – 70 Lakh',
    property_type: 'Plot',
    notes: 'Flexible on society. Must have electricity and gas.',
    status: 'open',
    created_at: '2024-02-12',
  },
  {
    id: 'B004',
    title: '2 Kanal Luxury Home — DHA Phase 1 or 2',
    city: 'Multan',
    society: 'DHA',
    plot_size: '2 Kanal',
    budget_min: 55000000,
    budget_max: 80000000,
    budget_label: '5.5 – 8 Crore',
    property_type: 'House',
    notes: 'Must have swimming pool or space for one. Double road preferred.',
    status: 'open',
    created_at: '2024-02-18',
  },
  {
    id: 'B005',
    title: 'Want 10 Marla Plot — DHA Phase 5 or 6',
    city: 'Multan',
    society: 'DHA',
    plot_size: '10 Marla',
    budget_min: 12000000,
    budget_max: 17000000,
    budget_label: '1.2 – 1.7 Crore',
    property_type: 'Plot',
    notes: 'Cash buyer. Ready to close quickly.',
    status: 'open',
    created_at: '2024-03-01',
  },
];

// =================================================================
// DATABASE — localStorage-based store (simulates backend DB)
// Admin Private Data stored separately (admin-layer only)
// =================================================================

const DB = {
  KEY_LISTINGS: 'ask_listings',
  KEY_BUYERS: 'ask_buyer_requirements',
  KEY_INQUIRIES: 'ask_inquiries',
  KEY_SELLER_PRIVATE: 'ask_seller_private',
  KEY_BUYER_PRIVATE: 'ask_buyer_private',

  init() {
    // Version gate: on schema change, flush and reseed
    if (localStorage.getItem('ask_db_version') !== DB_VERSION) {
      localStorage.removeItem(this.KEY_LISTINGS);
      localStorage.removeItem(this.KEY_BUYERS);
      localStorage.removeItem(this.KEY_SELLER_PRIVATE);
      localStorage.removeItem(this.KEY_BUYER_PRIVATE);
      localStorage.setItem('ask_db_version', DB_VERSION);
    }
    if (!localStorage.getItem(this.KEY_LISTINGS)) {
      localStorage.setItem(this.KEY_LISTINGS, JSON.stringify(SEED_LISTINGS));
    }
    if (!localStorage.getItem(this.KEY_BUYERS)) {
      localStorage.setItem(this.KEY_BUYERS, JSON.stringify(SEED_BUYER_REQUIREMENTS));
    }
    if (!localStorage.getItem(this.KEY_INQUIRIES)) {
      localStorage.setItem(this.KEY_INQUIRIES, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.KEY_SELLER_PRIVATE)) {
      // Only accessible via admin layer
      localStorage.setItem(this.KEY_SELLER_PRIVATE, JSON.stringify([
        { listing_id: 'L001', name: 'Muhammad Hassan', phone: '+92 301 1234567', email: 'hassan@example.com' },
        { listing_id: 'L002', name: 'Ayesha Malik', phone: '+92 322 9876543', email: 'ayesha@example.com' },
        { listing_id: 'L003', name: 'Tariq Bashir', phone: '+92 345 5551234', email: 'tariq@example.com' },
        { listing_id: 'L004', name: 'Sara Khan', phone: '+92 311 7778888', email: 'sara@example.com' },
        { listing_id: 'L005', name: 'Ahmed Raza', phone: '+92 321 4445566', email: 'ahmed@example.com' },
        { listing_id: 'L006', name: 'Usman Ali', phone: '+92 300 2223334', email: 'usman@example.com' },
      ]));
    }
    if (!localStorage.getItem(this.KEY_BUYER_PRIVATE)) {
      localStorage.setItem(this.KEY_BUYER_PRIVATE, JSON.stringify([
        { req_id: 'B001', name: 'Bilal Ahmed', phone: '+92 303 1112223', email: 'bilal@example.com' },
        { req_id: 'B002', name: 'Rabia Iftikhar', phone: '+92 314 4445556', email: 'rabia@example.com' },
        { req_id: 'B003', name: 'Kamran Sheikh', phone: '+92 335 7778889', email: 'kamran@example.com' },
        { req_id: 'B004', name: 'Nadia Butt', phone: '+92 341 0001112', email: 'nadia@example.com' },
        { req_id: 'B005', name: 'Faisal Qureshi', phone: '+92 312 3334445', email: 'faisal@example.com' },
      ]));
    }
  },

  // --- PUBLIC APIs (no contact info) ---
  getListings(filters = {}) {
    let data = JSON.parse(localStorage.getItem(this.KEY_LISTINGS) || '[]');
    data = data.filter(l => l.status === 'active' || l.status === 'approved' || l.status === 'featured');
    if (filters.city) data = data.filter(l => l.city === filters.city);
    if (filters.society) data = data.filter(l => l.society === filters.society);
    if (filters.plot_size) data = data.filter(l => l.plot_size === filters.plot_size);
    if (filters.exclusive) data = data.filter(l => l.is_exclusive);
    if (filters.featured) data = data.filter(l => l.is_featured);
    return data.map(l => this._stripPrivate(l));
  },

  getListing(id) {
    const data = JSON.parse(localStorage.getItem(this.KEY_LISTINGS) || '[]');
    const listing = data.find(l => l.id === id);
    return listing ? this._stripPrivate(listing) : null;
  },

  getBuyerRequirements(filters = {}) {
    let data = JSON.parse(localStorage.getItem(this.KEY_BUYERS) || '[]');
    data = data.filter(b => b.status === 'open' || b.status === 'approved');
    if (filters.city) data = data.filter(b => b.city === filters.city);
    if (filters.society) data = data.filter(b => b.society === filters.society);
    return data;
  },

  saveInquiry(data) {
    const inquiries = JSON.parse(localStorage.getItem(this.KEY_INQUIRIES) || '[]');
    const inquiry = {
      id: 'INQ' + Date.now(),
      ...data,
      created_at: new Date().toISOString(),
      status: 'new',
    };
    inquiries.push(inquiry);
    localStorage.setItem(this.KEY_INQUIRIES, JSON.stringify(inquiries));
    return inquiry;
  },

  submitListing(publicData, privateData) {
    const listings = JSON.parse(localStorage.getItem(this.KEY_LISTINGS) || '[]');
    const sellerPrivate = JSON.parse(localStorage.getItem(this.KEY_SELLER_PRIVATE) || '[]');

    const id = 'L' + Date.now();
    // Ensure all v2 schema fields are stored
    const listing = {
      id,
      title:                publicData.title || '',
      property_type:        publicData.property_type || '',
      custom_property_type: publicData.custom_property_type || '',
      plot_size_value:      publicData.plot_size_value || 0,
      plot_size_unit:       publicData.plot_size_unit || '',
      plot_size:            publicData.plot_size || '',
      price_per_unit:       publicData.price_per_unit || 0,
      price_per_unit_label: publicData.price_per_unit_label || '',
      total_price:          publicData.total_price || 0,
      // Core listing info
      title:                    publicData.title || '',
      property_type:            publicData.property_type || '',
      custom_property_type:     publicData.custom_property_type || '',

      // Size
      plot_size_value:          publicData.plot_size_value || 0,
      plot_size_unit:           publicData.plot_size_unit || '',
      custom_plot_unit:         publicData.custom_plot_unit || '',
      plot_size:                publicData.plot_size || '',

      // Pricing
      price_per_unit:           publicData.price_per_unit || 0,
      price_per_unit_label:     publicData.price_per_unit_label || '',
      total_price:              publicData.total_price || 0,
      price:                    publicData.total_price || publicData.price || 0,
      price_label:              publicData.price_label || '',

      // Location (full v3)
      city:                     publicData.city || '',
      custom_city:              publicData.custom_city || '',
      society:                  publicData.society || '',
      custom_society:           publicData.custom_society || '',
      block:                    publicData.block || '',
      street:                   publicData.street || '',
      landmark:                 publicData.landmark || '',

      // Content
      description:              publicData.description || '',
      key_features:             publicData.key_features || [],
      other_features:           publicData.other_features || '',
      features:                 publicData.features || publicData.key_features || [],

      // Media (optimized versions)
      images:                   (publicData.images && publicData.images.length)
                                  ? publicData.images
                                  : [],
      thumbnails:               publicData.thumbnails || [],
      featured_image:           publicData.featured_image || (publicData.thumbnails && publicData.thumbnails[0]) || (publicData.images && publicData.images[0]) || null,
      videos:                   publicData.videos || [],
      video_poster:             publicData.video_poster || null,

      // Media processing metadata
      media_processing_status:  publicData.media_processing_status || { images_processed: 0, video_processed: false },

      // Meta
      is_exclusive:             false,
      is_featured:              false,
      status:                   'approved',
      created_at:               new Date().toISOString().split('T')[0],
      updated_at:               new Date().toISOString().split('T')[0],
    };
    listings.push(listing);
    sellerPrivate.push({ listing_id: id, ...privateData });

    localStorage.setItem(this.KEY_LISTINGS, JSON.stringify(listings));
    localStorage.setItem(this.KEY_SELLER_PRIVATE, JSON.stringify(sellerPrivate));
    return listing;
  },

  submitBuyerReq(publicData, privateData) {
    const buyers = JSON.parse(localStorage.getItem(this.KEY_BUYERS) || '[]');
    const buyerPrivate = JSON.parse(localStorage.getItem(this.KEY_BUYER_PRIVATE) || '[]');

    const id = 'B' + Date.now();
    const req = {
      id,
      title:                publicData.title || '',
      property_type:        publicData.property_type || '',
      custom_property_type: publicData.custom_property_type || '',
      plot_size_value:      publicData.plot_size_value || 0,
      plot_size_unit:       publicData.plot_size_unit || '',
      plot_size:            publicData.plot_size || '',
      budget_min:           publicData.budget_min || 0,
      budget_max:           publicData.budget_max || 0,
      budget_label:         publicData.budget_label || '',
      city:                 publicData.city || '',
      custom_city:          publicData.custom_city || '',
      society:              publicData.society || '',
      custom_society:       publicData.custom_society || '',
      block:                publicData.block || '',
      street:               publicData.street || '',
      notes:                publicData.notes || '',
      status: 'open',
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
    };
    buyers.push(req);
    buyerPrivate.push({ req_id: id, ...privateData });

    localStorage.setItem(this.KEY_BUYERS, JSON.stringify(buyers));
    localStorage.setItem(this.KEY_BUYER_PRIVATE, JSON.stringify(buyerPrivate));
    return req;
  },

  // --- ADMIN APIs (includes private data) ---
  adminGetListings() {
    return JSON.parse(localStorage.getItem(this.KEY_LISTINGS) || '[]');
  },
  adminGetBuyers() {
    return JSON.parse(localStorage.getItem(this.KEY_BUYERS) || '[]');
  },
  adminGetInquiries() {
    return JSON.parse(localStorage.getItem(this.KEY_INQUIRIES) || '[]');
  },
  adminGetSellerPrivate() {
    return JSON.parse(localStorage.getItem(this.KEY_SELLER_PRIVATE) || '[]');
  },
  adminGetBuyerPrivate() {
    return JSON.parse(localStorage.getItem(this.KEY_BUYER_PRIVATE) || '[]');
  },
  adminUpdateListingStatus(id, status) {
    const listings = this.adminGetListings();
    const idx = listings.findIndex(l => l.id === id);
    if (idx !== -1) { listings[idx].status = status; }
    localStorage.setItem(this.KEY_LISTINGS, JSON.stringify(listings));
  },
  adminUpdateBuyerStatus(id, status) {
    const buyers = this.adminGetBuyers();
    const idx = buyers.findIndex(b => b.id === id);
    if (idx !== -1) { buyers[idx].status = status; }
    localStorage.setItem(this.KEY_BUYERS, JSON.stringify(buyers));
  },
  adminUpdateInquiryStatus(id, status) {
    const inqs = this.adminGetInquiries();
    const idx = inqs.findIndex(i => i.id === id);
    if (idx !== -1) { inqs[idx].status = status; }
    localStorage.setItem(this.KEY_INQUIRIES, JSON.stringify(inqs));
  },
  adminToggleExclusive(id) {
    const listings = this.adminGetListings();
    const idx = listings.findIndex(l => l.id === id);
    if (idx !== -1) { listings[idx].is_exclusive = !listings[idx].is_exclusive; }
    localStorage.setItem(this.KEY_LISTINGS, JSON.stringify(listings));
  },
  adminToggleFeatured(id) {
    const listings = this.adminGetListings();
    const idx = listings.findIndex(l => l.id === id);
    if (idx !== -1) { listings[idx].is_featured = !listings[idx].is_featured; }
    localStorage.setItem(this.KEY_LISTINGS, JSON.stringify(listings));
  },
  adminDeleteListing(id) {
    let listings = this.adminGetListings();
    listings = listings.filter(l => l.id !== id);
    localStorage.setItem(this.KEY_LISTINGS, JSON.stringify(listings));
    let priv = this.adminGetSellerPrivate();
    priv = priv.filter(p => p.listing_id !== id);
    localStorage.setItem(this.KEY_SELLER_PRIVATE, JSON.stringify(priv));
  },
  adminDeleteBuyer(id) {
    let buyers = this.adminGetBuyers();
    buyers = buyers.filter(b => b.id !== id);
    localStorage.setItem(this.KEY_BUYERS, JSON.stringify(buyers));
    let priv = this.adminGetBuyerPrivate();
    priv = priv.filter(p => p.req_id !== id);
    localStorage.setItem(this.KEY_BUYER_PRIVATE, JSON.stringify(priv));
  },

  // Helpers
  _stripPrivate(listing) {
    const { ...pub } = listing;
    delete pub.seller_name;
    delete pub.seller_phone;
    delete pub.seller_email;
    return pub;
  },
};

// Initialize database on load
DB.init();

// Format PKR
function formatPKR(amount) {
  if (amount >= 10000000) return (amount / 10000000).toFixed(2).replace(/\.00$/, '') + ' Crore';
  if (amount >= 100000) return (amount / 100000).toFixed(0) + ' Lakh';
  return amount.toLocaleString();
}

// Relative date
function relativeDate(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24);
  if (diff < 1) return 'Today';
  if (diff < 2) return 'Yesterday';
  if (diff < 7) return Math.floor(diff) + ' days ago';
  if (diff < 30) return Math.floor(diff / 7) + ' weeks ago';
  return Math.floor(diff / 30) + ' months ago';
}

// Build property card HTML — v3 schema
function buildPropertyCard(listing) {
  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80';

  const badge = listing.is_exclusive
    ? '<span class="card-badge exclusive">★ Exclusive</span>'
    : listing.is_featured
    ? '<span class="card-badge featured">Featured</span>'
    : '';

  // Use thumbnail for card (optimized, 4:3), fallback to full image, then fallback URL
  const imgSrc = (listing.thumbnails && listing.thumbnails[0])
    ? listing.thumbnails[0]
    : (listing.featured_image)
    ? listing.featured_image
    : (listing.images && listing.images[0])
    ? listing.images[0]
    : FALLBACK_IMG;

  // Resolve size display (v3 → v2 → legacy)
  const sizeDisplay = listing.plot_size_value
    ? `${listing.plot_size_value} ${listing.plot_size_unit}`
    : (listing.plot_size || '—');

  // Resolve pricing
  const totalPriceFmt = listing.total_price
    ? 'PKR ' + formatPKR(listing.total_price)
    : listing.price_label
    ? 'PKR ' + listing.price_label
    : listing.price ? 'PKR ' + formatPKR(listing.price) : '—';

  const perUnitFmt = listing.price_per_unit
    ? `<span style="font-size:.72rem;color:rgba(255,255,255,0.75)">${formatPKR(listing.price_per_unit)} / ${listing.plot_size_unit || 'unit'}</span>`
    : '';

  // Property type label
  const typeLabel = (listing.property_type === 'Other' && listing.custom_property_type)
    ? listing.custom_property_type
    : (listing.property_type || '');

  // Location: society + block if available
  const locationStr = [
    listing.society || listing.custom_society || '',
    listing.block ? listing.block : '',
    listing.city || listing.custom_city || '',
  ].filter(Boolean).join(', ');

  // Feature tags — up to 4
  const allFeatures = [
    ...(listing.key_features || []),
    ...(listing.features && !listing.key_features ? listing.features : []),
  ].filter(Boolean);

  const featureTags = allFeatures.slice(0, 4).map(f =>
    `<span class="feature-tag">${f}</span>`
  ).join('');

  return `
  <div class="property-card" data-id="${listing.id}">
    <div class="card-img-wrap">
      <img src="${imgSrc}" alt="${listing.title}" loading="lazy"
        onerror="this.onerror=null;this.src='${FALLBACK_IMG}'" />
      ${badge}
      <div class="card-price-tag">
        ${totalPriceFmt}
        ${perUnitFmt ? `<br>${perUnitFmt}` : ''}
      </div>
    </div>
    <div class="card-body">
      <div class="card-location">
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        ${locationStr || '—'}
      </div>
      <h3 class="card-title">${listing.title}</h3>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:6px">
        <span style="background:var(--gold-pale);border:1px solid rgba(201,168,76,.25);border-radius:4px;padding:2px 8px;font-size:.72rem;color:var(--gold);font-weight:600">${typeLabel}</span>
        <span style="font-size:.78rem;color:var(--text-muted);font-weight:500">${sizeDisplay}</span>
      </div>
      ${featureTags ? `<div class="features-tags" style="margin-bottom:8px">${featureTags}</div>` : ''}
      <div class="card-footer">
        <button class="btn btn-gold btn-sm" onclick="openInquiry('${listing.id}')">Contact ASK</button>
        <span style="font-size:.72rem;color:var(--text-muted)">${relativeDate(listing.created_at)}</span>
      </div>
      <div class="card-calc-cta">
        <a href="https://dev-ask-construction-cost-estimator.pantheonsite.io/ai-construction-estimator-pro/" target="_blank" rel="noopener noreferrer" class="card-calc-link">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h4"/></svg>
          Estimate Build Cost
        </a>
      </div>
    </div>
  </div>`;
}

// Build buyer requirement card HTML — v3 schema
function buildBuyerCard(req) {
  const typeLabel = (req.property_type === 'Other' && req.custom_property_type)
    ? req.custom_property_type
    : (req.property_type || 'Any');

  const locationStr = [
    req.society || req.custom_society || '',
    req.city || req.custom_city || '',
  ].filter(Boolean).join(', ');

  const sizeStr = req.plot_size || (req.plot_size_value ? `${req.plot_size_value} ${req.plot_size_unit}` : '');

  const budgetStr = req.budget_label
    ? 'PKR ' + req.budget_label
    : req.budget_max ? 'PKR ' + formatPKR(req.budget_max) : '—';

  return `
  <div class="buyer-card" onclick="openInquiry(null, '${req.id}')">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
      <h4 class="buyer-card-title" style="margin:0;flex:1;padding-right:8px">${req.title}</h4>
      <span style="background:rgba(201,168,76,0.2);color:var(--gold-light);padding:2px 8px;border-radius:4px;font-size:0.7rem;font-weight:700;white-space:nowrap;flex-shrink:0">${typeLabel}</span>
    </div>
    <div class="buyer-card-specs">
      ${sizeStr ? `<span class="buyer-spec">${sizeStr}</span>` : ''}
      <span class="buyer-spec">${budgetStr}</span>
    </div>
    ${locationStr ? `<div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-bottom:10px;display:flex;align-items:center;gap:4px"><svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>${locationStr}</div>` : ''}
    ${req.notes ? `<p style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-bottom:12px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${req.notes}</p>` : ''}
    <div class="buyer-card-footer">
      <span class="buyer-card-date">${relativeDate(req.created_at)}</span>
      <button class="btn btn-sm" style="background:var(--gold);color:#fff;font-size:0.75rem;padding:6px 14px;" onclick="event.stopPropagation();openInquiry(null,'${req.id}')">Inquire Now</button>
    </div>
  </div>`;
}

// Global inquiry modal opener
function openInquiry(listingId = null, reqId = null) {
  const modal = document.getElementById('inquiryModal');
  if (!modal) return;
  modal.dataset.listingId = listingId || '';
  modal.dataset.reqId = reqId || '';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeInquiry() {
  const modal = document.getElementById('inquiryModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Toast notification
function showToast(msg, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = 'toast ' + type;
  toast.innerHTML = (type === 'success'
    ? '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    : '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>'
  ) + msg;
  requestAnimationFrame(() => { toast.classList.add('show'); });
  setTimeout(() => { toast.classList.remove('show'); }, 4000);
}
