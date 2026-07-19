"use strict";

// State Management Configurations
let selectedTool = 'txt';
let animationFrameId = null;
let startTime = null;

// Speech Dictation recognition placeholder container instance holder
let speechRecognitionEngine = null;
let isVoiceRecordingActive = false;

// DOM View Containers Mapping
const welcomeDashboard = document.getElementById('welcomeDashboard');
const workspaceSection = document.getElementById('workspaceSection');
const activeToolTitle = document.getElementById('activeToolTitle');
const previewContainer = document.getElementById('previewContainer');
const markdownPreview = document.getElementById('markdownPreview');

// Operational Navigation Actions Elements Tabs
const tabFiles = document.getElementById('tabFiles');
const tabUtils = document.getElementById('tabUtils');
const tabHistory = document.getElementById('tabHistory');
const gridFiles = document.getElementById('gridFiles');
const gridUtils = document.getElementById('gridUtils');
const historyView = document.getElementById('historyView');
const historyContainerList = document.getElementById('historyContainerList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

const backToDashboardBtn = document.getElementById('backToDashboardBtn');
const brandHome = document.getElementById('brandHome');

// Core Inputs Processing Elements Panels structures
const dragDropArea = document.getElementById('dragDropArea');
const dragZoneOverlay = document.getElementById('dragZoneOverlay');
const contentInput = document.getElementById('contentInput');
const codeHighlightView = document.getElementById('codeHighlightView');
const clearInputBtn = document.getElementById('clearInputBtn');
const generateBtn = document.getElementById('generateBtn');
const speechRecordBtn = document.getElementById('speechRecordBtn');
const speechIconDot = document.getElementById('speechIconDot');
const speechTextLabel = document.getElementById('speechTextLabel');

// Dynamic Auxiliary Fields Blocks Panels
const regexFieldsContainer = document.getElementById('regexFieldsContainer');
const regexPatternInput = document.getElementById('regexPatternInput');
const regexStatusFeedback = document.getElementById('regexStatusFeedback');
const diffFieldsContainer = document.getElementById('diffFieldsContainer');
const diffSecondaryInput = document.getElementById('diffSecondaryInput');
const diffResultsContainer = document.getElementById('diffResultsContainer');
const diffVisualizerBox = document.getElementById('diffVisualizerBox');

// Progress tracking feedback nodes
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const statusText = document.getElementById('statusText');
const timeElapsedText = document.getElementById('timeElapsed');

// Notification Elements
const successOverlay = document.getElementById('successMessage');
const successCard = document.getElementById('successCard');
const successDetail = document.getElementById('successDetail');

// Legal Modals DOM Hooks elements mapping nodes
const legalModalOverlay = document.getElementById('legalModalOverlay');
const legalModalTitle = document.getElementById('legalModalTitle');
const legalModalContent = document.getElementById('legalModalContent');
const closeLegalModalBtn = document.getElementById('closeLegalModalBtn');
const openPrivacyBtn = document.getElementById('openPrivacyBtn');
const openTermsBtn = document.getElementById('openTermsBtn');
const openSupportBtn = document.getElementById('openSupportBtn');

// Metrics Counters
const wordCountText = document.getElementById('wordCount');
const charCountText = document.getElementById('charCount');
const lineCountText = document.getElementById('lineCount');

// TOOL NAME DICTIONARY MAP
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
  regex: 'Regular Expression (Regex) Match Tester',
  diff: 'Delta Core Text Difference Comparator',
  uppercase: 'Text Case Transform: UPPERCASE',
  lowercase: 'Text Case Transform: lowercase'
};

// --- MULTI-TAB VIEW CONTROLLER INTERCEPTORS ---
const toggleTabActiveState = (activeTab, visibleGrid) => {
  [tabFiles, tabUtils, tabHistory].forEach(btn => btn.classList.remove('active'));
  [gridFiles, gridUtils, historyView].forEach(view => view.classList.add('hidden'));
  
  activeTab.classList.add('active');
  visibleGrid.classList.remove('hidden');

  if(activeTab === tabHistory) {
    refreshHistoryLogListDisplay();
  }
};

