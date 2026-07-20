"use strict";

let selectedTool = 'txt';
let animationFrameId = null;
let startTime = null;
let speechRecognitionEngine = null;
let isVoiceRecordingActive = false;

// DOM View Containers
const welcomeDashboard = document.getElementById('welcomeDashboard');
const mainDashboardView = document.getElementById('mainDashboardView');
const workspaceSection = document.getElementById('workspaceSection');
const getStartedBtn = document.getElementById('getStartedBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn');
const activeToolTitle = document.getElementById('activeToolTitle');

// Preview Views
const previewContainer = document.getElementById('previewContainer');
const markdownPreview = document.getElementById('markdownPreview');
const svgPreviewDisplayWindow = document.getElementById('svgPreviewDisplayWindow');
const thumbnailPreviewDisplayWindow = document.getElementById('thumbnailPreviewDisplayWindow');
const thumbCanvas = document.getElementById('thumbCanvas');

// Navigation Tabs & Grids
const tabFiles = document.getElementById('tabFiles');
const tabDesign = document.getElementById('tabDesign');
const tabUtils = document.getElementById('tabUtils');
const tabHistory = document.getElementById('tabHistory');
const gridFiles = document.getElementById('gridFiles');
const gridDesign = document.getElementById('gridDesign');
const gridUtils = document.getElementById('gridUtils');
const historyView = document.getElementById('historyView');
const historyContainerList = document.getElementById('historyContainerList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const sidebarToolNavList = document.querySelectorAll('.sidebar-tool-btn');

const backToDashboardBtn = document.getElementById('backToDashboardBtn');
const brandHome = document.getElementById('brandHome');

// Inputs Processing Core Hooks
const dragDropArea = document.getElementById('dragDropArea');
const dragZoneOverlay = document.getElementById('dragZoneOverlay');
const contentInput = document.getElementById('contentInput');
const codeHighlightView = document.getElementById('codeHighlightView');
const clearInputBtn = document.getElementById('clearInputBtn');
const generateBtn = document.getElementById('generateBtn');
const speechRecordBtn = document.getElementById('speechRecordBtn');
const speechIconDot = document.getElementById('speechIconDot');
const speechTextLabel = document.getElementById('speechTextLabel');

// Design Layout Containers Mapping
const paletteFieldsContainer = document.getElementById('paletteFieldsContainer');
const contrastFieldsContainer = document.getElementById('contrastFieldsContainer');
const contrastTextColor = document.getElementById('contrastTextColor');
const contrastBgColor = document.getElementById('contrastBgColor');
const contrastLiveCard = document.getElementById('contrastLiveCard');
const imageUploadFieldsContainer = document.getElementById('imageUploadFieldsContainer');
const designImageFileSelector = document.getElementById('designImageFileSelector');
const triggerImageSelectBtn = document.getElementById('triggerImageSelectBtn');
const imagePreviewFeedbackName = document.getElementById('imagePreviewFeedbackName');

// Thumbnail Studio Fields
const thumbnailFieldsContainer = document.getElementById('thumbnailFieldsContainer');
const thumbBgUpload = document.getElementById('thumbBgUpload');
const triggerThumbBgBtn = document.getElementById('triggerThumbBgBtn');
const thumbTextInput = document.getElementById('thumbTextInput');

// General Auxiliary Fields Panels
const regexFieldsContainer = document.getElementById('regexFieldsContainer');
const regexPatternInput = document.getElementById('regexPatternInput');
const regexStatusFeedback = document.getElementById('regexStatusFeedback');
const diffFieldsContainer = document.getElementById('diffFieldsContainer');
const diffSecondaryInput = document.getElementById('diffSecondaryInput');
const diffResultsContainer = document.getElementById('diffResultsContainer');
const diffVisualizerBox = document.getElementById('diffVisualizerBox');

// Progress tracking parameters
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const statusText = document.getElementById('statusText');
const timeElapsedText = document.getElementById('timeElapsed');

const successOverlay = document.getElementById('successMessage');
const successCard = document.getElementById('successCard');
const successDetail = document.getElementById('successDetail');

const wordCountText = document.getElementById('wordCount');
const charCountText = document.getElementById('charCount');
const lineCountText = document.getElementById('lineCount');

const toolNames = {
  txt: 'Plain Text Converter (.txt)', zip: 'Zip Package Compressor (.zip)', rar: 'Rar Package Compressor (.rar)',
  pdf: 'PDF Document Compiler (.pdf)', docx: 'Word Document Builder (.docx)',
  thumbnail: 'YouTube Thumbnail Studio 🖼️ [Design Mode]',
  palette: 'Dynamic Palette Generator [Design Mode]', contrast: 'WCAG Contrast Checker Analysis [Design Mode]',
  img2base64: 'Image Asset To Base64 Encoder [Design Mode]', svgpreview: 'SVG Code Paths Optimizer [Design Mode]',
  lorem: 'Lorem Ipsum Dummy Typography Core [Design Mode]',
  markdown: 'Live Markdown Preview Layout', base64encode: 'Base64 Encryption Encoder', base64decode: 'Base64 Decryption Decoder',
  jsonformat: 'JSON Tree Structurer & Formatter', regex: 'Regular Expression Match Tester', diff: 'Delta Core Text Difference Comparator',
  uppercase: 'Text Case Transform: UPPERCASE', lowercase: 'Text Case Transform: lowercase'
};

// --- WELCOME & TRANSITION CONTROLLERS ---
getStartedBtn.addEventListener('click', () => {
  welcomeDashboard.classList.add('opacity-0', 'scale-95');
  setTimeout(() => {
    welcomeDashboard.classList.add('hidden');
    mainDashboardView.classList.remove('hidden');
    setTimeout(() => mainDashboardView.classList.remove('opacity-0'), 50);
  }, 300);
});

backToHomeBtn.addEventListener('click', () => {
  mainDashboardView.classList.add('opacity-0');
  setTimeout(() => {
    mainDashboardView.classList.add('hidden');
    welcomeDashboard.classList.remove('hidden');
    welcomeDashboard.classList.remove('opacity-0', 'scale-95');
  }, 300);
});

// --- MULTI-TAB VIEW SYSTEM CONTROLLER ---
const toggleTabActiveState = (activeTab, visibleGrid) => {
  [tabFiles, tabDesign, tabUtils, tabHistory].forEach(btn => btn.classList.remove('active'));
  [gridFiles, gridDesign, gridUtils, historyView].forEach(view => view.classList.add('hidden'));
  
  activeTab.classList.add('active');
  visibleGrid.classList.remove('hidden');

  if(activeTab === tabHistory) refreshHistoryLogListDisplay();
};

tabFiles.addEventListener('click', () => toggleTabActiveState(tabFiles, gridFiles));
tabDesign.addEventListener('click', () => toggleTabActiveState(tabDesign, gridDesign));
tabUtils.addEventListener('click', () => toggleTabActiveState(tabUtils, gridUtils));
tabHistory.addEventListener('click', () => toggleTabActiveState(tabHistory, historyView));

// Sidebar Quick Nav integration
sidebarToolNavList.forEach(btn => {
  btn.addEventListener('click', () => {
    sidebarToolNavList.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const targetId = btn.getAttribute('data-target');
    if(targetId === 'gridFiles') toggleTabActiveState(tabFiles, gridFiles);
    else if(targetId === 'gridDesign') toggleTabActiveState(tabDesign, gridDesign);
    else if(targetId === 'gridUtils') toggleTabActiveState(tabUtils, gridUtils);
    else if(targetId === 'historyView') toggleTabActiveState(tabHistory, historyView);
  });
});

document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('click', () => {
    selectedTool = card.getAttribute('data-tool');
    activateWorkspace(selectedTool);
  });
});

