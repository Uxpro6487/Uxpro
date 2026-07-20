// --- UXPRO STUDIO ENGINE LOGIC ---

let activeTool = 'txt';
let historyLogs = JSON.parse(localStorage.getItem('uxpro_history') || '[]');

const welcomeDashboard = document.getElementById('welcomeDashboard');
const mainDashboardView = document.getElementById('mainDashboardView');
const workspaceSection = document.getElementById('workspaceSection');
const getStartedBtn = document.getElementById('getStartedBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn');
const backToDashboardBtn = document.getElementById('backToDashboardBtn');
const brandHome = document.getElementById('brandHome');

const tabFiles = document.getElementById('tabFiles');
const tabDesign = document.getElementById('tabDesign');
const tabUtils = document.getElementById('tabUtils');
const tabHistory = document.getElementById('tabHistory');

const gridFiles = document.getElementById('gridFiles');
const gridDesign = document.getElementById('gridDesign');
const gridUtils = document.getElementById('gridUtils');
const historyView = document.getElementById('historyView');

const activeToolTitle = document.getElementById('activeToolTitle');
const contentInput = document.getElementById('contentInput');
const generateBtn = document.getElementById('generateBtn');
const successMessage = document.getElementById('successMessage');
const successCard = document.getElementById('successCard');
const successDetail = document.getElementById('successDetail');

const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const lineCount = document.getElementById('lineCount');

const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const statusText = document.getElementById('statusText');
const timeElapsed = document.getElementById('timeElapsed');

function showWorkspace() {
  if (welcomeDashboard) {
    welcomeDashboard.classList.add('opacity-0', 'scale-95', 'hidden');
  }
  if (mainDashboardView) {
    mainDashboardView.classList.add('hidden', 'opacity-0');
  }
  if (workspaceSection) {
    workspaceSection.classList.remove('hidden');
    setTimeout(() => {
      workspaceSection.classList.remove('opacity-0', 'scale-95');
      workspaceSection.classList.add('opacity-100', 'scale-100');
    }, 50);
  }
}

function showDashboard() {
  if (workspaceSection) {
    workspaceSection.classList.remove('opacity-100', 'scale-100');
    workspaceSection.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
      workspaceSection.classList.add('hidden');
      if (welcomeDashboard) {
        welcomeDashboard.classList.remove('hidden');
        setTimeout(() => {
          welcomeDashboard.classList.remove('opacity-0', 'scale-95');
        }, 50);
      }
    }, 300);
  }
}

function launchMainGrid() {
  if (welcomeDashboard) {
    welcomeDashboard.classList.add('opacity-0', 'scale-95', 'hidden');
  }
  if (workspaceSection) {
    workspaceSection.classList.add('hidden');
  }
  if (mainDashboardView) {
    mainDashboardView.classList.remove('hidden');
    setTimeout(() => {
      mainDashboardView.classList.remove('opacity-0');
    }, 50);
  }
}

if(getStartedBtn) getStartedBtn.addEventListener('click', launchMainGrid);
if(backToHomeBtn) backToHomeBtn.addEventListener('click', showDashboard);
if(backToDashboardBtn) backToDashboardBtn.addEventListener('click', launchMainGrid);
if(brandHome) brandHome.addEventListener('click', showDashboard);

const tabButtons = [tabFiles, tabDesign, tabUtils, tabHistory];
const gridContainers = [gridFiles, gridDesign, gridUtils, historyView];

function switchTab(activeTab, activeGrid) {
  tabButtons.forEach(btn => btn?.classList.remove('active'));
  gridContainers.forEach(grid => grid?.classList.add('hidden'));
  
  activeTab?.classList.add('active');
  activeGrid?.classList.remove('hidden');

  if(activeGrid === historyView) renderHistoryLogs();
}

if(tabFiles) tabFiles.addEventListener('click', () => switchTab(tabFiles, gridFiles));
if(tabDesign) tabDesign.addEventListener('click', () => switchTab(tabDesign, gridDesign));
if(tabUtils) tabUtils.addEventListener('click', () => switchTab(tabUtils, gridUtils));
if(tabHistory) tabHistory.addEventListener('click', () => switchTab(tabHistory, historyView));

document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('click', () => {
    const toolName = card.getAttribute('data-tool');
    activeTool = toolName;
    setupToolInterface(toolName);
    showWorkspace();
  });
});

function setupToolInterface(tool) {
  if(activeToolTitle) activeToolTitle.textContent = cardTitleMap(tool);
  
  const paletteCon = document.getElementById('paletteFieldsContainer');
  const contrastCon = document.getElementById('contrastFieldsContainer');
  const thumbCon = document.getElementById('thumbnailFieldsContainer');
  const thumbPreview = document.getElementById('thumbnailPreviewDisplayWindow');
  const defaultPreview = document.getElementById('defaultPreviewText');
  const dragArea = document.getElementById('dragDropArea');

  if(paletteCon) paletteCon.classList.add('hidden');
  if(contrastCon) contrastCon.classList.add('hidden');
  if(thumbCon) thumbCon.classList.add('hidden');
  if(thumbPreview) thumbPreview.classList.add('hidden');
  if(defaultPreview) defaultPreview.classList.remove('hidden');
  if(dragArea) dragArea.classList.remove('hidden');

  if(tool === 'thumbnail') {
    if(thumbCon) thumbCon.classList.remove('hidden');
    if(thumbPreview) thumbPreview.classList.remove('hidden');
    if(defaultPreview) defaultPreview.classList.add('hidden');
    if(dragArea) dragArea.classList.add('hidden');
    setupAITrendingThumbnailUI();
    drawThumbnailCanvas();
  }
}