tabFiles.addEventListener('click', () => toggleTabActiveState(tabFiles, gridFiles));
tabUtils.addEventListener('click', () => toggleTabActiveState(tabUtils, gridUtils));
tabHistory.addEventListener('click', () => toggleTabActiveState(tabHistory, historyView));

// Attach Click routing pathways onto individual utility component blocks
document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('click', () => {
    selectedTool = card.getAttribute('data-tool');
    activateWorkspace(selectedTool);
  });
});

const activateWorkspace = (toolKey) => {
  activeToolTitle.textContent = toolNames[toolKey] || 'Tool Panel Active';
  
  // Dynamic button labels setup assignment layout targeting actions
  if (['uppercase', 'lowercase', 'base64encode', 'base64decode', 'jsonformat', 'regex', 'diff'].includes(toolKey)) {
    generateBtn.textContent = "Apply Transformation Engine Operation";
  } else if (toolKey === 'markdown') {
    generateBtn.textContent = "Refresh Render Node View Processing";
  } else {
    generateBtn.textContent = "Generate & Download Safe Protected File Asset";
  }

  // Handle specialized field conditions visualization configurations elements mappings contextually
  previewContainer.classList.add('hidden');
  regexFieldsContainer.classList.add('hidden');
  diffFieldsContainer.classList.add('hidden');
  diffResultsContainer.classList.add('hidden');
  
  // Dynamic text input default configuration visibility alignment reset overrides
  contentInput.classList.remove('hidden');
  codeHighlightView.classList.add('hidden');

  if (toolKey === 'markdown') {
    previewContainer.classList.remove('hidden');
    renderMarkdownLive();
  } else if (toolKey === 'regex') {
    regexFieldsContainer.classList.remove('hidden');
  } else if (toolKey === 'diff') {
    diffFieldsContainer.classList.remove('hidden');
    diffResultsContainer.classList.remove('hidden');
  } else if (toolKey === 'jsonformat') {
    codeHighlightView.classList.remove('hidden');
    applyClientSideSyntaxHighlighting();
  }

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
    stopVoiceRecognitionRecording();
  }, 250);
};

backToDashboardBtn.addEventListener('click', routeBackToDashboard);
brandHome.addEventListener('click', routeBackToDashboard);

// --- DYNAMIC SCANNING DRAG AND DROP INTEGRATION MODULE ---
['dragenter', 'dragover'].forEach(eventName => {
  dragDropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragZoneOverlay.classList.remove('hidden');
  }, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dragDropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragZoneOverlay.classList.add('hidden');
  }, false);
});

dragDropArea.addEventListener('drop', (e) => {
  const customDroppedFiles = e.dataTransfer.files;
  if (customDroppedFiles.length > 0) {
    handleIncomingUploadedFileAsset(customDroppedFiles[0]);
  }
});

const handleIncomingUploadedFileAsset = (fileObject) => {
  const fileReaderNode = new FileReader();
  fileReaderNode.onload = (event) => {
    contentInput.value = event.target.result;
    updateMetrics();
    triggerSuccessNotification(`File asset "${fileObject.name}" imported into system stream.`);
  };
  fileReaderNode.readAsText(fileObject);
};

// --- SPECIFIC LIVE SYNTAX HIGHLIGHTING ENGINE LOGIC ---
const applyClientSideSyntaxHighlighting = () => {
  const textVal = contentInput.value;
  let proceduralTokens = textVal
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")/g, '<span class="token-string">$1</span>')
    .replace(/\b(true|false|null)\b/g, '<span class="token-keyword">$1</span>')
    .replace(/\b([0-9]+)\b/g, '<span class="token-number">$1</span>');
    
  codeHighlightView.innerHTML = proceduralTokens || '<span class="text-gray-600 italic">Formatted tokens mirror buffer empty...</span>';
};