const activateWorkspace = (toolKey) => {
  activeToolTitle.textContent = toolNames[toolKey] || 'Tool Panel Active';
  
  if (['palette', 'lorem'].includes(toolKey)) {
    generateBtn.textContent = "Roll / Rerender New Random Variables";
  } else if (['thumbnail'].includes(toolKey)) {
    generateBtn.textContent = "Download Custom YouTube Thumbnail (.jpg)";
  } else if (['contrast', 'img2base64', 'svgpreview', 'uppercase', 'lowercase', 'base64encode', 'base64decode', 'jsonformat', 'regex', 'diff'].includes(toolKey)) {
    generateBtn.textContent = "Apply Transformation Engine Operation";
  } else if (toolKey === 'markdown') {
    generateBtn.textContent = "Refresh Render Node View Processing";
  } else {
    generateBtn.textContent = "Generate & Download Safe Protected File Asset";
  }

  // Clear visibility loops overrides
  [previewContainer, svgPreviewDisplayWindow, thumbnailPreviewDisplayWindow, paletteFieldsContainer, contrastFieldsContainer, thumbnailFieldsContainer, imageUploadFieldsContainer, regexFieldsContainer, diffFieldsContainer, diffResultsContainer].forEach(node => node.classList.add('hidden'));
  contentInput.classList.remove('hidden');
  codeHighlightView.classList.add('hidden');

  if (toolKey === 'markdown') {
    previewContainer.classList.remove('hidden');
    renderMarkdownLive();
  } else if (toolKey === 'thumbnail') {
    thumbnailFieldsContainer.classList.remove('hidden');
    thumbnailPreviewDisplayWindow.classList.remove('hidden');
    drawThumbnailCanvas();
  } else if (toolKey === 'palette') {
    paletteFieldsContainer.classList.remove('hidden');
    generateColorPaletteEngine();
  } else if (toolKey === 'contrast') {
    contrastFieldsContainer.classList.remove('hidden');
    calculateContrastComplianceRatio();
  } else if (toolKey === 'img2base64') {
    imageUploadFieldsContainer.classList.remove('hidden');
  } else if (toolKey === 'svgpreview') {
    svgPreviewDisplayWindow.classList.remove('hidden');
    renderVectorSvgLiveView();
  } else if (toolKey === 'regex') {
    regexFieldsContainer.classList.remove('hidden');
  } else if (toolKey === 'diff') {
    diffFieldsContainer.classList.remove('hidden');
    diffResultsContainer.classList.remove('hidden');
  } else if (toolKey === 'jsonformat') {
    codeHighlightView.classList.remove('hidden');
    applyClientSideSyntaxHighlighting();
  }

  mainDashboardView.classList.add('hidden');
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
    mainDashboardView.classList.remove('hidden');
    clearUISession();
    stopVoiceRecognitionRecording();
  }, 250);
};