function cardTitleMap(tool) {
  const map = {
    txt: 'Plain Text Document Exporter',
    zip: 'Zip Archive Package Compressor',
    pdf: 'PDF Document Compiler Engine',
    docx: 'Microsoft Word .docx Builder',
    thumbnail: 'AI Trending YouTube Thumbnail Studio',
    palette: 'Dynamic Harmonized Color Palette Generator',
    contrast: 'WCAG Accessibility Contrast Analyzer',
    uppercase: 'Alphabetical UPPERCASE Transformer',
    lowercase: 'Alphabetical lowercase Transformer',
    base64encode: 'Base64 String Encryption Encoder'
  };
  return map[tool] || 'Workspace Tool Engine';
}

if(contentInput) {
  contentInput.addEventListener('input', () => {
    updateMetrics();
    if(activeTool === 'thumbnail') {
      drawThumbnailCanvas();
    }
  });
}

function updateMetrics() {
  const text = contentInput ? contentInput.value : '';
  if(charCount) charCount.textContent = text.length;
  if(wordCount) wordCount.textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
  if(lineCount) lineCount.textContent = text.split('\n').length;
}

// --- THUMBNAIL STUDIO LOGIC ---
let currentThumbImage = null;
let currentTrendingStyle = 'gaming';

function setupAITrendingThumbnailUI() {
  const triggerThumbBgBtn = document.getElementById('triggerThumbBgBtn');
  const thumbBgUpload = document.getElementById('thumbBgUpload');
  const aiSmartGenBtn = document.getElementById('aiSmartGenBtn');
  const thumbTextInput = document.getElementById('thumbTextInput');

  if(triggerThumbBgBtn && thumbBgUpload && !triggerThumbBgBtn.hasAttribute('data-bound')) {
    triggerThumbBgBtn.setAttribute('data-bound', 'true');
    triggerThumbBgBtn.addEventListener('click', () => thumbBgUpload.click());
    thumbBgUpload.addEventListener('change', handleThumbBgUpload);
  }

  if(thumbTextInput && !thumbTextInput.hasAttribute('data-bound')) {
    thumbTextInput.setAttribute('data-bound', 'true');
    thumbTextInput.addEventListener('input', () => {
      drawThumbnailCanvas();
      updateMetrics();
    });
  }

  document.querySelectorAll('.trend-style-btn').forEach(btn => {
    if(!btn.hasAttribute('data-bound')) {
      btn.setAttribute('data-bound', 'true');
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.trend-style-btn').forEach(b => {
          b.classList.remove('active', 'border-purple-500/50', 'bg-purple-600/20', 'font-bold');
          b.classList.add('border-gray-700', 'bg-black/40');
        });
        e.target.classList.add('active', 'border-purple-500/50', 'bg-purple-600/20', 'font-bold');
        e.target.classList.remove('border-gray-700', 'bg-black/40');
        currentTrendingStyle = e.target.getAttribute('data-style');
        drawThumbnailCanvas();
        triggerSuccessNotification(`Switched to ${currentTrendingStyle.toUpperCase()} template!`);
      });
    }
  });

  if(aiSmartGenBtn && !aiSmartGenBtn.hasAttribute('data-bound')) {
    aiSmartGenBtn.setAttribute('data-bound', 'true');
    aiSmartGenBtn.addEventListener('click', () => {
      const aiPhrases = [
        "🔥 මේක නම් පට්ටම ට්‍රික් එකක්! (Must Watch)",
        "⚠️ කවුරුත් නොදන්න රහසක්! (Secret Revealed)",
        "😱 පුදුම වෙයි! මේක බලන්නම වෙනවා",
        "⚡ ලේසියෙන්ම ගේම ගහමු! (Pro Guide)"
      ];
      const randomAiText = aiPhrases[Math.floor(Math.random() * aiPhrases.length)];
      const textInputEl = document.getElementById('thumbTextInput');
      if (textInputEl) {
        textInputEl.value = randomAiText;
        if(contentInput) contentInput.value = randomAiText;
        updateMetrics();
        drawThumbnailCanvas();
        triggerSuccessNotification("✨ AI optimized thumbnail text!");
      }
    });
  }
}

function handleThumbBgUpload(e) {
  const file = e.target.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        currentThumbImage = img;
        drawThumbnailCanvas();
        triggerSuccessNotification("Custom background loaded!");
      }
      img.src = event.target.result;
    }
    reader.readAsDataURL(file);
  }
}