// --- CORE ANALYTICS COUNTERS & MATRIX DIFF CONTROLLERS ---
const updateMetrics = () => {
  const text = contentInput.value;
  charCountText.textContent = text.length;
  
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  wordCountText.textContent = words;

  const lines = text === '' ? 0 : text.split('\n').length;
  lineCountText.textContent = lines;

  if (selectedTool === 'markdown') {
    renderMarkdownLive();
  } else if (selectedTool === 'jsonformat') {
    applyClientSideSyntaxHighlighting();
  } else if (selectedTool === 'regex') {
    evaluateRegexPatternsLive();
  } else if (selectedTool === 'diff') {
    executeClientTextDiffProcessing();
  }
};

contentInput.addEventListener('input', updateMetrics);

const renderMarkdownLive = () => {
  const text = contentInput.value.trim();
  markdownPreview.innerHTML = text === '' ? '<span class="text-gray-500 italic text-sm">Preview window will align contents automatically...</span>' : window.marked.parse(text);
};

const evaluateRegexPatternsLive = () => {
  const textVal = contentInput.value;
  const matchPatternStr = regexPatternInput.value.trim();
  if(!matchPatternStr || !textVal) {
    regexStatusFeedback.textContent = "Matches Found: 0";
    return;
  }
  try {
    const coreFlags = matchPatternStr.match(/\/([gimy]*)$/)?.[1] || 'g';
    const bodyPattern = matchPatternStr.replace(/^\/|\/[gimy]*$/g, '');
    const compiledRegObj = new RegExp(bodyPattern, coreFlags);
    const matchedArrays = textVal.match(compiledRegObj);
    regexStatusFeedback.textContent = `Matches Found: ${matchedArrays ? matchedArrays.length : 0}`;
    regexStatusFeedback.className = "bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-xs font-mono h-9 flex items-center text-green-400";
  } catch(e) {
    regexStatusFeedback.textContent = "Syntax Evaluation Error";
    regexStatusFeedback.className = "bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-xs font-mono h-9 flex items-center text-red-400";
  }
};

const executeClientTextDiffProcessing = () => {
  const lineArraySource = contentInput.value.split('\n');
  const lineArrayTarget = diffSecondaryInput.value.split('\n');
  let compositeDiffOutputHtml = '';

  const maxLinesCountRange = Math.max(lineArraySource.length, lineArrayTarget.length);
  for(let index = 0; index < maxLinesCountRange; index++) {
    const srcLine = lineArraySource[index] || '';
    const tgtLine = lineArrayTarget[index] || '';

    if (srcLine === tgtLine) {
      if(lineArraySource[index] !== undefined) {
        compositeDiffOutputHtml += `Line ${index + 1}: ${srcLine}\n`;
      }
    } else {
      if(lineArraySource[index] !== undefined) {
        compositeDiffOutputHtml += `<span class="diff-removed">Line ${index + 1} [-]: ${srcLine}</span>\n`;
      }
      if(lineArrayTarget[index] !== undefined) {
        compositeDiffOutputHtml += `<span class="diff-added">Line ${index + 1} [+]: ${tgtLine}</span>\n`;
      }
    }
  }
  diffVisualizerBox.innerHTML = compositeDiffOutputHtml || '<span class="text-gray-600 italic">No mutations identified...</span>';
};

diffSecondaryInput.addEventListener('input', executeClientTextDiffProcessing);
regexPatternInput.addEventListener('input', evaluateRegexPatternsLive);

// --- LOCAL SPEECH TO TEXT RECOGNITION DICTATION HOOKS MODULE ---
const initializeSpeechRecognitionSystem = () => {
  const SpeechEngineClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechEngineClass) {
    alert("Audio processing APIs are not supported inside this browser environment.");
    return;
  }
  speechRecognitionEngine = new SpeechEngineClass();
  speechRecognitionEngine.continuous = true;
  speechRecognitionEngine.interimResults = false;
  speechRecognitionEngine.lang = 'en-US';

  speechRecognitionEngine.onresult = (event) => {
    const recordedTranscriptResult = event.results[event.results.length - 1][0].transcript;
    contentInput.value += (contentInput.value ? ' ' : '') + recordedTranscriptResult;
    updateMetrics();
  };

  speechRecognitionEngine.onerror = () => stopVoiceRecognitionRecording();
  speechRecognitionEngine.onend = () => stopVoiceRecognitionRecording();
};