backToDashboardBtn.addEventListener('click', routeBackToDashboard);
brandHome.addEventListener('click', () => {
  workspaceSection.classList.add('hidden');
  mainDashboardView.classList.add('hidden');
  welcomeDashboard.classList.remove('hidden', 'opacity-0', 'scale-95');
});

// --- METRICS GENERATOR & REALTIME WATCHERS ---
const updateMetrics = () => {
  const text = contentInput.value;
  charCountText.textContent = text.length;
  wordCountText.textContent = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  lineCountText.textContent = text === '' ? 0 : text.split('\n').length;

  if (selectedTool === 'markdown') renderMarkdownLive();
  else if (selectedTool === 'jsonformat') applyClientSideSyntaxHighlighting();
  else if (selectedTool === 'regex') evaluateRegexPatternsLive();
  else if (selectedTool === 'diff') executeClientTextDiffProcessing();
  else if (selectedTool === 'svgpreview') renderVectorSvgLiveView();
  else if (selectedTool === 'thumbnail') drawThumbnailCanvas();
};

contentInput.addEventListener('input', updateMetrics);
thumbTextInput.addEventListener('input', drawThumbnailCanvas);

// --- THUMBNAIL STUDIO LOGIC ---
let currentThumbImage = null;
triggerThumbBgBtn.addEventListener('click', () => thumbBgUpload.click());

thumbBgUpload.addEventListener('change', (e) => {
  const asset = e.target.files[0];
  if(!asset) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      currentThumbImage = img;
      drawThumbnailCanvas();
      triggerSuccessNotification("Thumbnail background image applied.");
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(asset);
});

