import { ComicStyleId, ComicPanel } from '../types';

/**
 * Generates an SVG Data URI tailored to the panel scene, style, lighting, and camera angle.
 * This guarantees instant, reliable, high-resolution rendering for all comic strips.
 */
export function generateThemedPanelArtwork(
  panel: ComicPanel,
  styleId: ComicStyleId,
  panelIndex: number = 0,
  totalPanels: number = 4
): string {
  const seed = hashString(panel.scenePrompt + panel.title + styleId + panelIndex);
  const width = 800;
  const height = 800;

  const promptLower = (panel.scenePrompt + ' ' + panel.title + ' ' + (panel.visualDetails?.mood || '')).toLowerCase();
  
  // Theme cues detection
  const isNightOrDark = promptLower.includes('night') || promptLower.includes('midnight') || promptLower.includes('dark') || promptLower.includes('space') || promptLower.includes('noir') || promptLower.includes('shadow');
  const isCity = promptLower.includes('city') || promptLower.includes('clock') || promptLower.includes('metropolis') || promptLower.includes('street') || promptLower.includes('tower') || promptLower.includes('alley');
  const isSciFi = promptLower.includes('space') || promptLower.includes('star') || promptLower.includes('alien') || promptLower.includes('ship') || promptLower.includes('laser') || promptLower.includes('cyber') || promptLower.includes('robot');
  const isAction = promptLower.includes('punch') || promptLower.includes('fight') || promptLower.includes('clash') || promptLower.includes('burst') || promptLower.includes('attack') || promptLower.includes('shatter') || promptLower.includes('sword') || promptLower.includes('strike');
  const isNature = promptLower.includes('mountain') || promptLower.includes('temple') || promptLower.includes('forest') || promptLower.includes('cherry') || promptLower.includes('dragon') || promptLower.includes('library');
  const isHumor = promptLower.includes('cat') || promptLower.includes('dog') || promptLower.includes('funny') || promptLower.includes('room') || promptLower.includes('vacuum') || promptLower.includes('couch');

  // Colors based on style & cues
  let bgGradient = '';
  let accentColor = '#f59e0b';
  let secondaryColor = '#ef4444';
  let inkColor = '#0f172a';
  let dotColor = 'rgba(0,0,0,0.15)';
  let speedLines = false;
  let halftone = true;

  if (styleId === 'classic-vintage') {
    halftone = true;
    if (isNightOrDark) {
      bgGradient = `<linearGradient id="g_${seed}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1e1b4b" />
        <stop offset="60%" stop-color="#312e81" />
        <stop offset="100%" stop-color="#4338ca" />
      </linearGradient>`;
      accentColor = '#fbbf24';
      secondaryColor = '#38bdf8';
    } else {
      bgGradient = `<linearGradient id="g_${seed}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fef08a" />
        <stop offset="60%" stop-color="#fed7aa" />
        <stop offset="100%" stop-color="#fca5a5" />
      </linearGradient>`;
      accentColor = '#dc2626';
      secondaryColor = '#2563eb';
    }
  } else if (styleId === 'japanese-manga') {
    speedLines = true;
    halftone = false;
    bgGradient = `<linearGradient id="g_${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="70%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>`;
    accentColor = '#dc2626';
    secondaryColor = '#0f172a';
    inkColor = '#000000';
  } else if (styleId === 'dark-noir') {
    halftone = false;
    bgGradient = `<linearGradient id="g_${seed}" x1="0%" y1="0%" x2="30%" y2="100%">
      <stop offset="0%" stop-color="#09090b" />
      <stop offset="50%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#27272a" />
    </linearGradient>`;
    accentColor = '#f59e0b';
    secondaryColor = '#ef4444';
    inkColor = '#000000';
  } else if (styleId === 'cyberpunk-neon') {
    speedLines = true;
    bgGradient = `<linearGradient id="g_${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f0728" />
      <stop offset="50%" stop-color="#1f1147" />
      <stop offset="100%" stop-color="#3b0764" />
    </linearGradient>`;
    accentColor = '#06b6d4';
    secondaryColor = '#ec4899';
    inkColor = '#030712';
  } else if (styleId === 'american-superhero') {
    speedLines = isAction;
    bgGradient = `<linearGradient id="g_${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a" />
      <stop offset="50%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#60a5fa" />
    </linearGradient>`;
    accentColor = '#fbbf24';
    secondaryColor = '#ef4444';
  } else if (styleId === 'sunday-newspaper') {
    halftone = false;
    bgGradient = `<linearGradient id="g_${seed}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef9c3" />
      <stop offset="100%" stop-color="#dcfce7" />
    </linearGradient>`;
    accentColor = '#ea580c';
    secondaryColor = '#0284c7';
    inkColor = '#1e293b';
  } else if (styleId === 'watercolor-novel') {
    halftone = false;
    bgGradient = `<linearGradient id="g_${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5f3ff" />
      <stop offset="50%" stop-color="#ede9fe" />
      <stop offset="100%" stop-color="#ddd6fe" />
    </linearGradient>`;
    accentColor = '#7c3aed';
    secondaryColor = '#f43f5e';
  } else {
    // default
    bgGradient = `<linearGradient id="g_${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>`;
    accentColor = '#38bdf8';
    secondaryColor = '#fb7185';
  }

  // Generate SVG Graphic Elements based on scene
  let sceneElements = '';

  // Background pattern / halftone
  let patternDef = '';
  if (halftone) {
    patternDef = `<pattern id="dots_${seed}" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
      <circle cx="6" cy="6" r="2" fill="${dotColor}" />
    </pattern>`;
  }

  // Speed lines radiating from center
  if (speedLines) {
    const lines = [];
    const centerX = 400;
    const centerY = 400;
    for (let a = 0; a < 360; a += 15) {
      const rad = (a * Math.PI) / 180;
      const x1 = centerX + Math.cos(rad) * 200;
      const y1 = centerY + Math.sin(rad) * 200;
      const x2 = centerX + Math.cos(rad) * 600;
      const y2 = centerY + Math.sin(rad) * 600;
      lines.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${inkColor}" stroke-width="${a % 30 === 0 ? 3 : 1.5}" stroke-opacity="0.35" />`);
    }
    sceneElements += `<g id="speedlines">${lines.join('')}</g>`;
  }

  // Environmental silhouettes & artwork
  if (isSciFi) {
    // Starfield & Planet / Nebula
    sceneElements += `
      <circle cx="620" cy="240" r="140" fill="${secondaryColor}" fill-opacity="0.6" />
      <circle cx="620" cy="240" r="130" fill="url(#g_${seed})" />
      <!-- Starship / Monolith -->
      <polygon points="350,550 450,520 400,320" fill="${accentColor}" stroke="${inkColor}" stroke-width="6" stroke-linejoin="round" />
      <polygon points="370,540 430,515 400,380" fill="#ffffff" fill-opacity="0.7" />
      <!-- Thruster glow -->
      <circle cx="400" cy="570" r="28" fill="#38bdf8" filter="blur(8px)" />
      <!-- Asteroids -->
      <polygon points="120,480 160,450 190,490 150,530 110,510" fill="${inkColor}" stroke="${accentColor}" stroke-width="3" />
      <polygon points="680,620 720,590 750,630 710,670 670,640" fill="${inkColor}" stroke="${secondaryColor}" stroke-width="3" />
    `;
  } else if (isCity) {
    // Skyline & Gothic / Cyber City Buildings
    sceneElements += `
      <!-- Distant Cityscape -->
      <rect x="50" y="320" width="90" height="480" fill="${inkColor}" fill-opacity="0.5" />
      <rect x="160" y="240" width="130" height="560" fill="${inkColor}" fill-opacity="0.7" />
      <rect x="310" y="160" width="180" height="640" fill="${inkColor}" stroke="${accentColor}" stroke-width="2" />
      <!-- Clocktower details / spire -->
      <polygon points="400,60 370,160 430,160" fill="${inkColor}" stroke="${accentColor}" stroke-width="4" />
      <circle cx="400" cy="240" r="45" fill="${accentColor}" stroke="${inkColor}" stroke-width="6" />
      <line x1="400" y1="240" x2="400" y2="210" stroke="${inkColor}" stroke-width="6" stroke-linecap="round" />
      <line x1="400" y1="240" x2="425" y2="240" stroke="${inkColor}" stroke-width="6" stroke-linecap="round" />
      <!-- Glowing windows -->
      <rect x="340" y="320" width="15" height="25" fill="#fef08a" />
      <rect x="370" y="320" width="15" height="25" fill="#fef08a" />
      <rect x="420" y="320" width="15" height="25" fill="#fef08a" />
      <rect x="445" y="320" width="15" height="25" fill="#fef08a" />
      <rect x="340" y="380" width="15" height="25" fill="#fef08a" />
      <rect x="445" y="380" width="15" height="25" fill="#fef08a" />
      <!-- Foreground silhouette -->
      <rect x="520" y="280" width="110" height="520" fill="${inkColor}" fill-opacity="0.8" />
      <rect x="650" y="360" width="120" height="440" fill="${inkColor}" fill-opacity="0.6" />
    `;
  } else if (isAction) {
    // Action Burst / Clash Explosion
    sceneElements += `
      <!-- Explosion Starburst -->
      <polygon points="400,100 440,250 580,180 480,300 640,360 490,420 600,540 450,490 400,640 350,490 200,540 310,420 160,360 320,300 220,180 360,250" fill="${accentColor}" stroke="${inkColor}" stroke-width="8" stroke-linejoin="round" />
      <polygon points="400,180 430,280 520,230 460,320 560,370 460,410 530,490 430,460 400,560 370,460 270,490 340,410 240,370 340,320 280,230 370,280" fill="${secondaryColor}" stroke="${inkColor}" stroke-width="5" stroke-linejoin="round" />
      <circle cx="400" cy="370" r="60" fill="#ffffff" stroke="${inkColor}" stroke-width="6" />
      <!-- Energy sparks -->
      <circle cx="260" cy="220" r="10" fill="${accentColor}" />
      <circle cx="560" cy="210" r="8" fill="${accentColor}" />
      <circle cx="580" cy="490" r="12" fill="${secondaryColor}" />
      <circle cx="220" cy="460" r="9" fill="${secondaryColor}" />
    `;
  } else if (isHumor) {
    // Playful room / living room silhouette
    sceneElements += `
      <!-- Floor & Rug -->
      <polygon points="50,680 750,680 800,800 0,800" fill="#e2e8f0" stroke="${inkColor}" stroke-width="4" />
      <ellipse cx="400" cy="720" rx="240" ry="50" fill="${accentColor}" fill-opacity="0.8" stroke="${inkColor}" stroke-width="4" />
      <!-- Cute character or vacuum silhouette -->
      <ellipse cx="400" cy="620" rx="90" ry="70" fill="${secondaryColor}" stroke="${inkColor}" stroke-width="6" />
      <circle cx="360" cy="590" r="16" fill="#ffffff" stroke="${inkColor}" stroke-width="4" />
      <circle cx="363" cy="590" r="7" fill="${inkColor}" />
      <circle cx="440" cy="590" r="16" fill="#ffffff" stroke="${inkColor}" stroke-width="4" />
      <circle cx="437" cy="590" r="7" fill="${inkColor}" />
      <!-- Cat ears / Antenna -->
      <polygon points="340,550 320,480 370,530" fill="${secondaryColor}" stroke="${inkColor}" stroke-width="5" />
      <polygon points="460,550 480,480 430,530" fill="${secondaryColor}" stroke="${inkColor}" stroke-width="5" />
    `;
  } else {
    // Dynamic Graphic Silhouette & Geometric framing
    sceneElements += `
      <polygon points="100,200 400,100 700,260 620,700 180,680" fill="${accentColor}" fill-opacity="0.25" stroke="${accentColor}" stroke-width="4" />
      <circle cx="400" cy="380" r="180" fill="none" stroke="${secondaryColor}" stroke-width="8" stroke-dasharray="16,8" />
      <polygon points="400,220 520,440 280,440" fill="${inkColor}" stroke="#ffffff" stroke-width="4" />
      <!-- Dramatic character silhouette -->
      <ellipse cx="400" cy="320" rx="45" ry="50" fill="${accentColor}" stroke="${inkColor}" stroke-width="5" />
      <path d="M 330,460 C 330,370 470,370 470,460 L 490,620 L 310,620 Z" fill="${inkColor}" stroke="${accentColor}" stroke-width="5" />
    `;
  }

  // Dramatic Lightning / Energy Streak
  if (promptLower.includes('lightning') || promptLower.includes('thunder') || promptLower.includes('storm')) {
    sceneElements += `
      <polygon points="280,50 340,240 300,250 370,450 310,380 330,270 270,280" fill="#fef08a" stroke="${inkColor}" stroke-width="4" />
    `;
  }

  // Vignette and borders inside SVG
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
      <defs>
        ${bgGradient}
        ${patternDef}
        <filter id="grain_${seed}">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.1 0"/>
          <feBlend mode="multiply" in="SourceGraphic" result="blend"/>
        </filter>
      </defs>
      <!-- Background Fill -->
      <rect width="${width}" height="${height}" fill="url(#g_${seed})" />
      ${halftone ? `<rect width="${width}" height="${height}" fill="url(#dots_${seed})" />` : ''}
      <!-- Scene Art -->
      ${sceneElements}
      <!-- Subtle Ink Vignette Border -->
      <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="${inkColor}" stroke-width="12" />
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}
