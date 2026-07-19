// script.js

// Cache DOM elements
const toolListItems = document.querySelectorAll('.nav li, .tool-card');
const sections = document.querySelectorAll('.section');
const searchInput = document.getElementById('toolSearch');

// Utility: Show specific section
function showSection(id) {
  sections.forEach(sec => {
    if (sec.id === id) {
      sec.classList.add('active');
    } else {
      sec.classList.remove('active');
    }
  });
  // Update active link
  document.querySelectorAll('.nav li').forEach(li => {
    if (li.dataset.tool === id) {
      li.classList.add('active');
    } else {
      li.classList.remove('active');
    }
  });
}

// Handle sidebar navigation clicks
document.querySelectorAll('.nav li, .tool-card').forEach(item => {
  item.addEventListener('click', () => {
    const tool = item.dataset.tool || item.parentElement.dataset.tool;
    showSection(tool);
  });
});

// Handle search filtering
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  document.querySelectorAll('.nav li').forEach(li => {
    if (li.textContent.toLowerCase().includes(query)) {
      li.style.display = '';
    } else {
      li.style.display = 'none';
    }
  });
  // Optional: filter cards in dashboard
  document.querySelectorAll('.tool-card').forEach(card => {
    if (card.querySelector('h3').textContent.toLowerCase().includes(query)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
});

// --- Tool Implementations ---

// 1. Color Palette Generator
const paletteContainer = document.getElementById('paletteContainer');
const generatePaletteBtn = document.getElementById('generatePalette');
let lockedColors = [];

function generateColors() {
  const colors = [];
  for (let i = 0; i < 5; i++) {
    if (lockedColors.includes(i)) {
      colors.push(paletteContainer.children[i]?.dataset.color);
    } else {
      colors.push(`#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`);
    }
  }
  updatePalette(colors);
}

function updatePalette(colors) {
  paletteContainer.innerHTML = '';
  colors.forEach((color, index) => {
    const colorDiv = document.createElement('div');
    colorDiv.className = 'palette-color';
    colorDiv.dataset.color = color;
    colorDiv.style.backgroundColor = color;
    colorDiv.title = color;
    colorDiv.addEventListener('click', () => {
      navigator.clipboard.writeText(color);
    });
    colorDiv.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      // Toggle lock
      if (lockedColors.includes(index)) {
        lockedColors = lockedColors.filter(i => i !== index);
        colorDiv.style.border = 'none';
      } else {
        lockedColors.push(index);
        colorDiv.style.border = '3px solid var(--primary-color)';
      }
    });
    paletteContainer.appendChild(colorDiv);
  });
}

generatePaletteBtn.addEventListener('click', () => {
  generateColors();
});

// Initialize palette on load
generateColors();

// 2. Color Converter
const hexInput = document.getElementById('hexInput');
const rgbInput = document.getElementById('rgbInput');
const hslInput = document.getElementById('hslInput');
const colorPreview = document.getElementById('colorPreview');

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max + min) / 2;

  if(max === min){
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2*l - 1)) * s;
  const x = c * (1 - Math.abs((h/60) % 2 - 1));
  const m = l - c/2;
  let r=0, g=0, b=0;

  if(h >= 0 && h < 60){ r=c; g=x; b=0; }
  else if(h >=60 && h < 120){ r=x; g=c; b=0; }
  else if(h >=120 && h < 180){ r=0; g=c; b=x; }
  else if(h >=180 && h < 240){ r=0; g=x; b=c; }
  else if(h >=240 && h < 300){ r=x; g=0; b=c; }
  else { r=c; g=0; b=x; }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return { r, g, b };
}

hexInput.addEventListener('input', () => {
  const hex = hexInput.value;
  if(/^#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/.test(hex)){
    const rgb = hexToRgb(hex);
    rgbInput.value = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    colorPreview.style.backgroundColor = hex.startsWith('#') ? hex : `#${hex}`;
  }
});

rgbInput.addEventListener('input', () => {
  const match = rgbInput.value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if(match){
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const hex = rgbToHex(r,g,b);
    hexInput.value = hex;
    const hsl = rgbToHsl(r,g,b);
    hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    colorPreview.style.backgroundColor = hex;
  }
});

hslInput.addEventListener('input', () => {
  const match = hslInput.value.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if(match){
    const h = parseInt(match[1]);
    const s = parseInt(match[2]);
    const l = parseInt(match[3]);
    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    hexInput.value = hex;
    rgbInput.value = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    colorPreview.style.backgroundColor = hex;
  }
});