function drawThumbnailCanvas() {
  const ctx = thumbCanvas.getContext('2d');
  ctx.clearRect(0, 0, 1280, 720);
  
  if (currentThumbImage) {
    ctx.drawImage(currentThumbImage, 0, 0, 1280, 720);
  } else {
    // Default gradient background
    const grad = ctx.createLinearGradient(0, 0, 1280, 720);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(1, '#311042');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);
  }

  // Draw overlay title text
  const customText = thumbTextInput.value || contentInput.value || "YouTube Thumbnail Title";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 72px 'Orbitron', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Text shadow for pop effect
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 20;
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#000000";
  ctx.strokeText(customText, 640, 360, 1150);
  ctx.fillText(customText, 640, 360, 1150);
  ctx.shadowBlur = 0; // reset
}

// --- DESIGN SUITE MODULE FUNCTIONAL LOGIC ---
const generateColorPaletteEngine = () => {
  paletteFieldsContainer.innerHTML = '';
  let collectedHexText = '';
  for(let i=0; i<5; i++) {
    const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    collectedHexText += `Color ${i+1}: ${randomHex}\n`;
    
    const nodeBox = document.createElement('div');
    nodeBox.className = "h-16 rounded-xl flex items-end justify-center pb-1 text-[9px] font-mono font-bold text-black border border-white/10 shadow-lg cursor-pointer transition transform hover:scale-105";
    nodeBox.style.backgroundColor = randomHex;
    nodeBox.innerText = randomHex.toUpperCase();
    nodeBox.addEventListener('click', () => {
      navigator.clipboard.writeText(randomHex);
      triggerSuccessNotification(`Copied color hex node ${randomHex} to clipboard.`);
    });
    paletteFieldsContainer.appendChild(nodeBox);
  }
  contentInput.value = collectedHexText;
  updateMetrics();
};

const calculateContrastComplianceRatio = () => {
  const textHex = contrastTextColor.value.trim();
  const bgHex = contrastBgColor.value.trim();
  contrastLiveCard.style.color = textHex;
  contrastLiveCard.style.backgroundColor = bgHex;
  
  const parseHexToRgb = (hex) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return clean.length === 3 ? { r: ((num >> 8) & 0xf) * 17, g: ((num >> 4) & 0xf) * 17, b: (num & 0xf) * 17 } : { r: (num >> 16) & 0xff, g: (num >> 8) & 0xff, b: num & 0xff };
  };

  try {
    const rgbText = parseHexToRgb(textHex);
    const rgbBg = parseHexToRgb(bgHex);
    const getLuminance = (rgb) => {
      const a = [rgb.r, rgb.g, rgb.b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };
    const l1 = getLuminance(rgbText) + 0.05;
    const l2 = getLuminance(rgbBg) + 0.05;
    const ratio = Math.max(l1, l2) / Math.min(l1, l2);
    let passLabel = ratio >= 4.5 ? "PASS (WCAG AA Normal Text)" : "FAIL (Low Accessibility Thresholds)";
    
    contentInput.value = `Contrast Ratio Result Analyzer:\n--------------------------\nForeground: ${textHex}\nBackground: ${bgHex}\nCalculated Ratio: ${ratio.toFixed(2)}:1\nEvaluation Grade: ${passLabel}`;
    updateMetrics();
  } catch(e) {}
};

[contrastTextColor, contrastBgColor].forEach(input => input.addEventListener('input', calculateContrastComplianceRatio));

triggerImageSelectBtn.addEventListener('click', () => designImageFileSelector.click());
designImageFileSelector.addEventListener('change', (e) => {
  const targetAsset = e.target.files[0];
  if(!targetAsset) return;
  imagePreviewFeedbackName.textContent = `${targetAsset.name} (${(targetAsset.size/1024).toFixed(1)} KB)`;
  const imgReader = new FileReader();
  imgReader.onload = (event) => {
    contentInput.value = event.target.result;
    updateMetrics();
    triggerSuccessNotification("Image layer encoded clean into raw Base64 string stream.");
  };
  imgReader.readAsDataURL(targetAsset);
});

const renderVectorSvgLiveView = () => {
  const sourceCode = contentInput.value.trim();
  if(!sourceCode.includes('<svg')) {
    svgPreviewDisplayWindow.innerHTML = '<span class="text-gray-600 italic text-xs">Awaiting standard clean vector input XML code markup...</span>';
    return;
  }
  svgPreviewDisplayWindow.innerHTML = sourceCode;
};

