"use strict";

// DOM Elements
const contentInput = document.getElementById('contentInput');
const formatSelect = document.getElementById('formatSelect');
const generateBtn = document.getElementById('generateBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const statusText = document.getElementById('statusText');
const timeElapsedText = document.getElementById('timeElapsed');
const successOverlay = document.getElementById('successMessage');

let animationFrameId = null;
let startTime = null;
let progress = 0;

// Utility functions
const formatTime = (seconds, milliseconds) => `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;

const showProgress = () => {
  progressContainer.classList.remove('opacity-0');
  progressContainer.classList.add('opacity-100');
};
const hideProgress = () => {
  progressContainer.classList.remove('opacity-100');
  progressContainer.classList.add('opacity-0');
};
const showSuccess = () => {
  successOverlay.classList.add('opacity-100');
  successOverlay.classList.remove('opacity-0');
  // Animate success
  setTimeout(() => {
    successOverlay.classList.remove('opacity-100');
  }, 1500);
};

// Start generation process
const startGeneration = () => {
  const content = contentInput.value.trim();
  const format = formatSelect.value;

  if (!content) {
    alert('Please enter some content before generating.');
    return;
  }

  // Disable button
  generateBtn.disabled = true;
  generateBtn.classList.add('opacity-50', 'cursor-not-allowed');

  // Show progress
  showProgress();

  // Reset progress
  progress = 0;
  updateProgress(0);
  startTime = performance.now();

  // Animate progress (simulate realistic process)
  const duration = 3000; // 3 sec for demo, can be dynamic
  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    progress = Math.min(elapsed / duration, 1);
    updateProgress(progress * 100);
    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      finalizeDownload(content, format);
    }
  };
  animationFrameId = requestAnimationFrame(animate);
};

// Update progress UI
const updateProgress = (percent) => {
  progressBar.style.width = `${percent}%`;
  statusText.textContent = `Processing: ${Math.round(percent)}%`;
  const now = performance.now();
  const seconds = Math.floor((now - startTime) / 1000);
  const milliseconds = Math.floor(((now - startTime) % 1000) / 10);
  timeElapsedText.textContent = `Time Elapsed: ${formatTime(seconds, milliseconds)}`;
};

// Finalize download
const finalizeDownload = (content, format) => {
  const filenameBase = `UxPro_document_${new Date().getFullYear()}`;
  switch (format) {
    case 'txt':
      downloadBlob(new Blob([content], { type: 'text/plain' }), `${filenameBase}.txt`);
      break;
    case 'zip':
      generateZip(content, filenameBase);
      break;
    case 'rar':
      alert('RAR not supported, generating ZIP instead.');
      generateZip(content, filenameBase);
      break;
    case 'pdf':
      generatePdf(content, `${filenameBase}.pdf`);
      break;
    case 'docx':
      generateDocx(content, `${filenameBase}.docx`);
      break;
    default:
      alert('Unknown format');
      resetUI();
      return;
  }
  // Animate progress to full
  progressBar.style.width = '100%';
  statusText.textContent = `Processing: 100%`;
  showSuccess();
  setTimeout(() => resetUI(), 1500);
};

// Helper functions
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
};

const generateZip = (content, filenameBase) => {
  const zip = new JSZip();
  zip.file('content.txt', content);
  zip.generateAsync({ type: 'blob' }).then(blob => {
    downloadBlob(blob, `${filenameBase}.zip`);
  });
};

const generatePdf = (content, filename) => {
  const div = document.createElement('div');
  div.innerHTML = `<pre class="text-white font-mono">${content}</pre>`;
  document.body.appendChild(div);
  html2pdf().set({ filename }).from(div).save().then(() => div.remove());
};

const generateDocx = (content, filename) => {
  const { Document, Packer, Paragraph, TextRun } = window.docx;
  const doc = new Document({ sections: [{ children: [new Paragraph({ children: [new TextRun(content)] })] }] });
  Packer.toBlob(doc).then(blob => downloadBlob(blob, filename));
};

const resetUI = () => {
  generateBtn.disabled = false;
  generateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  hideProgress();
  progressBar.style.width = '0%';
  statusText.textContent = `Processing: 0%`;
  timeElapsedText.textContent = `Time Elapsed: 0.00s`;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

// Event listener
generateBtn.addEventListener('click', startGeneration);