const startVoiceRecognitionRecording = () => {
  if(!speechRecognitionEngine) initializeSpeechRecognitionSystem();
  if(!speechRecognitionEngine) return;

  try {
    speechRecognitionEngine.start();
    isVoiceRecordingActive = true;
    speechIconDot.classList.remove('hidden');
    speechTextLabel.textContent = "Listening Live (Click to Stop)...";
    speechRecordBtn.classList.add('bg-red-500/10', 'border-red-500/30');
  } catch(e) {
    stopVoiceRecognitionRecording();
  }
};

const stopVoiceRecognitionRecording = () => {
  if (speechRecognitionEngine && isVoiceRecordingActive) {
    speechRecognitionEngine.stop();
  }
  isVoiceRecordingActive = false;
  speechIconDot.classList.add('hidden');
  speechTextLabel.textContent = "Dictate Speech (Audio)";
  speechRecordBtn.classList.remove('bg-red-500/10', 'border-red-500/30');
};

speechRecordBtn.addEventListener('click', () => {
  if (isVoiceRecordingActive) {
    stopVoiceRecognitionRecording();
  } else {
    startVoiceRecognitionRecording();
  }
});

// --- OPERATIONAL ACTIONS PIPELINE INVOCATIONS TRIGGER ENGINE ---
const handleProcessInvocation = () => {
  const rawInput = contentInput.value;
  if (!rawInput.trim()) {
    alert('Please insert string data into the input workspace space area first.');
    return;
  }

  generateBtn.disabled = true;
  generateBtn.classList.add('opacity-40', 'cursor-not-allowed');
  progressContainer.classList.remove('opacity-0', 'pointer-events-none');
  progressContainer.classList.add('opacity-100');
  
  progressBar.style.width = '0%';
  statusText.textContent = 'Analyzing System Stream: 0%';
  startTime = performance.now();

  const animationStepDuration = 800;
  const animateTick = (timestamp) => {
    const elapsed = timestamp - startTime;
    const progressRatio = Math.min(elapsed / animationStepDuration, 1);

    progressBar.style.width = `${(progressRatio * 100).toFixed(2)}%`;
    statusText.textContent = `Processing Transaction Block: ${(progressRatio * 100).toFixed(0)}%`;
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
  saveOperationToLocalHistory(operation, input);

  try {
    switch (operation) {
      case 'txt':
        triggerBlobDownload(new Blob([input], { type: 'text/plain;charset=utf-8' }), `${stampId}.txt`);
        triggerSuccessNotification("Target plaintext document download initialized.");
        break;
      case 'zip':
        archiveZipEngine(input, `${stampId}.zip`);
        break;
      case 'rar':
        archiveZipEngine(input, `${stampId}.rar`);
        break;
      case 'pdf':
        renderPdfEngine(input, `${stampId}.pdf`);
        break;
      case 'docx':
        renderDocxEngine(input, `${stampId}.docx`);
        break;
      case 'uppercase':
        contentInput.value = input.toUpperCase();
        triggerSuccessNotification("Transformed variables to UPPERCASE.");
        break;
      case 'lowercase':
        contentInput.value = input.toLowerCase();
        triggerSuccessNotification("Transformed variables to lowercase.");
        break;
      case 'base64encode':
        contentInput.value = btoa(unescape(encodeURIComponent(input)));
        triggerSuccessNotification("Encoded input text safely into Base64 format.");
        break;
      case 'base64decode':
        contentInput.value = decodeURIComponent(escape(atob(input.trim())));
        triggerSuccessNotification("Decoded Base64 sequence parameter logs successfully.");
        break;
      case 'jsonformat':
        contentInput.value = JSON.stringify(JSON.parse(input), null, 2);
        applyClientSideSyntaxHighlighting();
        triggerSuccessNotification("Indented and arranged JSON structural layout parameters correctly.");
        break;
    }
    progressBar.style.width = '100%';
    statusText.textContent = 'Complete: 100%';
    setTimeout(() => clearUISession(), 1000);
  } catch (e) {
    alert('Processing execution validation failure error. Check your structure layout markup syntax syntax configurations.');
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
    triggerSuccessNotification(`${completeFileName.endsWith('.zip') ? 'ZIP' : 'RAR Simulated'} compression package initialized.`);
  });
};