const generateLoremDummyParagraphs = () => {
  const wordsSample = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua"];
  let paragraph = "";
  for(let i=0; i<50; i++) {
    paragraph += wordsSample[Math.floor(Math.random()*wordsSample.length)] + " ";
  }
  contentInput.value = paragraph.charAt(0).toUpperCase() + paragraph.slice(1).trim() + ".";
  updateMetrics();
};

// --- CORE UTILITIES RUNTIME INVOKER ---
const handleProcessInvocation = () => {
  const rawInput = contentInput.value;
  if (!rawInput.trim() && !['palette', 'lorem', 'thumbnail'].includes(selectedTool)) {
    alert('Please insert string data input workspace space area first.');
    return;
  }

  generateBtn.disabled = true;
  generateBtn.classList.add('opacity-40', 'cursor-not-allowed');
  progressContainer.classList.remove('opacity-0', 'pointer-events-none');
  progressContainer.classList.add('opacity-100');
  
  progressBar.style.width = '0%';
  statusText.textContent = 'Analyzing System Stream: 0%';
  startTime = performance.now();

  const animationStepDuration = 600;
  const animateTick = (timestamp) => {
    const elapsed = timestamp - startTime;
    const progressRatio = Math.min(elapsed / animationStepDuration, 1);

    progressBar.style.width = `${(progressRatio * 100).toFixed(2)}%`;
    statusText.textContent = `Processing Operation: ${(progressRatio * 100).toFixed(0)}%`;
    timeElapsedText.textContent = `Time Elapsed: ${(elapsed / 1000).toFixed(2)}s`;

    if (progressRatio < 1) {
      animationFrameId = requestAnimationFrame(animateTick);
    } else {
      executeTransformationEngine(rawInput, selectedTool);
    }
  };
  animationFrameId = requestAnimationFrame(animateTick);
};

const executeTransformationEngine = (input, operation) => {
  const stampId = `UxPro_${Date.now()}`;
  if(input.trim()) saveOperationToLocalHistory(operation, input);

  try {
    switch (operation) {
      case 'txt': triggerBlobDownload(new Blob([input], { type: 'text/plain;charset=utf-8' }), `${stampId}.txt`); break;
      case 'zip': case 'rar': archiveZipEngine(input, `${stampId}.${operation}`); break;
      case 'pdf': renderPdfEngine(input, `${stampId}.pdf`); break;
      case 'docx': renderDocxEngine(input, `${stampId}.docx`); break;
      case 'thumbnail': 
        drawThumbnailCanvas();
        thumbCanvas.toBlob(blob => triggerBlobDownload(blob, `${stampId}_thumbnail.jpg`), 'image/jpeg', 0.95);
        triggerSuccessNotification("YouTube Thumbnail rendered and downloaded.");
        break;
      case 'palette': generateColorPaletteEngine(); triggerSuccessNotification("Rerolled random design color maps."); break;
      case 'contrast': calculateContrastComplianceRatio(); triggerSuccessNotification("Contrast compliance analysis log refreshed."); break;
      case 'svgpreview': renderVectorSvgLiveView(); triggerSuccessNotification("Vector validation tree structural map re-rendered."); break;
      case 'lorem': generateLoremDummyParagraphs(); triggerSuccessNotification("Generated design placeholder dummy words."); break;
      case 'uppercase': contentInput.value = input.toUpperCase(); triggerSuccessNotification("Transformed elements to UPPERCASE."); break;
      case 'lowercase': contentInput.value = input.toLowerCase(); triggerSuccessNotification("Transformed elements to lowercase."); break;
      case 'base64encode': contentInput.value = btoa(unescape(encodeURIComponent(input))); triggerSuccessNotification("Encoded input text safely into Base64 format."); break;
      case 'base64decode': contentInput.value = decodeURIComponent(escape(atob(input.trim()))); triggerSuccessNotification("Decoded Base64 sequence parameters successfully."); break;
      case 'jsonformat': contentInput.value = JSON.stringify(JSON.parse(input), null, 2); applyClientSideSyntaxHighlighting(); triggerSuccessNotification("Formatted JSON parameters correctly."); break;
    }
    progressBar.style.width = '100%';
    statusText.textContent = 'Complete: 100%';
    setTimeout(() => clearUISession(), 1000);
  } catch (e) {
    alert('Processing execution validation failure error.');
    clearUISession();
  }
};

