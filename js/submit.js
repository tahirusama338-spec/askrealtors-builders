// ===== SUBMIT.JS — Multi-step form logic v3 =====
// Covers: custom city/society, features checklist, media processing engine,
//         full schema v3 field mapping, bi-directional pricing, video poster.

let currentStep = 1;

// ──────────────────────────────────────────────────
// KEY FEATURES CHECKLIST DATA
// ──────────────────────────────────────────────────
const FEATURES_LIST = [
  // Plot & Location
  'Corner Plot','Park Facing','Main Boulevard','Near Mosque','Near Park',
  'Near School','Near Commercial Market','Double Road','Wide Street',
  'Facing Open Area','West Open','East Open','North Facing','South Facing',
  // Development
  'Possession Ready','Developed Area','Gated Community','Ready to Construct',
  'Boundary Wall','Ideal Location','Investment Opportunity',
  // Utilities
  'Electricity Available','Gas Available','Water Supply','Sewerage','Carpeted Road',
  // House Features
  'Furnished','Semi Furnished',
  '1 Bed','2 Bed','3 Bed','4 Bed','5 Bed','6+ Bed',
  'Attached Baths','Drawing Room','TV Lounge','Kitchen',
  'Servant Quarter','Basement','Store Room','Garage','Car Porch',
  'Lawn','Terrace','Rooftop Access','Swimming Pool','Gym',
  // Security & Tech
  'Security','CCTV','Lift',
  // Commercial / Land
  'Commercial Approved','Industrial Approved','Agriculture Water Access',
];

// ──────────────────────────────────────────────────
// TAB SWITCH
// ──────────────────────────────────────────────────
function switchTab(tab) {
  document.getElementById('formSell').classList.toggle('active', tab === 'sell');
  document.getElementById('formBuy').classList.toggle('active', tab === 'buy');
  document.getElementById('tabSell').classList.toggle('active', tab === 'sell');
  document.getElementById('tabBuy').classList.toggle('active', tab === 'buy');
  currentStep = 1;
}

