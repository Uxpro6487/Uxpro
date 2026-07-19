"use strict";

// State Management Configurations
let selectedTool = 'txt';
let animationFrameId = null;
let startTime = null;

// DOM View Containers Mapping
const welcomeDashboard = document.getElementById('welcomeDashboard');
const workspaceSection = document.getElementById('workspaceSection');
const activeToolTitle = document.getElementById('activeToolTitle');
const previewContainer = document.getElementById('previewContainer');
const markdownPreview = document.getElementById('markdownPreview');

// Operational Navigation Actions Elements
const tabFiles = document.getElementById('tabFiles');
const tabUtils = document.getElementById('tabUtils');
const gridFiles = document.getElementById('gridFiles');
const gridUtils = document.getElementById('gridUtils');
const backToDashboardBtn = document.getElementById('backToDashboardBtn');
const brandHome = document.getElementById('brandHome');

// Core Operational Functionality Elements
const contentInput = document.getElementById('contentInput');
const clearInputBtn = document.getElementById('clearInputBtn');
const generateBtn = document.getElementById('generateBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const statusText = document.getElementById('statusText');
const timeElapsedText = document.getElementById('timeElapsed');

// Notification Elements
const successOverlay = document.getElementById('successMessage');
const successCard = document.getElementById('successCard');
const successDetail = document.getElementById('successDetail');

// Counters
const wordCountText = document.getElementById('wordCount');
const charCountText = document.getElementById('charCount');
const lineCountText = document.getElementById('lineCount');

// TOOL NAME DICTIONARY
const toolNames = {
  txt: 'Plain Text Converter (.txt)',
  zip: 'Zip Package Compressor (.zip)',
  rar: 'Rar Package Compressor (.rar)',
  pdf: 'PDF Document Compiler (.pdf)',
  docx: 'Word Document Builder (.docx)',
  markdown: 'Live Markdown Preview Layout',
  base64encode: 'Base64 Encryption Encoder',
  base64decode: 'Base64 Decryption Decoder',
  jsonformat: 'JSON Tree Structurer & Formatter',
  uppercase: 'Text Case Transform: UPPERCASE',
  lowercase: 'Text Case Transform: lowercase'
};

// --- NAVIGATION & TABS HANDLERS MANAGEMENT ---
tabFiles.addEventListener('click', () => {
  tabFiles.classList.add('active');
  tabUtils.classList.remove('active');
  gridFiles.classList.remove('hidden');
  gridUtils.classList.add('hidden');
});

tabUtils.addEventListener('click', () => {
  tabUtils.classList.add('active');
  tabFiles.classList.remove('active');
  gridUtils.classList.remove('hidden');
  gridFiles.classList.add('hidden');
});

// Grid Cards Activation Route Interceptor
document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('click', () => {
    selectedTool = card.getAttribute('data-tool');
    activateWorkspace(selectedTool);
  });
});

const activateWorkspace = (toolKey) => {
  activeToolTitle.textContent = toolNames[toolKey] || 'Tool Panel Active';
  
  // Custom button styling mapping depending on actions context
  if (['uppercase', 'lowercase', 'base64encode', 'base64decode', 'jsonformat'].includes(toolKey)) {
    generateBtn.textContent = "Apply Transformation Engine";
  } else if (toolKey === 'markdown') {
    generateBtn.textContent = "Refresh Render Node View";
  } else {
    generateBtn.textContent = "Generate & Download Safe File";
  }

  // Handle markdown live view states explicitly 
  if (toolKey === 'markdown') {
    previewContainer.classList.remove('hidden');
    renderMarkdownLive();
  } else {
    previewContainer.classList.add('hidden');
  }

  // Animate view states swapping
  welcomeDashboard.classList.add('hidden');
  workspaceSection.classList.remove('hidden');
  setTimeout(() => {
    workspaceSection.classList.remove('scale-95', 'opacity-0');
    workspaceSection.classList.add('scale-100', 'opacity-100');
  }, 50);
};