// --- DRAG DROP & FILE ASSETS UTILS ---
['dragenter', 'dragover'].forEach(eventName => {
  dragDropArea.addEventListener(eventName, (e) => { e.preventDefault(); dragZoneOverlay.classList.remove('hidden'); }, false);
});
['dragleave', 'drop'].forEach(eventName => {
  dragDropArea.addEventListener(eventName, (e) => { e.preventDefault(); dragZoneOverlay.classList.add('hidden'); }, false);
});
dragDropArea.addEventListener('drop', (e) => {
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const reader = new FileReader();
    reader.onload = (event) => { contentInput.value = event.target.result; updateMetrics(); };
    reader.readAsText(files[0]);
  }
});

const triggerBlobDownload = (blobData, filename) => {
  const downloadLink = URL.createObjectURL(blobData);
  const anchorNode = document.createElement('a');
  anchorNode.href = downloadLink;
  anchorNode.download = filename;
  document.body.appendChild(anchorNode);
  anchorNode.click();
  setTimeout(() => { URL.revokeObjectURL(downloadLink); anchorNode.remove(); }, 100);
};

const archiveZipEngine = (textString, name) => {
  const zipPacker = new JSZip();
  zipPacker.file("UxPro_Content_Source.txt", textString);
  zipPacker.generateAsync({ type: 'blob' }).then(blob => triggerBlobDownload(blob, name));
};

const renderPdfEngine = (textString, name) => {
  const el = document.createElement('div');
  el.setAttribute('style', 'color:#111827; padding:30px; font-family:monospace; white-space:pre-wrap;');
  el.innerText = textString;
  window.html2pdf().set({ margin: 0.5, filename: name, jsPDF: { format: 'letter', orientation: 'portrait' } }).from(el).save();
};

const renderDocxEngine = (textString, name) => {
  const { Document, Packer, Paragraph, TextRun } = window.docx;
  const doc = new Document({ sections: [{ children: [new Paragraph({ children: [new TextRun({ text: textString, font: "Arial", size: 24 })] })] }] });
  Packer.toBlob(doc).then(blob => triggerBlobDownload(blob, name));
};

// --- DYNAMIC LOGS AND HELPERS ---
const applyClientSideSyntaxHighlighting = () => {
  const textVal = contentInput.value;
  let tokens = textVal.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")/g, '<span class="token-string">$1</span>')
    .replace(/\b(true|false|null)\b/g, '<span class="token-keyword">$1</span>')
    .replace(/\b([0-9]+)\b/g, '<span class="token-number">$1</span>');
  codeHighlightView.innerHTML = tokens || '<span class="text-gray-600 italic">Formatted JSON view screen empty...</span>';
};

const evaluateRegexPatternsLive = () => {
  const textVal = contentInput.value;
  const matchPatternStr = regexPatternInput.value.trim();
  if(!matchPatternStr || !textVal) { regexStatusFeedback.textContent = "Matches Found: 0"; return; }
  try {
    const flags = matchPatternStr.match(/\/([gimy]*)$/)?.[1] || 'g';
    const body = matchPatternStr.replace(/^\/|\/[gimy]*$/g, '');
    const matchedArrays = textVal.match(new RegExp(body, flags));
    regexStatusFeedback.textContent = `Matches Found: ${matchedArrays ? matchedArrays.length : 0}`;
  } catch(e) {}
};

const executeClientTextDiffProcessing = () => {
  const src = contentInput.value.split('\n');
  const tgt = diffSecondaryInput.value.split('\n');
  let html = '';
  for(let i = 0; i < Math.max(src.length, tgt.length); i++) {
    if (src[i] === tgt[i]) html += src[i] !== undefined ? `Line ${i + 1}: ${src[i]}\n` : '';
    else {
      if(src[i] !== undefined) html += `<span class="diff-removed">Line ${i + 1} [-]: ${src[i]}</span>\n`;
      if(tgt[i] !== undefined) html += `<span class="diff-added">Line ${i + 1} [+]: ${tgt[i]}</span>\n`;
    }
  }
  diffVisualizerBox.innerHTML = html || '<span class="text-gray-600 italic">No alterations...</span>';
};