// ──────────────────────────────────────────────────
// STEP NAVIGATION
// ──────────────────────────────────────────────────
function nextStep(from) {
  if (!validateStep(from)) return;
  document.getElementById('step' + from).classList.remove('active');
  document.getElementById('sdot' + from).classList.remove('active');
  document.getElementById('sdot' + from).classList.add('done');
  currentStep = from + 1;
  document.getElementById('step' + currentStep).classList.add('active');
  document.getElementById('sdot' + currentStep).classList.add('active');
  document.querySelector('.multi-step-form.active')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function prevStep(from) {
  document.getElementById('step' + from).classList.remove('active');
  document.getElementById('sdot' + from).classList.remove('active');
  currentStep = from - 1;
  document.getElementById('step' + currentStep).classList.add('active');
  document.getElementById('sdot' + currentStep).classList.remove('done');
  document.getElementById('sdot' + currentStep).classList.add('active');
}

// ──────────────────────────────────────────────────
// CONDITIONAL FIELDS
// ──────────────────────────────────────────────────
function toggleCustomType() {
  const type = document.getElementById('s_type').value;
  const wrap = document.getElementById('customTypeWrap');
  if (wrap) wrap.style.display = type === 'Other' ? 'block' : 'none';
}

function toggleCustomUnit() {
  const unit = document.getElementById('s_size_unit').value;
  const wrap = document.getElementById('customUnitWrap');
  if (wrap) wrap.style.display = unit === 'Other' ? 'block' : 'none';
}

function toggleCustomCity() {
  const city = document.getElementById('s_city').value;
  const wrap = document.getElementById('customCityWrap');
  if (wrap) wrap.style.display = city === 'Other' ? 'block' : 'none';
}

function toggleCustomSociety() {
  const soc = document.getElementById('s_society').value;
  const wrap = document.getElementById('customSocietyWrap');
  if (wrap) wrap.style.display = soc === 'Other' ? 'block' : 'none';
}

// Buyer form custom toggles
function toggleBuyerCustomCity() {
  const city = document.getElementById('b_city').value;
  const wrap = document.getElementById('bCustomCityWrap');
  if (wrap) wrap.style.display = city === 'Other' ? 'block' : 'none';
}

function toggleBuyerCustomSociety() {
  const soc = document.getElementById('b_society').value;
  const wrap = document.getElementById('bCustomSocietyWrap');
  if (wrap) wrap.style.display = soc === 'Other' ? 'block' : 'none';
}

function toggleBuyerCustomType() {
  const type = document.getElementById('b_type').value;
  const wrap = document.getElementById('bCustomTypeWrap');
  if (wrap) wrap.style.display = type === 'Other' ? 'block' : 'none';
}

// ──────────────────────────────────────────────────
// BI-DIRECTIONAL PRICE CALCULATION
// ──────────────────────────────────────────────────
function calcPrice(source) {
  const sizeVal = parseFloat(document.getElementById('s_size_value')?.value) || 0;
  const perUnit = parseFloat(document.getElementById('s_price_per_unit')?.value);
  const total   = parseFloat(document.getElementById('s_total_price')?.value);
  const conflict = document.getElementById('priceConflict');
  if (conflict) conflict.style.display = 'none';

  if (source === 'size') {
    if (!isNaN(perUnit) && sizeVal > 0) {
      document.getElementById('s_total_price').value = Math.round(perUnit * sizeVal);
    } else if (!isNaN(total) && sizeVal > 0) {
      document.getElementById('s_price_per_unit').value = Math.round(total / sizeVal);
    }
  } else if (source === 'perUnit') {
    if (sizeVal > 0 && !isNaN(perUnit)) {
      document.getElementById('s_total_price').value = Math.round(perUnit * sizeVal);
    }
  } else if (source === 'total') {
    if (sizeVal > 0 && !isNaN(total)) {
      document.getElementById('s_price_per_unit').value = Math.round(total / sizeVal);
    }
  }

  // Conflict check
  const finalPer   = parseFloat(document.getElementById('s_price_per_unit')?.value) || 0;
  const finalTotal = parseFloat(document.getElementById('s_total_price')?.value) || 0;
  if (finalPer > 0 && finalTotal > 0 && sizeVal > 0) {
    const expected = Math.round(finalPer * sizeVal);
    const diff = Math.abs(expected - finalTotal);
    if (diff > sizeVal && conflict) conflict.style.display = 'block';
  }
  updatePreview();
}

function updatePreview() {
  const sizeVal  = document.getElementById('s_size_value')?.value || '';
  const sizeUnit = document.getElementById('s_size_unit')?.value || '';
  const perUnit  = parseFloat(document.getElementById('s_price_per_unit')?.value) || 0;
  const total    = parseFloat(document.getElementById('s_total_price')?.value) || 0;
  const preview  = document.getElementById('pricePreview');
  if (!preview) return;

  if (!sizeVal && !perUnit && !total) { preview.style.display = 'none'; return; }
  preview.style.display = 'block';
  document.getElementById('prev_size').textContent     = sizeVal ? `${sizeVal} ${sizeUnit}` : '—';
  document.getElementById('prev_per_unit').textContent = perUnit ? 'PKR ' + formatPKR(perUnit) : '—';
  document.getElementById('prev_total').textContent    = total   ? 'PKR ' + formatPKR(total)   : '—';
}

// ──────────────────────────────────────────────────
// FEATURES CHECKLIST RENDERER
// ──────────────────────────────────────────────────
function renderFeaturesChecklist() {
  const container = document.getElementById('featuresChecklist');
  if (!container) return;
  container.innerHTML = FEATURES_LIST.map((f, i) => `
    <label class="feature-check">
      <input type="checkbox" name="feature" value="${f}" id="fc_${i}" />
      <span>${f}</span>
    </label>
  `).join('');
}

function getSelectedFeatures() {
  return Array.from(document.querySelectorAll('#featuresChecklist input[type="checkbox"]:checked'))
    .map(cb => cb.value);
}

// ──────────────────────────────────────────────────
// MEDIA PROCESSING ENGINE (client-side)
// ──────────────────────────────────────────────────

/**
 * Resize & compress an image File using Canvas API.
 * Returns a Promise<{ dataUrl, width, height, sizeKB }>
 */
function processImage(file, maxW = 1200, maxH = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width: w, height: h } = img;

        // Scale down if needed
        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);
        resolve({ dataUrl, width: w, height: h, sizeKB, name: file.name });
      };
      img.onerror = () => reject(new Error('Image load failed: ' + file.name));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

