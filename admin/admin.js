// ===== ADMIN DASHBOARD JS =====

// Auth guard
if (!sessionStorage.getItem('ask_admin_auth')) {
  window.location.href = 'login.html';
}

// Set date
document.getElementById('headerDate').textContent = new Date().toLocaleDateString('en-PK', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

// ===== NAVIGATION =====
function showSection(name) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

  document.getElementById('sec-' + name).classList.add('active');
  const navBtn = document.getElementById('sNav-' + name);
  if (navBtn) navBtn.classList.add('active');

  const titles = { dashboard: 'Dashboard', listings: 'Listings Management', buyers: 'Buyer Requirements', inquiries: 'Inquiries & Leads' };
  const subs = { dashboard: 'Welcome back, Admin', listings: 'Manage all property listings', buyers: 'Track buyer requirements', inquiries: 'Monitor leads and inquiries' };

  document.getElementById('pageTitle').textContent = titles[name] || name;
  document.getElementById('pageSubtitle').textContent = subs[name] || '';

  if (name === 'listings') renderListingsTable();
  else if (name === 'buyers') renderBuyersTable();
  else if (name === 'inquiries') renderInquiriesTable();
}

function logout() {
  sessionStorage.removeItem('ask_admin_auth');
  window.location.href = 'login.html';
}

// ===== ANALYTICS =====
function renderAnalytics() {
  const listings = DB.adminGetListings();
  const buyers = DB.adminGetBuyers();
  const inquiries = DB.adminGetInquiries();

  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === 'active').length;
  const pendingListings = listings.filter(l => l.status === 'pending').length;
  const exclusiveListings = listings.filter(l => l.is_exclusive).length;
  const soldListings = listings.filter(l => l.status === 'sold').length;
  const totalBuyers = buyers.filter(b => b.status === 'open').length;
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter(i => i.status === 'new').length;

  const cards = [
    { label: 'Total Listings', value: totalListings, icon: homeIcon(), color: 'gold', change: '+' + totalListings + ' total' },
    { label: 'Active Listings', value: activeListings, icon: checkIcon(), color: 'green', change: pendingListings + ' pending review' },
    { label: 'Exclusive Listings', value: exclusiveListings, icon: starIcon(), color: 'navy', change: soldListings + ' sold' },
    { label: 'Buyer Requirements', value: totalBuyers, icon: searchIcon(), color: 'blue', change: 'Active requirements' },
    { label: 'Total Leads', value: totalInquiries, icon: msgIcon(), color: 'orange', change: newInquiries + ' new inquiries' },
  ];

  const grid = document.getElementById('analyticsGrid');
  grid.innerHTML = cards.map(c => `
    <div class="analytics-card ${c.color}">
      <div class="analytics-icon">${c.icon}</div>
      <div class="analytics-num">${c.value}</div>
      <div class="analytics-label">${c.label}</div>
      <div class="analytics-change">${c.change}</div>
    </div>
  `).join('');
}

// ===== RECENT WIDGETS =====
function renderRecentListings() {
  const listings = DB.adminGetListings().slice(-5).reverse();
  const wrap = document.getElementById('recentListings');
  if (!listings.length) { wrap.innerHTML = '<div class="empty-state">No listings yet.</div>'; return; }

  wrap.innerHTML = `
    <table class="recent-table">
      <thead><tr><th>Title</th><th>Society</th><th>Status</th></tr></thead>
      <tbody>${listings.map(l => `
        <tr>
          <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${l.title}</td>
          <td>${l.society}</td>
          <td><span class="status-badge status-${l.status}">${l.status}</span></td>
        </tr>
      `).join('')}</tbody>
    </table>
  `;
}

function renderRecentInquiries() {
  const inqs = DB.adminGetInquiries().slice(-5).reverse();
  const wrap = document.getElementById('recentInquiries');
  if (!inqs.length) { wrap.innerHTML = '<div class="empty-state">No inquiries yet.</div>'; return; }

  wrap.innerHTML = `
    <table class="recent-table">
      <thead><tr><th>Name</th><th>Phone</th><th>Status</th></tr></thead>
      <tbody>${inqs.map(i => `
        <tr>
          <td>${i.inquirer_name}</td>
          <td>${i.inquirer_phone}</td>
          <td><span class="status-badge status-${i.status}">${i.status}</span></td>
        </tr>
      `).join('')}</tbody>
    </table>
  `;
}