const routeBackToDashboard = () => {
  workspaceSection.classList.remove('scale-100', 'opacity-100');
  workspaceSection.classList.add('scale-95', 'opacity-0');
  
  setTimeout(() => {
    workspaceSection.classList.add('hidden');
    welcomeDashboard.classList.remove('hidden');
    clearUISession();
  }, 250);
};

backToDashboardBtn.addEventListener('click', routeBackToDashboard);
brandHome.addEventListener('click', routeBackToDashboard);
clearInputBtn.addEventListener('click', () => {
  contentInput.value = '';
  updateMetrics();
});

// --- CORE ANALYTICS COUNTERS ---
const updateMetrics = () => {
  const text = contentInput.value;
  charCountText.textContent = text.length;
  
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  wordCountText.textContent = words;

  const lines = text === '' ? 0 : text.split('\n').length;
  lineCountText.textContent = lines;

  if (selectedTool === 'markdown') {
    renderMarkdownLive();
  }
};

const renderMarkdownLive = () => {
  const text = contentInput.value.trim();
  if (text === '') {
    markdownPreview.innerHTML = '<span class="text-gray-500 italic text-sm">Preview window will align contents automatically...</span>';
  } else {
    markdownPreview.innerHTML = window.marked.parse(text);
  }
};

// --- TIMERS & LOADING ANIMATIONS ---
const formatTime = (seconds, milliseconds) => `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;

const handleProcessInvocation = () => {
  const rawInput = contentInput.value;
  if (!rawInput.trim()) {
    alert('Please insert structural string data into the input workspace space area first.');
    return;
  }

  generateBtn.disabled = true;
  generateBtn.classList.add('opacity-40', 'cursor-not-allowed');

  progressContainer.classList.remove('opacity-0', 'pointer-events-none');
  progressContainer.classList.add('opacity-100');
  
  progressBar.style.width = '0%';
  statusText.textContent = 'Analyzing System Stream: 0%';
  timeElapsedText.textContent = 'Time Elapsed: 0.00s';

  startTime = performance.now();
  const stepDuration = 1100; // Fluid optimization timer speed

  const animateTick = (timestamp) => {
    const elapsed = timestamp - startTime;
    const progressRatio = Math.min(elapsed / stepDuration, 1);

    progressBar.style.width = `${(progressRatio * 100).toFixed(2)}%`;
    statusText.textContent = `Processing Block: ${(progressRatio * 100).toFixed(0)}%`;

    const seconds = Math.floor(elapsed / 1000);
    const ms = Math.floor((elapsed % 1000) / 10);
    timeElapsedText.textContent = `Time Elapsed: ${formatTime(seconds, ms)}`;

    if (progressRatio < 1) {
      animationFrameId = requestAnimationFrame(animateTick);
    } else {
      executeTransformationEngine(rawInput, selectedTool);
    }
  };

  animationFrameId = requestAnimationFrame(animateTick);
};

// --- DATA PROCESSING LOGIC ROUTER ENGINE ---
const executeTransformationEngine = (input, operation) => {
  const signatureStamp = `UxPro_${Date.now()}`;

  try {
    switch (operation) {
      case 'txt':
        triggerBlobDownload(new Blob([input], { type: 'text/plain;charset=utf-8' }), `${signatureStamp}.txt`);
        triggerSuccessNotification("Target plaintext document download initialized.");
        break;
      case 'zip':
        archiveZipEngine(input, `${signatureStamp}.zip`);
        break;
      case 'rar':
        archiveZipEngine(input, `${signatureStamp}.rar`);
        break;
      case 'pdf':
        renderPdfEngine(input, `${signatureStamp}.pdf`);
        break;
      case 'docx':
        renderDocxEngine(input, `${signatureStamp}.docx`);
        break;
      case 'uppercase':
        contentInput.value = input.toUpperCase();
        triggerSuccessNotification("Transformed variables structural string characters to UPPERCASE.");
        break;
      case 'lowercase':
        contentInput.value = input.toLowerCase();
        triggerSuccessNotification("Transformed variables structural string characters to lowercase.");
        break;
      case 'base64encode':
        contentInput.value = btoa(unescape(encodeURIComponent(input)));
        triggerSuccessNotification("Encoded input text characters array safely into Base64 format.");
        break;
      case 'base64decode':
        contentInput.value = decodeURIComponent(escape(atob(input.trim())));
        triggerSuccessNotification("Decoded Base64 sequence configuration parameters successfully.");
        break;
      case 'jsonformat':
        contentInput.value = JSON.stringify(JSON.parse(input), null, 2);
        triggerSuccessNotification("Indented and arranged schema layout parameters correctly.");
        break;
      case 'markdown':
        renderMarkdownLive();
        triggerSuccessNotification("Render mapping refreshed dynamic context visibility frame.");
        break;
    }

    progressBar.style.width = '100%';
    statusText.textContent = 'Complete: 100%';
    setTimeout(() => clearUISession(), 1500);

  } catch (e) {
    alert('Processing execution validation failure error. Check syntax mapping profiles layout structure.');
    clearUISession();
  }
};

const triggerBlobDownload = (blobData, filename) => {
  const downloadLink = URL.createObjectURL(blobData);
  const anchorNode = document.createElement('a');
  anchorNode.href = downloadLink;
  anchorNode.download = filename;
  document.body.appendChild(anchorNode);
  anchorNode.click();
  setTimeout(() => {
    URL.revokeObjectURL(downloadLink);
    anchorNode.remove();
  }, 100);
};

const archiveZipEngine = (textString, completeFileName) => {
  const zipPacker = new JSZip();
  zipPacker.file("UxPro_Content_Source.txt", textString);
  zipPacker.generateAsync({ type: 'blob' }).then(blobPackage => {
    triggerBlobDownload(blobPackage, completeFileName);
    triggerSuccessNotification(`${completeFileName.endsWith('.zip') ? 'ZIP' : 'RAR Simulated'} compression package complete.`);
  });
};

const renderPdfEngine = (textString, pdfFileName) => {
  const structuralContainer = document.createElement('div');
  structuralContainer.style.color = '#1f2937';
  structuralContainer.style.padding = '35px';
  structuralContainer.style.fontFamily = 'monospace';
  structuralContainer.style.whiteSpace = 'pre-wrap';
  structuralContainer.innerText = textString;

  window.html2pdf().set({
    margin: 0.8,
    filename: pdfFileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }).from(structuralContainer).save().then(() => {
    triggerSuccessNotification("PDF generation file compiled perfectly down.");
  });
};

const renderDocxEngine = (textString, wordDocName) => {
  const { Document, Packer, Paragraph, TextRun } = window.docx;
  const docObj = new Document({
    sections: [{ children: [new Paragraph({ children: [new TextRun({ text: textString, font: "Arial", size: 24 })] })] }]
  });
  Packer.toBlob(docObj).then(blobData => {
    triggerBlobDownload(blobData, wordDocName);
    triggerSuccessNotification("DOCX structural corporate format file generated cleanly.");
  });
};

const triggerSuccessNotification = (customBodyText) => {
  successDetail.textContent = customBodyText || "Your structural transaction completed cleanly.";
  successOverlay.classList.remove('opacity-0', 'pointer-events-none');
  successOverlay.classList.add('opacity-100');
  successCard.classList.remove('scale-95');
  successCard.classList.add('scale-100');

  setTimeout(() => {
    successOverlay.classList.remove('opacity-100');
    successOverlay.classList.add('opacity-0', 'pointer-events-none');
    successCard.classList.remove('scale-100');
    successCard.classList.add('scale-95');
  }, 2000);
};

const clearUISession = () => {
  generateBtn.disabled = false;
  generateBtn.classList.remove('opacity-40', 'cursor-not-allowed');
  progressContainer.classList.remove('opacity-100');
  progressContainer.classList.add('opacity-0', 'pointer-events-none');
  progressBar.style.width = '0%';
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

// Event Listeners Wireframe
contentInput.addEventListener('input', updateMetrics);
generateBtn.addEventListener('click', handleProcessInvocation);