/**
 * Generate a thumbnail version (card-sized) from the same file.
 * 400×300 crop-center for uniform card display.
 */
function generateThumbnail(file, thumbW = 400, thumbH = 300) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = thumbW;
        canvas.height = thumbH;
        const ctx = canvas.getContext('2d');

        // Smart crop-center: scale to cover then center
        const scale = Math.max(thumbW / img.width, thumbH / img.height);
        const sw = img.width * scale;
        const sh = img.height * scale;
        const ox = (thumbW - sw) / 2;
        const oy = (thumbH - sh) / 2;

        ctx.drawImage(img, ox, oy, sw, sh);
        resolve(canvas.toDataURL('image/jpeg', 0.80));
      };
      img.onerror = () => reject(new Error('Thumb generation failed'));
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Validate video file: format and size.
 */
function validateVideo(file) {
  const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
  const MAX_SIZE_MB = 150;
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `Unsupported video format (${file.type}). Use MP4, MOV, WEBM.` };
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `Video too large (${Math.round(file.size/1024/1024)}MB). Max ${MAX_SIZE_MB}MB.` };
  }
  return { valid: true };
}

/**
 * Generate a poster/thumbnail from a video file using canvas capture.
 * Seeks to 1.5s to get a representative frame.
 */
function generateVideoPoster(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.muted = true;
    video.currentTime = 1.5;
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, 640, 360);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.75));
    });
    video.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      resolve(null); // graceful failure
    });
    video.load();
  });
}

// Processed media store
let processedImages = []; // [{dataUrl, thumbnailUrl, name, sizeKB, width, height, status}]
let processedVideo  = null; // {dataUrl or objectUrl, posterUrl, name, status}

async function previewImages(input) {
  const preview = document.getElementById('imgPreview');
  const progressEl = document.getElementById('imgProcessingStatus');
  if (!preview) return;

  const files = Array.from(input.files).slice(0, 10);
  if (!files.length) return;

  processedImages = [];
  preview.innerHTML = '';
  if (progressEl) {
    progressEl.style.display = 'flex';
    progressEl.innerHTML = `<span class="proc-spinner"></span> Processing ${files.length} image${files.length > 1 ? 's' : ''}…`;
  }

  let processed = 0;
  for (const file of files) {
    // Validate type
    if (!file.type.startsWith('image/')) {
      showToast(`Skipped: ${file.name} is not an image.`, 'error');
      continue;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast(`${file.name} exceeds 15MB limit — skipped.`, 'error');
      continue;
    }

    try {
      const [optimized, thumbnail] = await Promise.all([
        processImage(file, 1200, 900, 0.82),
        generateThumbnail(file, 400, 300),
      ]);

      processedImages.push({
        dataUrl: optimized.dataUrl,
        thumbnailUrl: thumbnail,
        name: file.name,
        sizeKB: optimized.sizeKB,
        width: optimized.width,
        height: optimized.height,
        status: 'ready',
      });

      // Build preview card
      const card = document.createElement('div');
      card.className = 'preview-card';
      card.innerHTML = `
        <img src="${thumbnail}" alt="${file.name}" />
        <div class="preview-card-info">
          <span class="preview-file-name">${file.name.length > 16 ? file.name.substring(0,14)+'…' : file.name}</span>
          <span class="preview-file-size">${optimized.sizeKB}KB</span>
        </div>
        <button type="button" class="preview-remove" onclick="removeImage(${processed})" title="Remove">×</button>
      `;
      preview.appendChild(card);
      processed++;

      if (progressEl) {
        progressEl.innerHTML = `<span class="proc-spinner"></span> Processed ${processed}/${files.length}…`;
      }
    } catch (err) {
      showToast(`Failed to process ${file.name}: ${err.message}`, 'error');
    }
  }

  if (progressEl) {
    if (processedImages.length > 0) {
      progressEl.innerHTML = `<svg width="14" height="14" fill="none" stroke="var(--success)" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> ${processedImages.length} image${processedImages.length > 1 ? 's' : ''} optimized and ready`;
      progressEl.style.color = 'var(--success)';
    } else {
      progressEl.style.display = 'none';
    }
  }
}

