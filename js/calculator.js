/**
 * AI Construction Cost Estimator - Core Engine
 * Dual Mode: AI Smart Wizard & Manual Spreadsheet Builder
 */

const aceApp = (() => {
  // Constants & Rates
  const BASE_RATES = { aplus: 6800, a: 5200, b: 4200 };
  const CAT_MULT = { residential: 1.0, commercial: 1.25, renovation: 0.65, mixed: 1.15 };
  const SUB_MULT = { house: 1.0, villa: 1.05, farmhouse: 1.1 };
  const CITY_MULT = { multan: 1.0, faisalabad: 1.0, gujranwala: 1.0, sialkot: 1.0, lahore: 1.1, islamabad: 1.15, karachi: 1.15, rawalpindi: 1.05, peshawar: 1.05, quetta: 1.05 };
  const AREA_MULT = { premium: 1.15, urban: 1.05, suburban: 1.0, developing: 0.9 };
  const EXEC_MULT = { self: 1.0, consultant: 1.06, turnkey: 1.12 };

  let currentStep = 1;
  const TOTAL_STEPS = 5;
  let chartMat, chartStr;

  // Formatting
  const fmtPKR = (num) => new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(Math.round(num));

  // --- UI & Navigation ---
  function setMode(mode) {
    document.getElementById('ace-wizard-mode').style.display = mode === 'wizard' ? 'block' : 'none';
    document.getElementById('ace-builder-mode').style.display = mode === 'builder' ? 'block' : 'none';
    document.getElementById('ace-mode-wizard').classList.toggle('active', mode === 'wizard');
    document.getElementById('ace-mode-builder').classList.toggle('active', mode === 'builder');
    if (mode === 'builder') aceBuilder.init();
  }

  function goToStep(step) {
    document.getElementById(`ace-step-${currentStep}`).classList.remove('active');
    currentStep = step;
    document.getElementById(`ace-step-${step}`).classList.add('active');
    
    // Update Indicators
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const dot = document.getElementById(`ace-step-dot-${i}`);
      const con = document.getElementById(`ace-connector-${i}`);
      dot.className = 'ace-step-dot';
      if (i < currentStep) {
        dot.classList.add('completed');
        document.getElementById(`ace-step-num-${i}`).innerHTML = '✓';
        if (con) con.classList.add('completed');
      } else if (i === currentStep) {
        dot.classList.add('active');
        document.getElementById(`ace-step-num-${i}`).textContent = i;
        if (con) con.classList.remove('completed');
      } else {
        document.getElementById(`ace-step-num-${i}`).textContent = i;
        if (con) con.classList.remove('completed');
      }
    }

    // Buttons
    document.getElementById('ace-prev-btn').style.display = step > 1 ? 'inline-flex' : 'none';
    if (step === TOTAL_STEPS) {
      document.getElementById('ace-next-btn').style.display = 'none';
      document.getElementById('ace-calc-btn').style.display = 'inline-flex';
    } else {
      document.getElementById('ace-next-btn').style.display = 'inline-flex';
      document.getElementById('ace-calc-btn').style.display = 'none';
    }
  }

  function nextStep() { if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1); }
  function prevStep() { if (currentStep > 1) goToStep(currentStep - 1); }
  function startOver() {
    document.getElementById('ace-result-panel').style.display = 'none';
    document.getElementById('ace-step-indicator').style.display = 'flex';
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      document.getElementById(`ace-step-${i}`).style.display = '';
    }
    goToStep(1);
  }

  function selectQuality(val, el) {
    document.querySelectorAll('.ace-quality-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    el.querySelector('input').checked = true;
  }

  // --- Calculation Engine ---
  function getVal(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    if (el) return el.value;
    const input = document.querySelector(`[name="${name}"]`);
    return input ? input.value : '';
  }

  function isChecked(id) { return document.getElementById(id).checked; }

  function calculate() {
    // 1. Get Values
    const cat = getVal('project_category');
    const sub = getVal('residential_subtype');
    const stories = parseInt(getVal('stories')) || 1;
    const city = getVal('city');
    const areaZone = getVal('area_type');
    const plotSize = parseFloat(getVal('plot_size')) || 0;
    const plotUnit = getVal('plot_unit');
    const coveredArea = parseFloat(getVal('covered_area')) || 0;
    const qual = getVal('quality');
    const exec = getVal('execution');

    if (coveredArea < 100) { alert('Covered area must be at least 100 sqft.'); return; }

    // 2. Plot Sqft Conversion
    let plotSqft = plotSize;
    if (plotUnit === 'marla') plotSqft = plotSize * 225;
    if (plotUnit === 'kanal') plotSqft = plotSize * 4500;

    // 3. Multipliers
    let mult = CAT_MULT[cat] || 1;
    if (cat === 'residential') mult *= (SUB_MULT[sub] || 1);
    
    let heightMult = 1.0;
    if (stories === 2) heightMult = 1.02;
    else if (stories === 3) heightMult = 1.05;
    else if (stories > 3) heightMult = 1.08 + (stories - 4) * 0.02;
    mult *= heightMult;

    mult *= (CITY_MULT[city] || 1.0);
    mult *= (AREA_MULT[areaZone] || 1.0);
    mult *= (EXEC_MULT[exec] || 1.0);

    // 4. Base Rate calculation
    const baseRate = BASE_RATES[qual] || BASE_RATES.a;
    const finalRatePerSqft = baseRate * mult;
    
    let totalCost = coveredArea * finalRatePerSqft;

    // 5. Add-ons
    let addonsTotal = 0;
    if (isChecked('addon_basement')) addonsTotal += (coveredArea / stories) * 2500;
    if (isChecked('addon_pool')) addonsTotal += 1600000;
    if (isChecked('addon_lawn')) addonsTotal += plotSqft * 0.2 * 200;
    if (isChecked('addon_rooftop')) addonsTotal += 350000;
    
    totalCost += addonsTotal;

    // Ranges
    const costLow = totalCost * 0.92;
    const costHigh = totalCost * 1.15;

    // Splits
    const matCost = totalCost * 0.65;
    const labCost = totalCost * 0.35;
    const greyCost = totalCost * 0.58;
    const finCost = totalCost * 0.42;

    // Breakdowns
    const breakdowns = [
      { name: 'Grey Structure (Foundation, Brickwork, Plaster)', cost: greyCost, pct: 58 },
      { name: 'Finishing (Tiles, Paint, Woodwork)', cost: finCost, pct: 42 },
      { name: 'Material Cost (Est)', cost: matCost, pct: 65 },
      { name: 'Labour Cost (Est)', cost: labCost, pct: 35 }
    ];

    if (addonsTotal > 0) {
      breakdowns.push({ name: 'Selected Add-ons', cost: addonsTotal, pct: Math.round((addonsTotal/totalCost)*100) });
    }

    renderResult(totalCost, costLow, costHigh, coveredArea, breakdowns, matCost, labCost, greyCost, finCost, city, qual, stories, exec);
  }

  function renderResult(mid, low, high, area, bk, mat, lab, grey, fin, city, qual, stories, exec) {
    // Hide Wizard
    for (let i = 1; i <= TOTAL_STEPS; i++) document.getElementById(`ace-step-${i}`).style.display = 'none';
    document.getElementById('ace-step-indicator').style.display = 'none';
    document.querySelector('.ace-wizard-nav').style.display = 'none';
    
    const panel = document.getElementById('ace-result-panel');
    panel.style.display = 'block';

    // Set texts
    document.getElementById('res-total').textContent = 'PKR ' + fmtPKR(mid);
    document.getElementById('res-mid').textContent = 'PKR ' + fmtPKR(mid);
    document.getElementById('res-low').textContent = 'PKR ' + fmtPKR(low);
    document.getElementById('res-high').textContent = 'PKR ' + fmtPKR(high);

    // Chips
    const uc = s => s.charAt(0).toUpperCase() + s.slice(1);
    const chipsHtml = [uc(city), `${qual.toUpperCase()} Quality`, `${stories} Story`, `${area} Sqft`, uc(exec) + ' Exec']
      .map(t => `<span class="ace-chip">${t}</span>`).join('');
    document.getElementById('res-chips').innerHTML = chipsHtml;

    // Table
    const tbody = document.getElementById('res-tbody');
    tbody.innerHTML = bk.map(b => `
      <tr>
        <td><strong>${b.name}</strong></td>
        <td class="ace-pkr">PKR ${fmtPKR(b.cost)}</td>
        <td>${b.pct}%</td>
      </tr>
    `).join('');
    document.getElementById('res-table-total').textContent = 'PKR ' + fmtPKR(mid);

    // Render Charts
    setTimeout(() => {
      renderCharts(mat, lab, grey, fin);
    }, 100);

    // WhatsApp Link
    const msg = `Hi ASK Realtors! I used your AI Calculator.\nTotal Est: PKR ${fmtPKR(mid)}\nArea: ${area} Sqft\nCity: ${uc(city)}\nQuality: ${qual.toUpperCase()}\nI would like to discuss my project.`;
    document.getElementById('whatsapp-link').href = `https://wa.me/923029564972?text=${encodeURIComponent(msg)}`;
    window.scrollTo({ top: document.getElementById('ace-estimator').offsetTop - 20, behavior: 'smooth' });
  }

  function renderCharts(mat, lab, grey, fin) {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.color = "#a0aec0";
    Chart.defaults.font.family = "'DM Sans', sans-serif";

    if (chartMat) chartMat.destroy();
    if (chartStr) chartStr.destroy();

    const ctxMat = document.getElementById('chart-material');
    chartMat = new Chart(ctxMat, {
      type: 'doughnut',
      data: { labels: ['Material', 'Labour'], datasets: [{ data: [mat, lab], backgroundColor: ['#388bfd', '#d29922'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom' } } }
    });

    const ctxStr = document.getElementById('chart-structure');
    chartStr = new Chart(ctxStr, {
      type: 'doughnut',
      data: { labels: ['Grey Structure', 'Finishing'], datasets: [{ data: [grey, fin], backgroundColor: ['#718096', '#10b981'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom' } } }
    });
  }

  // --- PDF Export ---
  function downloadPDF(mode) {
    if (typeof html2pdf === 'undefined') { alert('PDF library not loaded.'); return; }
    const element = mode === 'wizard' ? document.getElementById('ace-result-panel') : document.getElementById('builder-print-area');
    
    // Add temporary styling for PDF print
    const opt = {
      margin:       0.5,
      filename:     `ASK-Construction-Estimate-${Date.now()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#0A1118' },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    const actions = document.querySelectorAll('.ace-result-actions, .ace-builder-actions, .no-print');
    actions.forEach(el => el.style.display = 'none'); // Hide buttons

    html2pdf().set(opt).from(element).save().then(() => {
      actions.forEach(el => el.style.display = ''); // Restore buttons
    });
  }

  // Bind slider and input for Area
  document.addEventListener('DOMContentLoaded', () => {
    const range = document.getElementById('ace-covered-area-range');
    const input = document.getElementById('ace-covered-area-input');
    if (range && input) {
      range.addEventListener('input', (e) => input.value = e.target.value);
      input.addEventListener('input', (e) => range.value = e.target.value);
    }
  });

  return { setMode, nextStep, prevStep, selectQuality, calculate, startOver, downloadPDF };
})();

/**
 * Manual Spreadsheet Builder Logic
 */
const aceBuilder = (() => {
  const DEFAULTS = [
    { name: 'Excavation & Termite', cat: 'Grey Structure', unit: 'Sqft', rate: 45, qty: 1000, waste: 0 },
    { name: 'Concrete Foundation', cat: 'Grey Structure', unit: 'Cft', rate: 950, qty: 500, waste: 5 },
    { name: 'Brickwork', cat: 'Grey Structure', unit: 'Sqft', rate: 125, qty: 3000, waste: 5 },
    { name: 'Roof Slab (RCC)', cat: 'Grey Structure', unit: 'Sqft', rate: 850, qty: 1000, waste: 2 },
    { name: 'Plastering', cat: 'Grey Structure', unit: 'Sqft', rate: 65, qty: 4500, waste: 5 },
    { name: 'Plumbing Pipes', cat: 'Fittings', unit: 'Job', rate: 250000, qty: 1, waste: 0 },
    { name: 'Electrical Wiring', cat: 'Fittings', unit: 'Job', rate: 350000, qty: 1, waste: 0 },
    { name: 'Floor Tiling', cat: 'Finishing', unit: 'Sqft', rate: 280, qty: 1000, waste: 8 },
    { name: 'Paint Work', cat: 'Finishing', unit: 'Sqft', rate: 75, qty: 4500, waste: 2 },
    { name: 'Wooden Doors', cat: 'Finishing', unit: 'Nos', rate: 35000, qty: 8, waste: 0 },
    { name: 'Aluminum Windows', cat: 'Finishing', unit: 'Sqft', rate: 1200, qty: 250, waste: 0 },
    { name: 'Sanitary Fittings', cat: 'Fittings', unit: 'Job', rate: 180000, qty: 1, waste: 0 },
    { name: 'Labor Contract', cat: 'Labor', unit: 'Sqft', rate: 850, qty: 1000, waste: 0 },
  ];

  let initialized = false;

  function init() {
    if (initialized) return;
    resetTable();
    initialized = true;
  }

  function renderRow(item) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="ace-builder-input" value="${item.name}"></td>
      <td>
        <select class="ace-builder-select">
          <option value="Grey Structure" ${item.cat==='Grey Structure'?'selected':''}>Grey Structure</option>
          <option value="Finishing" ${item.cat==='Finishing'?'selected':''}>Finishing</option>
          <option value="Fittings" ${item.cat==='Fittings'?'selected':''}>Fittings</option>
          <option value="Labor" ${item.cat==='Labor'?'selected':''}>Labor</option>
          <option value="Permits & Design" ${item.cat==='Permits & Design'?'selected':''}>Permits & Design</option>
        </select>
      </td>
      <td><input type="text" class="ace-builder-input" value="${item.unit}"></td>
      <td><input type="number" class="ace-builder-input rate" value="${item.rate}" min="0" step="any" oninput="aceBuilder.calc()"></td>
      <td><input type="number" class="ace-builder-input qty" value="${item.qty}" min="0" step="any" oninput="aceBuilder.calc()"></td>
      <td><input type="number" class="ace-builder-input waste" value="${item.waste}" min="0" step="1" oninput="aceBuilder.calc()"></td>
      <td class="ace-pkr row-total">PKR 0</td>
      <td class="no-print"><button class="ace-btn-danger" onclick="this.closest('tr').remove(); aceBuilder.calc()">✕</button></td>
    `;
    document.getElementById('builder-tbody').appendChild(tr);
  }

  function addRow() {
    renderRow({ name: 'New Item', cat: 'Finishing', unit: 'Sqft', rate: 0, qty: 0, waste: 0 });
    calc();
  }

  function resetTable() {
    document.getElementById('builder-tbody').innerHTML = '';
    DEFAULTS.forEach(item => renderRow(item));
    calc();
  }

  function calc() {
    const rows = document.querySelectorAll('#builder-tbody tr');
    let grandTotal = 0;

    rows.forEach(tr => {
      const rate = parseFloat(tr.querySelector('.rate').value) || 0;
      const qty = parseFloat(tr.querySelector('.qty').value) || 0;
      const waste = parseFloat(tr.querySelector('.waste').value) || 0;
      
      const rowTotal = (rate * qty) * (1 + (waste / 100));
      tr.querySelector('.row-total').textContent = 'PKR ' + new Intl.NumberFormat('en-PK').format(Math.round(rowTotal));
      grandTotal += rowTotal;
    });

    document.getElementById('builder-grand-total').textContent = 'PKR ' + new Intl.NumberFormat('en-PK').format(Math.round(grandTotal));
  }

  return { init, addRow, resetTable, calc };
})();
