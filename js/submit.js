// ===== SUBMIT.JS — Multi-step form logic =====

let currentStep = 1;
const totalSteps = 4;

function switchTab(tab) {
  document.getElementById('formSell').classList.toggle('active', tab === 'sell');
  document.getElementById('formBuy').classList.toggle('active', tab === 'buy');
  document.getElementById('tabSell').classList.toggle('active', tab === 'sell');
  document.getElementById('tabBuy').classList.toggle('active', tab === 'buy');
  currentStep = 1;
}

function nextStep(from) {
  if (!validateStep(from)) return;

  document.getElementById('step' + from).classList.remove('active');
  document.getElementById('sdot' + from).classList.remove('active');
  document.getElementById('sdot' + from).classList.add('done');

  currentStep = from + 1;
  document.getElementById('step' + currentStep).classList.add('active');
  document.getElementById('sdot' + currentStep).classList.add('active');

  // Scroll to top of form
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

function validateStep(step) {
  if (step === 1) {
    const title = document.getElementById('s_title').value.trim();
    const type = document.getElementById('s_type').value;
    const size = document.getElementById('s_size').value;
    const price = document.getElementById('s_price').value;
    if (!title) return showToast('Please enter a listing title.', 'error'), false;
    if (!type) return showToast('Please select a property type.', 'error'), false;
    if (!size) return showToast('Please select a plot size.', 'error'), false;
    if (!price) return showToast('Please enter the asking price.', 'error'), false;
  }
  if (step === 2) {
    const city = document.getElementById('s_city').value;
    const society = document.getElementById('s_society').value;
    if (!city) return showToast('Please select a city.', 'error'), false;
    if (!society) return showToast('Please select a society.', 'error'), false;
  }
  return true;
}

function previewImages(input) {
  const preview = document.getElementById('imgPreview');
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

function submitProperty() {
  const name = document.getElementById('s_name').value.trim();
  const phone = document.getElementById('s_phone').value.trim();
  if (!name || !phone) {
    return showToast('Please enter your name and phone number.', 'error');
  }

  const priceVal = parseInt(document.getElementById('s_price').value) || 0;
  const publicData = {
    title: document.getElementById('s_title').value.trim(),
    property_type: document.getElementById('s_type').value,
    plot_size: document.getElementById('s_size').value,
    price: priceVal,
    price_label: formatPKR(priceVal),
    description: document.getElementById('s_desc').value.trim(),
    features: document.getElementById('s_features').value.split(',').map(f => f.trim()).filter(Boolean),
    city: document.getElementById('s_city').value,
    society: document.getElementById('s_society').value,
    block: document.getElementById('s_block').value.trim(),
  };

  const privateData = {
    name,
    phone,
    email: document.getElementById('s_email').value.trim(),
    notes: document.getElementById('s_notes').value.trim(),
  };

  DB.submitListing(publicData, privateData);

  // Show success
  document.getElementById('formSell').innerHTML = `
    <div style="text-align:center;padding:60px 20px">
      <div style="width:80px;height:80px;background:linear-gradient(135deg,var(--gold),var(--gold-dark));border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
        <svg width="40" height="40" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <h2 style="color:var(--navy);margin-bottom:12px">Property Submitted!</h2>
      <p style="color:var(--text-muted);max-width:440px;margin:0 auto 28px">Your property has been submitted successfully. Our team will review it and contact you within 24 hours. Your contact details are safe with us.</p>
      <a href="listings.html" class="btn btn-gold">View All Properties</a>
    </div>
  `;
}

function submitBuyerReq() {
  const title = document.getElementById('b_title').value.trim();
  const city = document.getElementById('b_city').value;
  const type = document.getElementById('b_type').value;
  const size = document.getElementById('b_size').value;
  const name = document.getElementById('b_name').value.trim();
  const phone = document.getElementById('b_phone').value.trim();

  if (!title) return showToast('Please enter a requirement title.', 'error');
  if (!city) return showToast('Please select a city.', 'error');
  if (!type) return showToast('Please select a property type.', 'error');
  if (!name || !phone) return showToast('Please enter your name and phone number.', 'error');

  const budgetMax = parseInt(document.getElementById('b_budgetMax').value) || 0;
  const budgetMin = parseInt(document.getElementById('b_budgetMin').value) || 0;

  const publicData = {
    title,
    city,
    society: document.getElementById('b_society').value,
    property_type: type,
    plot_size: size,
    budget_min: budgetMin,
    budget_max: budgetMax,
    budget_label: (budgetMin ? formatPKR(budgetMin) + ' – ' : '') + formatPKR(budgetMax),
    notes: document.getElementById('b_notes').value.trim(),
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
      <p style="color:var(--text-muted);max-width:440px;margin:0 auto 28px">Your buying requirement has been posted. Our team will actively search and match suitable properties for you.</p>
      <a href="listings.html" class="btn btn-gold">Browse Properties</a>
    </div>
  `;
}
