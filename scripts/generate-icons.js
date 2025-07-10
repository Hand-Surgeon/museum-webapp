// Simple script to create placeholder PWA icons
// In production, replace with actual museum logo

const fs = require('fs');
const path = require('path');

// Create a simple SVG logo
const svgLogo = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#1a1a1a"/>
  <text x="256" y="256" font-family="Arial, sans-serif" font-size="200" fill="white" text-anchor="middle" dominant-baseline="middle">館</text>
</svg>`;

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');

// Save SVG
fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgLogo);

console.log('✅ Logo placeholder created. Replace with actual museum logo for production.');
console.log('📌 You need to convert logo.svg to logo192.png and logo512.png');
console.log('   You can use online tools or image editing software.');