// ===== LISTINGS TABLE =====
function renderListingsTable() {
  const filterVal = document.getElementById('lFilter')?.value || '';
  let listings = DB.adminGetListings();
  const sellerPrivate = DB.adminGetSellerPrivate();
  if (filterVal) listings = listings.filter(l => l.status === filterVal);

  document.getElementById('listingsCount').textContent = listings.length;
  const tbody = document.getElementById('listingsTbody');

  if (!listings.length) {
    tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No listings found.</td></tr>';
    return;
  }

  tbody.innerHTML = listings.map(l => {
    const priv = sellerPrivate.find(p => p.listing_id === l.id) || {};
    return `
    <tr>
      <td style="font-size:0.72rem;color:var(--text-muted);font-family:monospace">${l.id}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <img src="${l.images?.[0] || ''}" class="thumb" alt="" onerror="this.style.display='none'" />
          <span style="max-width:180px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${l.title}</span>
        </div>
      </td>
      <td>${l.society}</td>
      <td>${l.plot_size}</td>
      <td style="white-space:nowrap">PKR ${l.price_label || l.price?.toLocaleString()}</td>
      <td>
        <select class="toolbar-filters select" onchange="DB.adminUpdateListingStatus('${l.id}', this.value);renderListingsTable()" style="padding:4px 8px;border-radius:5px;font-size:0.75rem">
          ${['pending','approved','active','sold'].map(s => `<option value="${s}" ${l.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </td>
      <td>
        <span class="toggle-badge ${l.is_featured?'on':'off'}" onclick="DB.adminToggleFeatured('${l.id}');renderListingsTable()">
          ${l.is_featured?'★ Yes':'No'}
        </span>
      </td>
      <td>
        <span class="toggle-badge ${l.is_exclusive?'on':'off'}" onclick="DB.adminToggleExclusive('${l.id}');renderListingsTable()">
          ${l.is_exclusive?'★ Yes':'No'}
        </span>
      </td>
      <td class="private-cell">
        <div class="private-val">
          <strong>${priv.name || '—'}</strong>
          <span>${priv.phone || '—'}</span>
          <span style="color:var(--text-muted);font-size:.72rem">${priv.email || '—'}</span>
        </div>
      </td>
      <td>
        <div class="action-btns">
          <button class="btn-action btn-view" onclick="viewListingDetail('${l.id}')">View</button>
          <button class="btn-action btn-delete" onclick="if(confirm('Delete this listing?')){DB.adminDeleteListing('${l.id}');renderListingsTable()}">Del</button>
        </div>
      </td>
    </tr>
  `;}).join('');
}

// ===== BUYERS TABLE =====
function renderBuyersTable() {
  const buyers = DB.adminGetBuyers();
  const buyerPrivate = DB.adminGetBuyerPrivate();
  document.getElementById('buyersCount').textContent = buyers.length;
  const tbody = document.getElementById('buyersTbody');

  if (!buyers.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No buyer requirements yet.</td></tr>';
    return;
  }

  tbody.innerHTML = buyers.map(b => {
    const priv = buyerPrivate.find(p => p.req_id === b.id) || {};
    return `
    <tr>
      <td style="font-size:.72rem;color:var(--text-muted);font-family:monospace">${b.id}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${b.title}</td>
      <td>${b.society || '—'}</td>
      <td>${b.plot_size || '—'}</td>
      <td style="white-space:nowrap">PKR ${b.budget_label || b.budget_max?.toLocaleString()}</td>
      <td>
        <select onchange="DB.adminUpdateBuyerStatus('${b.id}', this.value);renderBuyersTable()" style="padding:4px 8px;border-radius:5px;font-size:.75rem">
          ${['open','closed'].map(s => `<option value="${s}" ${b.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </td>
      <td class="private-cell">
        <div class="private-val">
          <strong>${priv.name || '—'}</strong>
          <span>${priv.phone || '—'}</span>
          <span style="color:var(--text-muted);font-size:.72rem">${priv.email || '—'}</span>
        </div>
      </td>
      <td>
        <div class="action-btns">
          <button class="btn-action btn-delete" onclick="if(confirm('Delete requirement?')){DB.adminDeleteBuyer('${b.id}');renderBuyersTable()}">Del</button>
        </div>
      </td>
    </tr>
  `;}).join('');
}

// ===== INQUIRIES TABLE =====
function renderInquiriesTable() {
  const inqs = DB.adminGetInquiries();
  document.getElementById('inquiriesCount').textContent = inqs.length;
  const tbody = document.getElementById('inquiriesTbody');

  if (!inqs.length) {
    tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No inquiries yet.</td></tr>';
    return;
  }

  tbody.innerHTML = [...inqs].reverse().map(i => `
    <tr>
      <td style="font-size:.72rem;color:var(--text-muted);font-family:monospace">${i.id}</td>
      <td><strong>${i.inquirer_name}</strong></td>
      <td><a href="tel:${i.inquirer_phone}" style="color:#3b82f6;text-decoration:none">${i.inquirer_phone}</a></td>
      <td style="font-size:.78rem">${i.inquirer_email || '—'}</td>
      <td style="font-size:.78rem">${i.listing_id ? '🏠 ' + i.listing_id : i.requirement_id ? '🔍 ' + i.requirement_id : 'General'}</td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.8rem">${i.message || '—'}</td>
      <td style="font-size:.75rem;white-space:nowrap">${new Date(i.created_at).toLocaleDateString()}</td>
      <td>
        <select onchange="DB.adminUpdateInquiryStatus('${i.id}', this.value);renderInquiriesTable()" style="padding:4px 8px;border-radius:5px;font-size:.75rem">
          ${['new','contacted','closed'].map(s => `<option value="${s}" ${i.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </td>
      <td>
        <div class="action-btns">
          <a href="https://wa.me/${i.inquirer_phone?.replace(/\D/g,'')}" target="_blank" class="btn-action btn-approve">WA</a>
          <a href="tel:${i.inquirer_phone}" class="btn-action btn-view">Call</a>
        </div>
      </td>
    </tr>
  `).join('');
}

// ===== DETAIL MODAL =====
function viewListingDetail(id) {
  const listings = DB.adminGetListings();
  const sellerPrivate = DB.adminGetSellerPrivate();
  const l = listings.find(x => x.id === id);
  const priv = sellerPrivate.find(p => p.listing_id === id) || {};

  if (!l) return;

  document.getElementById('adminModalContent').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px">
      <h3 style="font-family:var(--font-heading);color:var(--navy);font-size:1.2rem;max-width:400px">${l.title}</h3>
      <button onclick="closeAdminModal()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--gray-400);line-height:1">×</button>
    </div>
    ${l.images?.[0] ? `<img src="${l.images[0]}" style="width:100%;height:200px;object-fit:cover;border-radius:10px;margin-bottom:20px" />` : ''}
    <div class="modal-detail-grid">
      <div class="detail-item"><label>Property Type</label><value>${l.property_type}</value></div>
      <div class="detail-item"><label>Plot Size</label><value>${l.plot_size}</value></div>
      <div class="detail-item"><label>City</label><value>${l.city}</value></div>
      <div class="detail-item"><label>Society</label><value>${l.society}</value></div>
      <div class="detail-item"><label>Block</label><value>${l.block || '—'}</value></div>
      <div class="detail-item"><label>Price</label><value>PKR ${l.price_label || l.price?.toLocaleString()}</value></div>
      <div class="detail-item"><label>Status</label><value><span class="status-badge status-${l.status}">${l.status}</span></value></div>
      <div class="detail-item"><label>Submitted</label><value>${l.created_at}</value></div>
      <div class="detail-item full"><label>Description</label><value style="white-space:pre-wrap;font-size:.85rem;color:var(--gray-600)">${l.description || '—'}</value></div>
    </div>
    <div class="private-section">
      <h4>
        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Private Seller Information (Admin Only)
      </h4>
      <div class="modal-detail-grid">
        <div class="detail-item"><label>Seller Name</label><value>${priv.name || '—'}</value></div>
        <div class="detail-item"><label>Phone</label><value><a href="tel:${priv.phone}" style="color:#3b82f6">${priv.phone || '—'}</a></value></div>
        <div class="detail-item full"><label>Email</label><value>${priv.email || '—'}</value></div>
        ${priv.notes ? `<div class="detail-item full"><label>Notes</label><value>${priv.notes}</value></div>` : ''}
      </div>
    </div>
    <button class="modal-close-btn" onclick="closeAdminModal()">Close</button>
  `;

  document.getElementById('adminModal').classList.add('open');
}

function closeAdminModal(e) {
  if (e && e.target !== document.getElementById('adminModal')) return;
  document.getElementById('adminModal').classList.remove('open');
}

// ===== SVG ICONS =====
function homeIcon() { return '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>'; }
function checkIcon() { return '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'; }
function starIcon() { return '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'; }
function searchIcon() { return '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>'; }
function msgIcon() { return '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>'; }

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderAnalytics();
  renderRecentListings();
  renderRecentInquiries();
});
