// ===== SUBMIT.JS — Multi-step form logic (v2) =====

let currentStep = 1;

// ─── TAB SWITCH ───────────────────────────────────────────────
function switchTab(tab) {
  document.getElementById('formSell').classList.toggle('active', tab === 'sell');
  document.getElementById('formBuy').classList.toggle('active', tab === 'buy');
  document.getElementById('tabSell').classList.toggle('active', tab === 'sell');
  document.getElementById('tabBuy').classList.toggle('active', tab === 'buy');
  currentStep = 1;
}

// ─── STEP NAVIGATION ──────────────────────────────────────────
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

// ─── CONDITIONAL: "Other" TYPE ────────────────────────────────
function toggleCustomType() {
  const type = document.getElementById('s_type').value;
  const wrap = document.getElementById('customTypeWrap');
  if (wrap) wrap.style.display = type === 'Other' ? 'block' : 'none';
}

// ─── BI-DIRECTIONAL PRICE CALCULATION ────────────────────────
// lastEdited tracks which price field was last touched by user
let _lastPriceEdited = null;

function calcPrice(source) {
  const sizeVal = parseFloat(document.getElementById('s_size_value')?.value) || 0;
  const perUnit = parseFloat(document.getElementById('s_price_per_unit')?.value);
  const total   = parseFloat(document.getElementById('s_total_price')?.value);

  const conflict = document.getElementById('priceConflict');
  if (conflict) conflict.style.display = 'none';

  if (source === 'size') {
    // Size changed — recalculate whichever price field the user had entered
    if (!isNaN(perUnit) && sizeVal > 0) {
      const computed = perUnit * sizeVal;
      document.getElementById('s_total_price').value = Math.round(computed);
    } else if (!isNaN(total) && sizeVal > 0) {
      const computed = total / sizeVal;
      document.getElementById('s_price_per_unit').value = Math.round(computed);
    }
  } else if (source === 'perUnit') {
    _lastPriceEdited = 'perUnit';
    if (sizeVal > 0 && !isNaN(perUnit)) {
      document.getElementById('s_total_price').value = Math.round(perUnit * sizeVal);
    }
  } else if (source === 'total') {
    _lastPriceEdited = 'total';
    if (sizeVal > 0 && !isNaN(total)) {
      document.getElementById('s_price_per_unit').value = Math.round(total / sizeVal);
    } else if (sizeVal === 0 && !isNaN(total)) {
      // no size yet — just accept total, leave per unit blank
    }
  }

  // Conflict check: both were entered and size ≠ 0 but perUnit * size ≉ total
  const finalPer   = parseFloat(document.getElementById('s_price_per_unit')?.value) || 0;
  const finalTotal = parseFloat(document.getElementById('s_total_price')?.value) || 0;
  if (finalPer > 0 && finalTotal > 0 && sizeVal > 0) {
    const expected = Math.round(finalPer * sizeVal);
    const diff = Math.abs(expected - finalTotal);
    if (diff > sizeVal) { // tolerance: 1 PKR per unit
      if (conflict) conflict.style.display = 'block';
    }
  }

  updatePreview();
}

function updatePreview() {
  const sizeVal  = document.getElementById('s_size_value')?.value || '';
  const sizeUnit = document.getElementById('s_size_unit')?.value || '';
  const perUnit  = parseFloat(document.getElementById('s_price_per_unit')?.value) || 0;
  const total    = parseFloat(document.getElementById('s_total_price')?.value) || 0;

  const preview = document.getElementById('pricePreview');
  if (!preview) return;

  if (!sizeVal && !perUnit && !total) {
    preview.style.display = 'none';
    return;
  }

  preview.style.display = 'block';
  document.getElementById('prev_size').textContent  = sizeVal ? `${sizeVal} ${sizeUnit}` : '—';
  document.getElementById('prev_per_unit').textContent = perUnit ? 'PKR ' + formatPKR(perUnit) : '—';
  document.getElementById('prev_total').textContent    = total   ? 'PKR ' + formatPKR(total)   : '—';
}

// ─── STEP VALIDATION ─────────────────────────────────────────
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
    if (!perUnit && !total)
                   return showToast('Please enter at least one price field (Per Unit or Total).', 'error'), false;

    // Conflict check
    const conflict = document.getElementById('priceConflict');
    if (conflict && conflict.style.display !== 'none') {
      return showToast('Pricing conflict detected. Please fix Per Unit or Total Price.', 'error'), false;
    }
  }

  if (step === 2) {
    const city    = document.getElementById('s_city').value;
    const society = document.getElementById('s_society').value;
    if (!city)    return showToast('Please select a city.', 'error'), false;
    if (!society) return showToast('Please select a society / project.', 'error'), false;
  }

  return true;
}