const renderPdfEngine = (textString, pdfFileName) => {
  const structuralContainer = document.createElement('div');
  structuralContainer.setAttribute('style', 'color:#111827; padding:30px; font-family:monospace; white-space:pre-wrap;');
  structuralContainer.innerText = textString;
  window.html2pdf().set({
    margin: 0.5, filename: pdfFileName, jsPDF: { format: 'letter', orientation: 'portrait' }
  }).from(structuralContainer).save();
};

const renderDocxEngine = (textString, wordDocName) => {
  const { Document, Packer, Paragraph, TextRun } = window.docx;
  const docObj = new Document({
    sections: [{ children: [new Paragraph({ children: [new TextRun({ text: textString, font: "Arial", size: 24 })] })] }]
  });
  Packer.toBlob(docObj).then(blobData => triggerBlobDownload(blobData, wordDocName));
};

// --- CLIENT RECENT OPERATION LOCAL STORAGE HISTORY WRAPPERS ---
const saveOperationToLocalHistory = (toolKey, previewDataString) => {
  let entriesArray = [];
  try {
    entriesArray = JSON.parse(localStorage.getItem('uxpro_history_logs_v3')) || [];
  } catch(e) { entriesArray = []; }
  
  const optimizedTruncatedStr = previewDataString.substring(0, 60) + (previewDataString.length > 60 ? '...' : '');
  const entryModel = {
    id: Date.now(),
    tool: toolKey,
    timestamp: new Date().toLocaleTimeString(),
    snippet: optimizedTruncatedStr,
    payload: previewDataString
  };
  entriesArray.unshift(entryModel);
  localStorage.setItem('uxpro_history_logs_v3', JSON.stringify(entriesArray.slice(0, 15)));
};

const refreshHistoryLogListDisplay = () => {
  historyContainerList.innerHTML = '';
  let logsList = [];
  try {
    logsList = JSON.parse(localStorage.getItem('uxpro_history_logs_v3')) || [];
  } catch(e) { logsList = []; }

  if(logsList.length === 0) {
    historyContainerList.innerHTML = '<span class="text-gray-500 text-sm italic p-4 text-center">No operations registered in local logging caches yet...</span>';
    return;
  }

  logsList.forEach(log => {
    const historicalRowItem = document.createElement('div');
    historicalRowItem.className = "bg-white/5 border border-white/10 p-3 rounded-xl flex justify-between items-center hover:bg-white/10 transition-all cursor-pointer";
    historicalRowItem.innerHTML = `
      <div class="flex flex-col gap-0.5">
        <div class="flex items-center gap-2">
          <span class="text-[10px] uppercase font-bold text-purple-400 font-['Orbitron']">${log.tool}</span>
          <span class="text-[9px] text-gray-500">${log.timestamp}</span>
        </div>
        <span class="text-xs text-gray-400 font-mono mt-0.5">${log.snippet}</span>
      </div>
      <button class="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-md hover:bg-purple-500 hover:text-white transition-all">Restore</button>
    `;
    historicalRowItem.querySelector('button').addEventListener('click', (e) => {
      e.stopPropagation();
      contentInput.value = log.payload;
      selectedTool = log.tool;
      activateWorkspace(log.tool);
      updateMetrics();
      triggerSuccessNotification("Workspace historical state checkpoint restored.");
    });
    historyContainerList.appendChild(historicalRowItem);
  });
};

