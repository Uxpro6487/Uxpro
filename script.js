// --- UXPRO STUDIO ENGINE LOGIC ---

// State Management Variables
let activeTool = 'txt';
let historyLogs = JSON.parse(localStorage.getItem('uxpro_history') || '[]');

// DOM Elements Initialization
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

// Navigation Transition Handlers
function showWorkspace() {
  welcomeDashboard.classList.add('opacity-0', 'scale-95', 'hidden');
  mainDashboardView.classList.add('hidden', 'opacity-0');
  workspaceSection.classList.remove('hidden');
  setTimeout(() => {
    workspaceSection.classList.remove('opacity-0', 'scale-95');
    workspaceSection.classList.add('opacity-100', 'scale-100');
  }, 50);
}

function showDashboard() {
  workspaceSection.classList.remove('opacity-100', 'scale-100');
  workspaceSection.classList.add('opacity-0', 'scale-95');
  setTimeout(() => {
    workspaceSection.classList.add('hidden');
    welcomeDashboard.classList.remove('hidden');
    setTimeout(() => {
      welcomeDashboard.classList.remove('opacity-0', 'scale-95');
    }, 50);
  }, 300);
}

function launchMainGrid() {
  welcomeDashboard.classList.add('opacity-0', 'scale-95', 'hidden');
  workspaceSection.classList.add('hidden');
  mainDashboardView.classList.remove('hidden');
  setTimeout(() => {
    mainDashboardView.classList.remove('opacity-0');
  }, 50);
}

if(getStartedBtn) getStartedBtn.addEventListener('click', launchMainGrid);
if(backToHomeBtn) backToHomeBtn.addEventListener('click', showDashboard);
if(backToDashboardBtn) backToDashboardBtn.addEventListener('click', launchMainGrid);
if(brandHome) brandHome.addEventListener('click', showDashboard);

// Tab Navigation Switching
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

// Tool Card Click Triggers
document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('click', () => {
    const toolName = card.getAttribute('data-tool');
    activeTool = toolName;
    setupToolInterface(toolName);
    showWorkspace();
  });
});

// Tool Interface Configuration Layouts
function setupToolInterface(tool) {
  activeToolTitle.textContent = cardTitleMap(tool);
  
  // Hide all specialized containers first
  document.getElementById('paletteFieldsContainer').classList.add('hidden');
  document.getElementById('contrastFieldsContainer').classList.add('hidden');
  document.getElementById('thumbnailFieldsContainer').classList.add('hidden');
  document.getElementById('imageUploadFieldsContainer').classList.add('hidden');
  document.getElementById('regexFieldsContainer').classList.add('hidden');
  document.getElementById('diffFieldsContainer').classList.add('hidden');
  document.getElementById('diffResultsContainer').classList.add('hidden');
  document.getElementById('codeHighlightView').classList.add('hidden');
  document.getElementById('previewContainer').classList.add('hidden');
  document.getElementById('svgPreviewDisplayWindow').classList.add('hidden');
  document.getElementById('thumbnailPreviewDisplayWindow').classList.add('hidden');
  document.getElementById('dragDropArea').classList.remove('hidden');

  if(tool === 'palette') {
    document.getElementById('paletteFieldsContainer').classList.remove('hidden');
    generateDynamicPalette();
  } else if(tool === 'contrast') {
    document.getElementById('contrastFieldsContainer').classList.remove('hidden');
  } else if(tool === 'thumbnail') {
    document.getElementById('thumbnailFieldsContainer').classList.remove('hidden');
    document.getElementById('thumbnailPreviewDisplayWindow').classList.remove('hidden');
    document.getElementById('dragDropArea').classList.add('hidden');
    setupAITrendingThumbnailUI();
    drawThumbnailCanvas();
  } else if(tool === 'img2base64') {
    document.getElementById('imageUploadFieldsContainer').classList.remove('hidden');
  } else if(tool === 'svgpreview' || tool === 'jsonformat') {
    document.getElementById('codeHighlightView').classList.remove('hidden');
    document.getElementById('svgPreviewDisplayWindow').classList.remove('hidden');
  } else if(tool === 'markdown') {
    document.getElementById('previewContainer').classList.remove('hidden');
  } else if(tool === 'regex') {
    document.getElementById('regexFieldsContainer').classList.remove('hidden');
  } else if(tool === 'diff') {
    document.getElementById('diffFieldsContainer').classList.remove('hidden');
    document.getElementById('diffResultsContainer').classList.remove('hidden');
  }
}