// ─── IMAGE PREVIEW ────────────────────────────────────────────
function previewImages(input) {
  const preview = document.getElementById('imgPreview');
  if (!preview) return;
  preview.innerHTML = '';
  Array.from(input.files).slice(0, 10).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'preview-img';
      img.alt = 'Property photo';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

// ─── SUBMIT PROPERTY (SELLER) ─────────────────────────────────
function submitProperty() {
  const name  = document.getElementById('s_name').value.trim();
  const phone = document.getElementById('s_phone').value.trim();
  if (!name || !phone) return showToast('Please enter your name and phone number.', 'error');

  const sizeVal  = parseFloat(document.getElementById('s_size_value').value) || 0;
  const sizeUnit = document.getElementById('s_size_unit').value;
  const perUnit  = parseFloat(document.getElementById('s_price_per_unit').value) || 0;
  const total    = parseFloat(document.getElementById('s_total_price').value) || 0;
  const type     = document.getElementById('s_type').value;

  // Resolve total/perUnit if one is missing
  const resolvedTotal   = total   || (perUnit && sizeVal ? Math.round(perUnit * sizeVal) : 0);
  const resolvedPerUnit = perUnit || (total && sizeVal   ? Math.round(total / sizeVal)   : 0);

  const publicData = {
    title:               document.getElementById('s_title').value.trim(),
    property_type:       type,
    custom_property_type: type === 'Other' ? document.getElementById('s_custom_type').value.trim() : '',
    plot_size_value:     sizeVal,
    plot_size_unit:      sizeUnit,
    plot_size:           `${sizeVal} ${sizeUnit}`,        // backward compat for filters
    price_per_unit:      resolvedPerUnit,
    total_price:         resolvedTotal,
    price:               resolvedTotal,                   // backward compat for formatPKR
    price_label:         formatPKR(resolvedTotal),
    price_per_unit_label: resolvedPerUnit ? formatPKR(resolvedPerUnit) : '',
    city:                document.getElementById('s_city').value,
    society:             document.getElementById('s_society').value,
    block:               document.getElementById('s_block').value.trim(),
    description:         document.getElementById('s_desc').value.trim(),
    features:            document.getElementById('s_features').value.split(',').map(f => f.trim()).filter(Boolean),
    images:              [],
  };

  const privateData = {
    name,
    phone,
    email: document.getElementById('s_email').value.trim(),
    notes: document.getElementById('s_notes').value.trim(),
  };

  // Collect previewed images (base64 for local storage demo)
  const imgs = document.querySelectorAll('#imgPreview .preview-img');
  if (imgs.length) {
    publicData.images = Array.from(imgs).map(img => img.src);
  }

  DB.submitListing(publicData, privateData);

  document.getElementById('formSell').innerHTML = `
    <div style="text-align:center;padding:60px 20px">
      <div style="width:80px;height:80px;background:linear-gradient(135deg,var(--gold),var(--gold-dark));border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
        <svg width="40" height="40" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <h2 style="color:var(--navy);margin-bottom:12px">Property Submitted!</h2>
      <p style="color:var(--text-muted);max-width:440px;margin:0 auto 12px">
        Your property (<strong>${publicData.title}</strong>) has been submitted and is pending review.
        Our team will contact you within 24 hours.
      </p>
      <div style="background:var(--gray-50);border:1px solid var(--gray-100);border-radius:12px;padding:16px;max-width:380px;margin:0 auto 28px;font-size:.85rem;text-align:left">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;color:var(--text-muted)">
          <span>Type: <strong style="color:var(--navy)">${publicData.property_type}</strong></span>
          <span>Size: <strong style="color:var(--navy)">${publicData.plot_size}</strong></span>
          <span>Per Unit: <strong style="color:var(--gold)">${publicData.price_per_unit_label || '—'}</strong></span>
          <span>Total: <strong style="color:var(--gold)">${publicData.price_label}</strong></span>
        </div>
      </div>
      <a href="listings.html" class="btn btn-gold">View All Properties</a>
    </div>
  `;
}

// ─── SUBMIT BUYER REQUIREMENT ─────────────────────────────────
function submitBuyerReq() {
  const title    = document.getElementById('b_title').value.trim();
  const city     = document.getElementById('b_city').value;
  const type     = document.getElementById('b_type').value;
  const sizeVal  = parseFloat(document.getElementById('b_size_value')?.value) || 0;
  const sizeUnit = document.getElementById('b_size_unit')?.value || '';
  const name     = document.getElementById('b_name').value.trim();
  const phone    = document.getElementById('b_phone').value.trim();

  if (!title)  return showToast('Please enter a requirement title.', 'error');
  if (!city)   return showToast('Please select a city.', 'error');
  if (!type)   return showToast('Please select a property type.', 'error');
  if (!sizeVal || sizeVal <= 0) return showToast('Please enter the plot size value.', 'error');
  if (!sizeUnit) return showToast('Please select a size unit.', 'error');
  if (!name || !phone) return showToast('Please enter your name and phone number.', 'error');

  const budgetMax = parseInt(document.getElementById('b_budgetMax').value) || 0;
  const budgetMin = parseInt(document.getElementById('b_budgetMin').value) || 0;

  const publicData = {
    title,
    city,
    society:      document.getElementById('b_society').value,
    property_type: type,
    plot_size_value: sizeVal,
    plot_size_unit:  sizeUnit,
    plot_size:       `${sizeVal} ${sizeUnit}`,
    budget_min:    budgetMin,
    budget_max:    budgetMax,
    budget_label:  (budgetMin ? formatPKR(budgetMin) + ' – ' : '') + formatPKR(budgetMax),
    notes:         document.getElementById('b_notes').value.trim(),
  };

  const privateData = {
    name,
    phone,
    email: document.getElementById('b_email').value.trim(),
  };

  DB.submitBuyerReq(publicData, privateData);

  document.getElementById('formBuy').innerHTML = `
    <div style="text-align:center;padding:60px 20px">
      <div style="width:80px;height:80px;background:linear-gradient(135deg,var(--gold),var(--gold-dark));border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
        <svg width="40" height="40" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <h2 style="color:var(--navy);margin-bottom:12px">Requirement Posted!</h2>
      <p style="color:var(--text-muted);max-width:440px;margin:0 auto 28px">
        We're now searching for <strong>${sizeVal} ${sizeUnit} ${type}</strong> in <strong>${city}</strong> for you.
        Our team will match suitable properties shortly.
      </p>
      <a href="listings.html" class="btn btn-gold">Browse Properties</a>
    </div>
  `;
}