function removeImage(idx) {
  processedImages.splice(idx, 1);
  // Re-render preview
  const preview = document.getElementById('imgPreview');
  if (!preview) return;
  preview.innerHTML = processedImages.map((img, i) => `
    <div class="preview-card">
      <img src="${img.thumbnailUrl}" alt="${img.name}" />
      <div class="preview-card-info">
        <span class="preview-file-name">${img.name.length > 16 ? img.name.substring(0,14)+'…' : img.name}</span>
        <span class="preview-file-size">${img.sizeKB}KB</span>
      </div>
      <button type="button" class="preview-remove" onclick="removeImage(${i})" title="Remove">×</button>
    </div>
  `).join('');
}

async function handleVideoUpload(input) {
  const file = input.files[0];
  const statusEl = document.getElementById('videoProcessingStatus');
  const previewEl = document.getElementById('videoPreview');
  if (!file) return;

  const validation = validateVideo(file);
  if (!validation.valid) {
    showToast(validation.error, 'error');
    input.value = '';
    return;
  }

  if (statusEl) {
    statusEl.style.display = 'flex';
    statusEl.innerHTML = `<span class="proc-spinner"></span> Processing video…`;
  }

  try {
    const posterUrl = await generateVideoPoster(file);
    const objectUrl = URL.createObjectURL(file);
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);

    processedVideo = {
      objectUrl,
      posterUrl,
      name: file.name,
      sizeMB,
      type: file.type,
      status: 'ready',
    };

    if (previewEl) {
      previewEl.innerHTML = `
        <div class="video-preview-card">
          ${posterUrl
            ? `<img src="${posterUrl}" alt="Video poster" class="video-poster" />`
            : `<div class="video-poster-fallback"><svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15 10l4.553-2.069A1 1 0 0121 8.879V15.12a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg></div>`
          }
          <div class="video-play-icon">▶</div>
          <div class="video-preview-info">
            <span>${file.name}</span>
            <span>${sizeMB}MB · ${file.type.split('/')[1].toUpperCase()}</span>
          </div>
          <button type="button" class="preview-remove" onclick="removeVideo()" title="Remove video">×</button>
        </div>
      `;
    }

    if (statusEl) {
      statusEl.innerHTML = `<svg width="14" height="14" fill="none" stroke="var(--success)" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Video ready (${sizeMB}MB) — poster generated`;
      statusEl.style.color = 'var(--success)';
    }
  } catch (err) {
    showToast('Video processing failed: ' + err.message, 'error');
    if (statusEl) statusEl.style.display = 'none';
  }
}

function removeVideo() {
  processedVideo = null;
  const previewEl = document.getElementById('videoPreview');
  const statusEl  = document.getElementById('videoProcessingStatus');
  const input = document.getElementById('s_video');
  if (previewEl) previewEl.innerHTML = '';
  if (statusEl) statusEl.style.display = 'none';
  if (input) input.value = '';
}

