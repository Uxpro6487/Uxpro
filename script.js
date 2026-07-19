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
const successCard = document.getElementById('successCard');

let animationFrameId = null;
let startTime = null;

// Utility to format time (Seconds.Milliseconds)
const formatTime = (seconds, milliseconds) => {
  return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
};

// Show/hide progress and success states
const showProgress = () => {
  progressContainer.classList.remove('opacity-0', 'pointer-events-none');
  progressContainer.classList.add('opacity-100');
};

const hideProgress = () => {
  progressContainer.classList.remove('opacity-100');
  progressContainer.classList.add('opacity-0', 'pointer-events-none');
};

const showSuccess = () => {
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

// Start generation process
const startGeneration = () => {
  const content = contentInput.value.trim();
  const format = formatSelect.value;

  if (!content) {
    alert('Please enter some content inside the text area first!');
    return;
  }

  // Disable button during generation
  generateBtn.disabled = true;
  generateBtn.classList.add('opacity-50', 'cursor-not-allowed');

  showProgress();
  progressBar.style.width = '0%';
  statusText.textContent = 'Processing: 0%';
  timeElapsedText.textContent = 'Time Elapsed: 0.00s';

  startTime = performance.now();
  const duration = 2000; // 2 seconds animation buffer for rendering smoothness

  const animate = (timestamp) => {
    const elapsed = timestamp - startTime;
    const progressPercent = Math.min(elapsed / duration, 1);
    
    // Update loading line & timer
    progressBar.style.width = `${(progressPercent * 100).toFixed(2)}%`;
    statusText.textContent = `Processing: ${(progressPercent * 100).toFixed(0)}%`;
    
    const seconds = Math.floor(elapsed / 1000);
    const ms = Math.floor((elapsed % 1000) / 10);
    timeElapsedText.textContent = `Time Elapsed: ${formatTime(seconds, ms)}`;

    if (progressPercent < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      // Trigger the actual file creation and download
      finalizeDownload(content, format);
    }
  };

  animationFrameId = requestAnimationFrame(animate);
};

// Handle file creation based on type
const finalizeDownload = (content, format) => {
  const filenameBase = `UxPro_${Date.now()}`;
  
  try {
    switch (format) {
      case 'txt':
        downloadBlob(new Blob([content], { type: 'text/plain;charset=utf-8' }), `${filenameBase}.txt`);
        break;
      case 'zip':
        generateZip(content, `${filenameBase}.zip`);
        break;
      case 'rar':
        // Client-side rar simulation using ZIP format safely renamed
        generateZip(content, `${filenameBase}.rar`);
        break;
      case 'pdf':
        generatePdf(content, `${filenameBase}.pdf`);
        break;
      case 'docx':
        generateDocx(content, `${filenameBase}.docx`);
        break;
      default:
        alert('Invalid Format Selected');
        resetUI();
        return;
    }

    // Trigger Success UI State
    progressBar.style.width = '100%';
    statusText.textContent = 'Processing: 100%';
    showSuccess();
    setTimeout(() => resetUI(), 2000);

  } catch (error) {
    console.error(error);
    alert('An error occurred during file generation.');
    resetUI();
  }
};

// Downloader wrapper
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 100);
};

// ZIP Generator logic
const generateZip = (content, filename) => {
  const zip = new JSZip();
  zip.file("UxPro_Content.txt", content);
  zip.generateAsync({ type: 'blob' }).then(blob => {
    downloadBlob(blob, filename);
  });
};

// Fixed PDF Generator logic (Uses proper standard elements to print cleanly)
const generatePdf = (content, filename) => {
  const opt = {
    margin: 1,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  const element = document.createElement('div');
  element.style.color = '#000000'; // Essential: Keep text black for document print layout
  element.style.padding = '20px';
  element.style.fontFamily = 'monospace';
  element.style.whiteSpace = 'pre-wrap';
  element.innerText = content;

  html2pdf().set(opt).from(element).save();
};

// Fixed DOCX Generator logic using window.docx library structure
const generateDocx = (content, filename) => {
  const { Document, Packer, Paragraph, TextRun } = window.docx;
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: content,
              font: "Arial"
            })
          ]
        })
      ]
    }]
  });

  Packer.toBlob(doc).then(blob => {
    downloadBlob(blob, filename);
  });
};

// Reset Form & Actions
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

// Trigger click event
generateBtn.addEventListener('click', startGeneration);