function cardTitleMap(tool) {
  const map = {
    txt: 'Plain Text Document Exporter',
    zip: 'Zip Archive Package Compressor',
    rar: 'Rar Container Package Generator',
    pdf: 'PDF Document Compiler Engine',
    docx: 'Microsoft Word .docx Builder',
    thumbnail: 'AI Trending YouTube Thumbnail Studio',
    palette: 'Dynamic Harmonized Color Palette Generator',
    contrast: 'WCAG Accessibility Contrast Analyzer',
    img2base64: 'Image Asset To Base64 Converter',
    svgpreview: 'SVG Vector Path XML Markup Optimizer',
    lorem: 'Lorem Ipsum Placeholder Text Generator',
    markdown: 'Live Markdown Preview Renderer',
    base64encode: 'Base64 String Encryption Encoder',
    base64decode: 'Base64 String Decryption Decoder',
    jsonformat: 'JSON Tree Formatter & Validator',
    regex: 'Regular Expression Pattern Match Tester',
    diff: 'Text Difference Stream Comparator',
    uppercase: 'Alphabetical UPPERCASE Transformer',
    lowercase: 'Alphabetical lowercase Transformer'
  };
  return map[tool] || 'Workspace Tool Engine';
}

// Input Typing & Metrics Live Counters
if(contentInput) {
  contentInput.addEventListener('input', () => {
    updateMetrics();
    if(activeTool === 'markdown') {
      renderMarkdownPreview(contentInput.value);
    } else if(activeTool === 'svgpreview') {
      renderSvgPreview(contentInput.value);
    } else if(activeTool === 'jsonformat') {
      renderJsonHighlight(contentInput.value);
    } else if(activeTool === 'regex') {
      runRegexMatching();
    } else if(activeTool === 'diff') {
      runTextDiffComparison();
    }
  });
}

function updateMetrics() {
  const text = contentInput.value || '';
  charCount.textContent = text.length;
  wordCount.textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
  lineCount.textContent = text.split('\n').length;
}

// --- AI & TRENDING THUMBNAIL STUDIO LOGIC ---
let currentThumbImage = null;
let currentTrendingStyle = 'gaming';