function drawThumbnailCanvas() {
  const canvas = document.getElementById('thumbCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if(currentThumbImage) {
    ctx.drawImage(currentThumbImage, 0, 0, canvas.width, canvas.height);
  } else {
    let grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if(currentTrendingStyle === 'gaming') {
      grad.addColorStop(0, '#581c87');
      grad.addColorStop(1, '#831843');
    } else {
      grad.addColorStop(0, '#1e3a8a');
      grad.addColorStop(1, '#0f766e');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#db2777';
  ctx.beginPath();
  ctx.roundRect(80, 80, 240, 60, 12);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px Inter, sans-serif';
  ctx.fillText('🔥 VIRAL TREND', 105, 120);

  const thumbTextInput = document.getElementById('thumbTextInput');
  const textVal = thumbTextInput ? thumbTextInput.value : (contentInput ? contentInput.value : 'UxPro Studio');
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 64px Inter, sans-serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 20;
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#000000';

  wrapText(ctx, textVal, 80, 280, 1100, 80);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';

  for(let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.strokeText(line, x, y);
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.strokeText(line, x, y);
  context.fillText(line, x, y);
}

if(generateBtn) {
  generateBtn.addEventListener('click', () => {
    executeTransformationEngine();
  });
}

function executeTransformationEngine() {
  if(!progressContainer || !progressBar || !statusText) return;
  progressContainer.classList.remove('opacity-0', 'pointer-events-none');
  let progress = 0;
  const startTime = performance.now();

  const interval = setInterval(() => {
    progress += 25;
    if(progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      const endTime = performance.now();
      const elapsed = ((endTime - startTime) / 1000).toFixed(2);
      if(timeElapsed) timeElapsed.textContent = `Time Elapsed: ${elapsed}s`;
      progressBar.style.width = '100%';
      statusText.textContent = 'Operation Completed Successfully: 100%';

      setTimeout(() => {
        progressContainer.classList.add('opacity-0', 'pointer-events-none');
        progressBar.style.width = '0%';
        processToolOutput();
      }, 500);
    } else {
      progressBar.style.width = `${progress}%`;
      statusText.textContent = `Processing Pipeline: ${progress}%`;
    }
  }, 100);
}

function processToolOutput() {
  const val = contentInput ? contentInput.value : '';
  let successMsg = 'Operation completed.';

  if(activeTool === 'txt') {
    downloadBlob(val, 'uxpro_document.txt', 'text/plain');
    successMsg = 'Plain text exported successfully.';
  } else if(activeTool === 'thumbnail') {
    const canvas = document.getElementById('thumbCanvas');
    if(canvas) {
      canvas.toBlob(blob => {
        downloadBlob(blob, 'uxpro_thumbnail.png', 'image/png');
      });
    }
    successMsg = 'HD YouTube Thumbnail downloaded successfully.';
  } else if(activeTool === 'uppercase' && contentInput) {
    contentInput.value = val.toUpperCase();
    successMsg = 'Converted to UPPERCASE.';
  }

  triggerSuccessNotification(successMsg);
  logHistoryAction(activeTool, successMsg);
  updateMetrics();
}

function downloadBlob(content, filename, contentType) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function triggerSuccessNotification(detailText) {
  if(!successDetail || !successMessage || !successCard) return;
  successDetail.textContent = detailText;
  successMessage.classList.remove('opacity-0', 'pointer-events-none');
  successCard.classList.remove('scale-95');
  successCard.classList.add('scale-100');

  setTimeout(() => {
    successCard.classList.remove('scale-100');
    successCard.classList.add('scale-95');
    successMessage.classList.add('opacity-0', 'pointer-events-none');
  }, 3500);
}

function logHistoryAction(tool, detail) {
  const log = {
    tool: cardTitleMap(tool),
    detail: detail,
    time: new Date().toLocaleTimeString()
  };
  historyLogs.unshift(log);
  if(historyLogs.length > 20) historyLogs.pop();
  localStorage.setItem('uxpro_history', JSON.stringify(historyLogs));
}

function renderHistoryLogs() {
  const container = document.getElementById('historyContainerList');
  if(!container) return;
  if(historyLogs.length === 0) {
    container.innerHTML = '<p class="text-xs text-gray-500 italic">No historical logs recorded yet...</p>';
    return;
  }
  container.innerHTML = historyLogs.map(log => `
    <div class="bg-white/5 border border-white/10 p-3 rounded-xl flex justify-between items-center text-xs">
      <div>
        <strong class="text-purple-400 font-['Orbitron']">${log.tool}</strong>
        <p class="text-gray-300 font-mono mt-0.5">${log.detail}</p>
      </div>
      <span class="text-[10px] text-gray-500 font-mono">${log.time}</span>
    </div>
  `).join('');
}

const clearHistoryBtn = document.getElementById('clearHistoryBtn');
if(clearHistoryBtn) {
  clearHistoryBtn.addEventListener('click', () => {
    historyLogs = [];
    localStorage.removeItem('uxpro_history');
    renderHistoryLogs();
    triggerSuccessNotification("History cleared.");
  });
}