clearHistoryBtn.addEventListener('click', () => {
  localStorage.removeItem('uxpro_history_logs_v3');
  refreshHistoryLogListDisplay();
  triggerSuccessNotification("Purged sandbox session history mapping databases archives.");
});

// --- POPUP MODALS LEGAL DOCUMENTS CONFIGURATION DIALOG SYSTEM ---
const dictionaryLegalDocsContent = {
  privacy: `
    <h4 class="font-bold text-purple-400 mb-1">1. Data Security Isolation</h4>
    <p class="mb-3">UxPro runs purely embedded inside client runtime. No textual elements flow outward across cloud pipelines.</p>
    <h4 class="font-bold text-purple-400 mb-1">2. Local Cache Arrays</h4>
    <p>Session variables use native security protocols exclusively confined to your personal sandboxed browser local space storage parameters logs mapping settings assets.</p>
  `,
  terms: `
    <h4 class="font-bold text-pink-400 mb-1">1. Usage Licensing Scope</h4>
    <p class="mb-3">Tools provided free for developer personal implementations or standard technical configurations production pipelines operations steps.</p>
    <h4 class="font-bold text-pink-400 mb-1">2. Core Warranties Exclusion</h4>
    <p>Platform yields zero system liability variations for code calculations or data changes transpirations inside browser sandboxes.</p>
  `,
  support: `
    <h4 class="font-bold text-blue-400 mb-2">UxPro Live Help Desk Core</h4>
    <p class="mb-2">Need pipeline assistance or want to drop integration requests?</p>
    <div class="bg-black/40 border border-white/10 p-3 rounded-xl mt-2 text-xs font-mono">
      <strong>Dev Channel Email:</strong> support@uxpro-suite.local<br>
      <strong>Ticket Responses:</strong> Under 24 Business Hours Response SLA window.
    </div>
  `
};

const displayTargetModalOverlayContent = (documentKeyType, titleLabelText) => {
  legalModalTitle.textContent = titleLabelText;
  legalModalContent.innerHTML = dictionaryLegalDocsContent[documentKeyType] || '<p>Configuration profiles parameters missing...</p>';
  legalModalOverlay.classList.remove('opacity-0', 'pointer-events-none');
  legalModalOverlay.classList.add('opacity-100');
};

openPrivacyBtn.addEventListener('click', () => displayTargetModalOverlayContent('privacy', 'Data Privacy Policy'));
openTermsBtn.addEventListener('click', () => displayTargetModalOverlayContent('terms', 'Terms Of Use Agreement'));
openSupportBtn.addEventListener('click', () => displayTargetModalOverlayContent('support', 'Live Developer Support Desk'));

const hideTargetModalOverlay = () => {
  legalModalOverlay.classList.remove('opacity-100');
  legalModalOverlay.classList.add('opacity-0', 'pointer-events-none');
};
closeLegalModalBtn.addEventListener('click', hideTargetModalOverlay);
legalModalOverlay.addEventListener('click', (e) => { if(e.target === legalModalOverlay) hideTargetModalOverlay(); });

// --- DEFAULT SYSTEM UTILITIES CONTROLS RESET ACTIONS ---
const triggerSuccessNotification = (textBody) => {
  successDetail.textContent = textBody || "Operation performed cleanly.";
  successOverlay.classList.remove('opacity-0', 'pointer-events-none');
  successOverlay.classList.add('opacity-100');
  successCard.classList.remove('scale-95');
  successCard.classList.add('scale-100');
  setTimeout(() => {
    successOverlay.classList.remove('opacity-100');
    successOverlay.classList.add('opacity-0', 'pointer-events-none');
    successCard.classList.remove('scale-100');
    successCard.classList.add('scale-95');
  }, 1800);
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

clearInputBtn.addEventListener('click', () => {
  contentInput.value = '';
  diffSecondaryInput.value = '';
  regexPatternInput.value = '';
  updateMetrics();
});

// --- ATTACH MAIN PROCESS INVOCATION BINDINGS ---
generateBtn.addEventListener('click', handleProcessInvocation);