// ──────────────────────────────────────────────────
// STEP VALIDATION
// ──────────────────────────────────────────────────
function validateStep(step) {
  if (step === 1) {
    const title    = document.getElementById('s_title').value.trim();
    const type     = document.getElementById('s_type').value;
    const sizeVal  = document.getElementById('s_size_value').value.trim();
    const sizeUnit = document.getElementById('s_size_unit').value;
    const perUnit  = document.getElementById('s_price_per_unit').value.trim();
    const total    = document.getElementById('s_total_price').value.trim();

    if (!title)    return showToast('Please enter a listing title.', 'error'), false;
    if (!type)     return showToast('Please select a property type.', 'error'), false;
    if (type === 'Other' && !document.getElementById('s_custom_type').value.trim())
                   return showToast('Please specify the custom property type.', 'error'), false;
    if (!sizeVal || isNaN(parseFloat(sizeVal)) || parseFloat(sizeVal) <= 0)
                   return showToast('Please enter a valid plot size value.', 'error'), false;
    if (!sizeUnit) return showToast('Please select a size unit.', 'error'), false;
    if (sizeUnit === 'Other' && !document.getElementById('s_custom_unit').value.trim())
                   return showToast('Please specify the custom size unit.', 'error'), false;
    if (!perUnit && !total)
                   return showToast('Please enter at least one price field (Per Unit or Total).', 'error'), false;

    const conflict = document.getElementById('priceConflict');
    if (conflict && conflict.style.display !== 'none') {
      return showToast('Pricing conflict detected. Please fix Per Unit or Total Price.', 'error'), false;
    }
  }

  if (step === 2) {
    const city    = document.getElementById('s_city').value;
    const society = document.getElementById('s_society').value;
    if (!city)    return showToast('Please select a city.', 'error'), false;
    if (city === 'Other' && !document.getElementById('s_custom_city').value.trim())
                  return showToast('Please enter your city name.', 'error'), false;
    if (!society) return showToast('Please select a society / project.', 'error'), false;
    if (society === 'Other' && !document.getElementById('s_custom_society').value.trim())
                  return showToast('Please enter the society / project name.', 'error'), false;
  }

  return true;
}