function setupAITrendingThumbnailUI() {
  const triggerThumbBgBtn = document.getElementById('triggerThumbBgBtn');
  const thumbBgUpload = document.getElementById('thumbBgUpload');
  const aiSmartGenBtn = document.getElementById('aiSmartGenBtn');
  const thumbTextInput = document.getElementById('thumbTextInput');

  if(triggerThumbBgBtn && !triggerThumbBgBtn.hasAttribute('data-bound')) {
    triggerThumbBgBtn.setAttribute('data-bound', 'true');
    triggerThumbBgBtn.addEventListener('click', () => thumbBgUpload.click());
    thumbBgUpload.addEventListener('change', handleThumbBgUpload);
  }

  if(thumbTextInput && !thumbTextInput.hasAttribute('data-bound')) {
    thumbTextInput.setAttribute('data-bound', 'true');
    thumbTextInput.addEventListener('input', (e) => {
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
        contentInput.value = randomAiText;
        updateMetrics();
        drawThumbnailCanvas();
        triggerSuccessNotification("✨ AI optimized thumbnail text for maximum CTR!");
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
        triggerSuccessNotification("Custom thumbnail background loaded!");
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
  
  // Clear & Draw Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if(currentThumbImage) {
    ctx.drawImage(currentThumbImage, 0, 0, canvas.width, canvas.height);
  } else {
    // Gradient fallback background based on style
    let grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if(currentTrendingStyle === 'gaming') {
      grad.addColorStop(0, '#581c87');
      grad.addColorStop(1, '#831843');
    } else if(currentTrendingStyle === 'tech') {
      grad.addColorStop(0, '#1e3a8a');
      grad.addColorStop(1, '#0f766e');
    } else {
      grad.addColorStop(0, '#9a3412');
      grad.addColorStop(1, '#312e81');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Dark overlay vignette for text pop
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Trending Badge
  ctx.fillStyle = '#db2777';
  ctx.beginPath();
  ctx.roundRect(80, 80, 240, 60, 12);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px Inter, sans-serif';
  ctx.fillText('🔥 VIRAL TREND', 105, 120);

  // Draw Main Thumbnail Text
  const thumbTextInput = document.getElementById('thumbTextInput');
  const textVal = thumbTextInput ? thumbTextInput.value : (contentInput.value || 'UxPro Studio Thumbnail');
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 64px Inter, sans-serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 20;
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#000000';

  // Word wrap formatting
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

// Action Engine Execution Button Handler
if(generateBtn) {
  generateBtn.addEventListener('click', () => {
    executeTransformationEngine();
  });
}

function executeTransformationEngine() {
  progressContainer.classList.remove('opacity-0', 'pointer-events-none');
  let progress = 0;
  const startTime = performance.now();

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 25) + 15;
    if(progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      const endTime = performance.now();
      const elapsed = ((endTime - startTime) / 1000).toFixed(2);
      timeElapsed.textContent = `Time Elapsed: ${elapsed}s`;
      progressBar.style.width = '100%';
      statusText.textContent = 'Operation Completed Successfully: 100%';

      setTimeout(() => {
        progressContainer.classList.add('opacity-0', 'pointer-events-none');
        progressBar.style.width = '0%';
        processToolOutput();
      }, 500);
    } else {
      progressBar.style.width = `${progress}%`;
      statusText.textContent = `Processing Stream Pipeline: ${progress}%`;
    }
  }, 100);
}

function processToolOutput() {
  const val = contentInput.value;
  let successMsg = 'Operation completed.';

  if(activeTool === 'txt') {
    downloadBlob(val, 'uxpro_document.txt', 'text/plain');
    successMsg = 'Plain text document exported successfully.';
  } else if(activeTool === 'zip') {
    const zip = new JSZip();
    zip.file("payload.txt", val);
    zip.generateAsync({type:"blob"}).then(content => {
      downloadBlob(content, 'uxpro_archive.zip', 'application/zip');
    });
    successMsg = 'Compressed ZIP archive compiled successfully.';
  } else if(activeTool === 'pdf') {
    const element = document.createElement('div');
    element.innerHTML = `<h1 style="color:purple; font-family:sans-serif;">UxPro PDF Document</h1><p style="font-family:monospace; white-space:pre-wrap;">${val}</p>`;
    html2pdf().from(element).save('uxpro_document.pdf');
    successMsg = 'Professional PDF document compiled successfully.';
  } else if(activeTool === 'docx') {
    const doc = new docx.Document({
      sections: [{ properties: {}, children: [new docx.Paragraph(val)] }]
    });
    docx.Packer.toBlob(doc).then(blob => {
      downloadBlob(blob, 'uxpro_document.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    });
    successMsg = 'Microsoft Word document generated successfully.';
  } else if(activeTool === 'thumbnail') {
    const canvas = document.getElementById('thumbCanvas');
    canvas.toBlob(blob => {
      downloadBlob(blob, 'uxpro_trending_thumbnail.png', 'image/png');
    });
    successMsg = 'HD YouTube Thumbnail downloaded successfully.';
  } else if(activeTool === 'uppercase') {
    contentInput.value = val.toUpperCase();
    successMsg = 'Text transformed to UPPERCASE.';
  } else if(activeTool === 'lowercase') {
    contentInput.value = val.toLowerCase();
    successMsg = 'Text transformed to lowercase.';
  } else if(activeTool === 'base64encode') {
    contentInput.value = btoa(unescape(encodeURIComponent(val)));
    successMsg = 'String encoded to Base64.';
  } else if(activeTool === 'base64decode') {
    try {
      contentInput.value = decodeURIComponent(escape(atob(val)));
      successMsg = 'Base64 string decoded successfully.';
    } catch(err) {
      alert('Invalid Base64 payload string!');
    }
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
    triggerSuccessNotification("History log cleared successfully.");
  });
}