// --- SPEECH VOICE DICTATION MODULE ---
const startVoiceRecognitionRecording = () => {
  const SpeechEngineClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechEngineClass) { alert("Audio processing APIs not supported inside browser layer."); return; }
  speechRecognitionEngine = new SpeechEngineClass();
  speechRecognitionEngine.continuous = true;
  speechRecognitionEngine.lang = 'en-US';
  speechRecognitionEngine.onresult = (e) => { contentInput.value += (contentInput.value ? ' ' : '') + e.results[e.results.length - 1][0].transcript; updateMetrics(); };
  speechRecognitionEngine.onend = () => stopVoiceRecognitionRecording();
  
  speechRecognitionEngine.start();
  isVoiceRecordingActive = true;
  speechIconDot.classList.remove('hidden');
  speechTextLabel.textContent = "Listening Live...";
};
const stopVoiceRecognitionRecording = () => {
  if (speechRecognitionEngine && isVoiceRecordingActive) speechRecognitionEngine.stop();
  isVoiceRecordingActive = false;
  speechIconDot.classList.add('hidden');
  speechTextLabel.textContent = "Dictate Speech (Audio)";
};
speechRecordBtn.addEventListener('click', () => isVoiceRecordingActive ? stopVoiceRecognitionRecording() : startVoiceRecognitionRecording());

const saveOperationToLocalHistory = (toolKey, previewStr) => {
  let entries = []; try { entries = JSON.parse(localStorage.getItem('uxpro_logs_v5')) || []; } catch(e) {}
  entries.unshift({ id: Date.now(), tool: toolKey, timestamp: new Date().toLocaleTimeString(), snippet: previewStr.substring(0, 50) + '...', payload: previewStr });
  localStorage.setItem('uxpro_logs_v5', JSON.stringify(entries.slice(0, 10)));
};

const refreshHistoryLogListDisplay = () => {
  historyContainerList.innerHTML = '';
  let logs = []; try { logs = JSON.parse(localStorage.getItem('uxpro_logs_v5')) || []; } catch(e) {}
  if(logs.length === 0) { historyContainerList.innerHTML = '<span class="text-gray-500 text-sm italic p-4 text-center">No cached history found...</span>'; return; }
  logs.forEach(log => {
    const el = document.createElement('div');
    el.className = "bg-white/5 border border-white/10 p-3 rounded-xl flex justify-between items-center hover:bg-white/10 transition cursor-pointer text-xs";
    el.innerHTML = `<div><span class="font-bold text-purple-400 font-['Orbitron']">${log.tool.toUpperCase()}</span> <span class="text-gray-500">[${log.timestamp}]</span><p class="text-gray-400 font-mono mt-1">${log.snippet}</p></div><button class="bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30">Restore</button>`;
    el.querySelector('button').addEventListener('click', () => { contentInput.value = log.payload; activateWorkspace(log.tool); updateMetrics(); });
    historyContainerList.appendChild(el);
  });
};

clearHistoryBtn.addEventListener('click', () => { localStorage.removeItem('uxpro_logs_v5'); refreshHistoryLogListDisplay(); });

// --- NOTIFICATIONS & UI CLEAR UTILS ---
const triggerSuccessNotification = (text) => {
  successDetail.textContent = text;
  successOverlay.classList.remove('opacity-0', 'pointer-events-none');
  successOverlay.classList.add('opacity-100'); successCard.classList.replace('scale-95', 'scale-100');
  setTimeout(() => { successOverlay.classList.replace('opacity-100', 'opacity-0'); successOverlay.classList.add('pointer-events-none'); successCard.classList.replace('scale-100', 'scale-95'); }, 1800);
};

const clearUISession = () => {
  generateBtn.disabled = false; generateBtn.classList.remove('opacity-40', 'cursor-not-allowed');
  progressContainer.classList.replace('opacity-100', 'opacity-0'); progressContainer.classList.add('pointer-events-none');
  if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
};

clearInputBtn.addEventListener('click', () => { contentInput.value = ''; diffSecondaryInput.value = ''; regexPatternInput.value = ''; thumbTextInput.value = ''; updateMetrics(); });
generateBtn.addEventListener('click', handleProcessInvocation);