// ──────────────────────────────────────────────────
// SUBMIT PROPERTY (SELLER) — Full v3 schema
// ──────────────────────────────────────────────────
function submitProperty() {
  const name  = document.getElementById('s_name').value.trim();
  const phone = document.getElementById('s_phone').value.trim();
  if (!name || !phone) return showToast('Please enter your name and phone number.', 'error');

  const sizeVal  = parseFloat(document.getElementById('s_size_value').value) || 0;
  const sizeUnit = document.getElementById('s_size_unit').value;
  const customUnit = sizeUnit === 'Other' ? document.getElementById('s_custom_unit').value.trim() : '';
  const effectiveUnit = customUnit || sizeUnit;

  const perUnit  = parseFloat(document.getElementById('s_price_per_unit').value) || 0;
  const total    = parseFloat(document.getElementById('s_total_price').value) || 0;
  const type     = document.getElementById('s_type').value;

  const resolvedTotal   = total   || (perUnit && sizeVal ? Math.round(perUnit * sizeVal) : 0);
  const resolvedPerUnit = perUnit || (total && sizeVal   ? Math.round(total / sizeVal)   : 0);

  const citySelect     = document.getElementById('s_city').value;
  const customCity     = citySelect === 'Other' ? document.getElementById('s_custom_city').value.trim() : '';
  const effectiveCity  = customCity || citySelect;

  const socSelect      = document.getElementById('s_society').value;
  const customSociety  = socSelect === 'Other' ? document.getElementById('s_custom_society').value.trim() : '';
  const effectiveSoc   = customSociety || socSelect;

  const selectedFeatures = getSelectedFeatures();
  const otherFeatures    = document.getElementById('s_other_features').value.trim();

  // Build images array from processed media
  const images = processedImages.map(img => img.dataUrl);
  const thumbnails = processedImages.map(img => img.thumbnailUrl);

  const publicData = {
    // Core listing info
    title:               document.getElementById('s_title').value.trim(),
    property_type:       type,
    custom_property_type: type === 'Other' ? document.getElementById('s_custom_type').value.trim() : '',

    // Size
    plot_size_value:     sizeVal,
    plot_size_unit:      effectiveUnit,
    custom_plot_unit:    customUnit,
    plot_size:           `${sizeVal} ${effectiveUnit}`,

    // Pricing
    price_per_unit:      resolvedPerUnit,
    total_price:         resolvedTotal,
    price:               resolvedTotal,
    price_label:         formatPKR(resolvedTotal),
    price_per_unit_label: resolvedPerUnit ? formatPKR(resolvedPerUnit) : '',

    // Location
    city:                effectiveCity,
    custom_city:         customCity,
    society:             effectiveSoc,
    custom_society:      customSociety,
    block:               document.getElementById('s_block').value.trim(),
    street:              document.getElementById('s_street').value.trim(),
    landmark:            document.getElementById('s_landmark').value.trim(),

    // Content
    description:         document.getElementById('s_desc').value.trim(),
    key_features:        selectedFeatures,
    other_features:      otherFeatures,
    features:            [...selectedFeatures, ...(otherFeatures ? [otherFeatures] : [])],

    // Media
    images:              images.length ? images : [],
    thumbnails:          thumbnails.length ? thumbnails : [],
    videos:              processedVideo ? [processedVideo.objectUrl] : [],
    video_poster:        processedVideo?.posterUrl || null,
    featured_image:      thumbnails[0] || images[0] || null,

    // Media processing metadata
    media_processing_status: {
      images_processed: processedImages.length,
      video_processed: !!processedVideo,
      thumbnails_generated: thumbnails.length,
      poster_generated: !!processedVideo?.posterUrl,
    },
  };

  const privateData = {
    name,
    phone,
    email: document.getElementById('s_email').value.trim(),
    notes: document.getElementById('s_notes').value.trim(),
  };

  // Show loading state
  const submitBtn = document.getElementById('submitSell');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="proc-spinner" style="border-color:#fff;border-top-color:transparent"></span> Submitting…';
  }

  try {
    DB.submitListing(publicData, privateData);

    document.getElementById('formSell').innerHTML = `
      <div style="text-align:center;padding:60px 20px">
        <div style="width:80px;height:80px;background:linear-gradient(135deg,var(--gold),var(--gold-dark));border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
          <svg width="40" height="40" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h2 style="color:var(--navy);margin-bottom:12px">Property Submitted!</h2>
        <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:10px;padding:14px 20px;display:inline-block;margin-bottom:20px">
          <p style="color:var(--success);font-weight:600;font-size:.9rem">✓ Saved &amp; Live — your listing is now visible on the Properties page</p>
        </div>
        <p style="color:var(--text-muted);max-width:440px;margin:0 auto 12px">
          Your property (<strong>${publicData.title}</strong>) has been submitted successfully.
          Our team will contact you within 24 hours.
        </p>
        <div style="background:var(--gray-50);border:1px solid var(--gray-100);border-radius:12px;padding:16px;max-width:380px;margin:0 auto 28px;font-size:.85rem;text-align:left">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;color:var(--text-muted)">
            <span>Type: <strong style="color:var(--navy)">${publicData.property_type}</strong></span>
            <span>Size: <strong style="color:var(--navy)">${publicData.plot_size}</strong></span>
            <span>Per Unit: <strong style="color:var(--gold)">${publicData.price_per_unit_label || '—'}</strong></span>
            <span>Total: <strong style="color:var(--gold)">${publicData.price_label}</strong></span>
            <span>City: <strong style="color:var(--navy)">${publicData.city}</strong></span>
            <span>Society: <strong style="color:var(--navy)">${publicData.society}</strong></span>
          </div>
          ${processedImages.length ? `<p style="margin-top:10px;color:var(--success);font-size:.78rem">✓ ${processedImages.length} optimized image${processedImages.length > 1 ? 's' : ''} uploaded</p>` : ''}
          ${processedVideo ? `<p style="color:var(--success);font-size:.78rem">✓ Video tour uploaded with poster</p>` : ''}
        </div>
        <a href="listings.html" class="btn btn-gold">View All Properties</a>
      </div>
    `;
  } catch (err) {
    showToast('Submission failed: ' + err.message, 'error');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Submit Property ✓';
    }
  }
}