// 3. WCAG Contrast Checker
const fgColorInput = document.getElementById('fgColor');
const bgColorInput = document.getElementById('bgColor');
const ratioSpan = document.getElementById('ratio');
const ratingSpan = document.getElementById('rating');

function luminance(r, g, b) {
  const a = [r,g,b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
  });
  return 0.2126*a[0] + 0.7152*a[1] + 0.0722*a[2];
}

function getContrast(rgb1, rgb2) {
  const L1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const L2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

function getRGBFromHex(hex) {
  const {r,g,b} = hexToRgb(hex);
  return {r,g,b};
}

function updateContrast() {
  const fgHex = fgColorInput.value;
  const bgHex = bgColorInput.value;
  const rgbFg = getRGBFromHex(fgHex);
  const rgbBg = getRGBFromHex(bgHex);
  const ratio = getContrast(rgbFg, rgbBg).toFixed(2);
  ratioSpan.textContent = ratio;
  let rating = '';
  const ratioNum = parseFloat(ratio);
  if (ratioNum >= 4.5) rating = 'AA';
  if (ratioNum >= 7) rating += 'AAA';
  if (!rating) rating = 'Fail';
  ratingSpan.textContent = rating;
}

// Event listeners for contrast inputs
fgColorInput.addEventListener('input', updateContrast);
bgColorInput.addEventListener('input', updateContrast);
updateContrast();

// 4. Aspect Ratio Calculator
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const ratioButtons = document.querySelectorAll('.presets button');
const aspectResult = document.getElementById('aspectResult');

function calculateDimensions() {
  const width = parseInt(widthInput.value);
  const height = parseInt(heightInput.value);
  if (width && height) {
    aspectResult.textContent = `Width: ${width}px, Height: ${height}px`;
  }
}

widthInput.addEventListener('input', calculateDimensions);
heightInput.addEventListener('input', calculateDimensions);

ratioButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const ratio = btn.dataset.ratio;
    const [w, h] = ratio.split(':').map(Number);
    widthInput.value = 100; // default width
    heightInput.value = Math.round(100 * h / w);
    calculateDimensions();
  });
});

// 5. Typography Previewer
const typedTextInput = document.getElementById('typedText');
const fontPreview = document.getElementById('fontPreview');

typedTextInput.addEventListener('input', () => {
  fontPreview.textContent = typedTextInput.value;
});

// 6. Image Resizer & Cropper
const imageInput = document.getElementById('imageInput');
const imageCanvas = document.getElementById('imageCanvas');
const resizeWidthInput = document.getElementById('resizeWidth');
const resizeHeightInput = document.getElementById('resizeHeight');
const resizeBtn = document.getElementById('resizeBtn');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = new Image();

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    originalImage.src = e.target.result;
    originalImage.onload = () => {
      drawImageToCanvas(originalImage);
    };
  };
  reader.readAsDataURL(file);
});

function drawImageToCanvas(img) {
  const ctx = imageCanvas.getContext('2d');
  ctx.clearRect(0,0,imageCanvas.width,imageCanvas.height);
  imageCanvas.width = img.width;
  imageCanvas.height = img.height;
  ctx.drawImage(img, 0, 0);
}

resizeBtn.addEventListener('click', () => {
  const newW = parseInt(resizeWidthInput.value);
  const newH = parseInt(resizeHeightInput.value);
  if (newW && newH && originalImage.src) {
    // Resize image using canvas
    const ctx = imageCanvas.getContext('2d');
    imageCanvas.width = newW;
    imageCanvas.height = newH;
    ctx.drawImage(originalImage, 0, 0, newW, newH);
  }
});

downloadBtn.addEventListener('click', () => {
  const dataURL = imageCanvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'resized-image.png';
  a.click();
});

// script.js එකේ යටින්ම මේක පේස්ට් කරන්න

document.getElementById('overview-card').addEventListener('click', function() {
    // 1. හැම section එකකින්ම 'active' class එක අයින් කරනවා
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    
    // 2. Tools section එක විතරක් active කරනවා (මෙහි 'tools' යනු ඔයාගේ tools section එකේ id එකයි)
    document.getElementById('tools').classList.add('active');
    
    // 3. Sidebar එකේ තියෙන menu active එකත් මාරු කරන්න (Sidebar එකේ tools button එකේ class එක active කරයි)
    document.querySelectorAll('.nav li').forEach(li => li.classList.remove('active'));
    document.querySelector('[data-section="tools"]').classList.add('active');
});

// End of script