// ──────────────────────────────────────────────────
// SUBMIT BUYER REQUIREMENT — Full v3 schema
// ──────────────────────────────────────────────────
function submitBuyerReq() {
  const title    = document.getElementById('b_title').value.trim();
  const citySel  = document.getElementById('b_city').value;
  const customCity = citySel === 'Other' ? document.getElementById('b_custom_city')?.value.trim() : '';
  const effectiveCity = customCity || citySel;
  const type     = document.getElementById('b_type').value;
  const sizeVal  = parseFloat(document.getElementById('b_size_value')?.value) || 0;
  const sizeUnit = document.getElementById('b_size_unit')?.value || '';
  const name     = document.getElementById('b_name').value.trim();
  const phone    = document.getElementById('b_phone').value.trim();

  if (!title)         return showToast('Please enter a requirement title.', 'error');
  if (!effectiveCity) return showToast('Please select or enter a city.', 'error');
  if (!type)          return showToast('Please select a property type.', 'error');
  if (!sizeVal || sizeVal <= 0) return showToast('Please enter the plot size value.', 'error');
  if (!sizeUnit)      return showToast('Please select a size unit.', 'error');
  if (!name || !phone) return showToast('Please enter your name and phone number.', 'error');

  const socSel = document.getElementById('b_society').value;
  const customSociety = socSel === 'Other' ? document.getElementById('b_custom_society')?.value.trim() : '';
  const effectiveSoc = customSociety || socSel;

  const budgetMax = parseInt(document.getElementById('b_budgetMax').value) || 0;
  const budgetMin = parseInt(document.getElementById('b_budgetMin').value) || 0;

  const publicData = {
    title,
    city:            effectiveCity,
    custom_city:     customCity,
    society:         effectiveSoc,
    custom_society:  customSociety,
    block:           document.getElementById('b_block')?.value.trim() || '',
    street:          document.getElementById('b_street')?.value.trim() || '',
    property_type:   type,
    custom_property_type: type === 'Other' ? document.getElementById('b_custom_type')?.value.trim() : '',
    plot_size_value: sizeVal,
    plot_size_unit:  sizeUnit,
    plot_size:       `${sizeVal} ${sizeUnit}`,
    budget_min:      budgetMin,
    budget_max:      budgetMax,
    budget_label:    (budgetMin ? formatPKR(budgetMin) + ' – ' : '') + formatPKR(budgetMax),
    notes:           document.getElementById('b_notes').value.trim(),
  };

  const privateData = {
    name,
    phone,
    email: document.getElementById('b_email').value.trim(),
  };

  // Show loading
  const submitBtn = document.getElementById('submitBuy');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="proc-spinner" style="border-color:#fff;border-top-color:transparent"></span> Submitting…';
  }

  try {
    DB.submitBuyerReq(publicData, privateData);

    document.getElementById('formBuy').innerHTML = `
      <div style="text-align:center;padding:60px 20px">
        <div style="width:80px;height:80px;background:linear-gradient(135deg,var(--gold),var(--gold-dark));border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
          <svg width="40" height="40" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h2 style="color:var(--navy);margin-bottom:12px">Requirement Posted!</h2>
        <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:10px;padding:14px 20px;display:inline-block;margin-bottom:20px">
          <p style="color:var(--success);font-weight:600;font-size:.9rem">✓ Saved &amp; Live — your requirement is now visible to sellers</p>
        </div>
        <p style="color:var(--text-muted);max-width:440px;margin:0 auto 28px">
          We're now searching for <strong>${sizeVal} ${sizeUnit} ${type}</strong>
          in <strong>${effectiveCity}</strong>${effectiveSoc ? ' — ' + effectiveSoc : ''} for you.
          Our team will match suitable properties shortly.
        </p>
        <a href="listings.html" class="btn btn-gold">Browse Properties</a>
      </div>
    `;
  } catch (err) {
    showToast('Submission failed: ' + err.message, 'error');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Submit Requirement ✓';
    }
  }
}

// Init checklist on load
document.addEventListener('DOMContentLoaded', () => {
  renderFeaturesChecklist();
});
