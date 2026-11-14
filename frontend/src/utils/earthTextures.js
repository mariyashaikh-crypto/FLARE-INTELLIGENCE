import * as THREE from 'three';

/**
 * Generate a realistic Equirectangular Earth Day Texture (Continents, Oceans, Coasts)
 * @param {number} width 
 * @param {number} height 
 * @returns {THREE.CanvasTexture}
 */
export function createEarthDayTexture(width = 2048, height = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Deep Ocean Base
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#041026'); // Polar dark blue
  oceanGrad.addColorStop(0.2, '#071d42');
  oceanGrad.addColorStop(0.5, '#0b2a59'); // Tropical deep blue
  oceanGrad.addColorStop(0.8, '#071d42');
  oceanGrad.addColorStop(1, '#041026');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Ocean Bathymetry & Continental Shelves (Shallow cyan water near coasts)
  ctx.fillStyle = 'rgba(0, 180, 216, 0.12)';

  // Helper: map spherical lon/lat to equirectangular canvas x/y
  // lon: -180 to 180 -> x: 0 to width
  // lat: -90 to 90 -> y: height to 0
  const toX = (lon) => ((lon + 180) / 360) * width;
  const toY = (lat) => ((90 - lat) / 180) * height;

  // Draw landmass polygons (Realistic simplified continental outlines)
  function drawContinent(coords, fillColor, strokeColor = null) {
    ctx.beginPath();
    coords.forEach(([lon, lat], i) => {
      const x = toX(lon);
      const y = toY(lat);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // Continental Shelf glow
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 12;

  // 1. North America
  const northAmerica = [
    [-168, 66], [-160, 71], [-130, 70], [-95, 74], [-80, 68], [-60, 60],
    [-65, 45], [-75, 35], [-80, 25], [-90, 21], [-97, 26], [-105, 20],
    [-85, 12], [-80, 8], [-77, 8], [-83, 14], [-96, 16], [-105, 23],
    [-115, 30], [-124, 38], [-125, 50], [-135, 58], [-145, 60], [-160, 56],
    [-168, 66]
  ];
  drawContinent(northAmerica, '#1c3620');

  // 2. South America
  const southAmerica = [
    [-77, 8], [-72, 11], [-60, 6], [-50, -1], [-35, -6], [-38, -15],
    [-45, -23], [-55, -35], [-65, -45], [-68, -54], [-75, -50], [-72, -40],
    [-75, -30], [-70, -18], [-80, -4], [-77, 8]
  ];
  drawContinent(southAmerica, '#1e3d22');

  // 3. Eurasia (Europe & Asia)
  const eurasia = [
    [-9, 36], [-9, 43], [2, 51], [10, 54], [5, 62], [20, 70], [30, 71],
    [60, 74], [100, 77], [140, 73], [170, 65], [178, 66], [160, 55],
    [145, 48], [130, 42], [122, 30], [108, 22], [103, 10], [98, 4],
    [92, 10], [80, 15], [70, 24], [60, 25], [50, 30], [45, 13], [40, 15],
    [35, 30], [28, 41], [15, 40], [0, 37], [-9, 36]
  ];
  drawContinent(eurasia, '#264222');

  // 4. Africa
  const africa = [
    [-17, 15], [-12, 28], [-5, 36], [10, 37], [25, 32], [32, 31],
    [34, 28], [43, 12], [51, 11], [40, -5], [35, -20], [30, -32],
    [20, -34], [15, -25], [12, -15], [8, 4], [0, 6], [-15, 11], [-17, 15]
  ];
  drawContinent(africa, '#3b4321');

  // 5. Australia
  const australia = [
    [113, -22], [120, -14], [135, -12], [142, -11], [146, -18], [153, -28],
    [150, -37], [140, -38], [130, -32], [115, -34], [113, -22]
  ];
  drawContinent(australia, '#4a482b');

  // 6. Greenland
  const greenland = [
    [-50, 60], [-40, 65], [-20, 75], [-25, 82], [-50, 83], [-60, 75], [-50, 60]
  ];
  drawContinent(greenland, '#e2e8f0');

  // 7. Antarctica
  const antarctica = [
    [-180, -75], [180, -75], [180, -90], [-180, -90]
  ];
  drawContinent(antarctica, '#f1f5f9');

  ctx.shadowBlur = 0; // reset shadow

  // Desert, Mountain and Topographical textures with procedural noise
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const lat = 90 - (y / height) * 180;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // If it's a land pixel (green/brown tones)
      if (g > b && r > 20) {
        // Sahara / Middle East / Australian Desert Bands
        if ((lat > 15 && lat < 33 && x > width * 0.45 && x < width * 0.65) ||
            (lat > -30 && lat < -18 && x > width * 0.8 && x < width * 0.95)) {
          // Warm desert sand tone
          data[idx] = Math.min(255, r + 45);
          data[idx + 1] = Math.min(255, g + 28);
          data[idx + 2] = Math.min(255, b + 8);
        }

        // Mountain elevation noise
        const n = Math.sin(x * 0.08) * Math.cos(y * 0.08);
        if (n > 0.4) {
          data[idx] = Math.min(255, data[idx] + 25);
          data[idx + 1] = Math.min(255, data[idx + 1] + 25);
          data[idx + 2] = Math.min(255, data[idx + 2] + 20);
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Generate Equirectangular Atmospheric Clouds Texture with Alpha Transparency
 * @param {number} width 
 * @param {number} height 
 * @returns {THREE.CanvasTexture}
 */
export function createEarthCloudsTexture(width = 2048, height = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  // Procedural multi-scale Perlin-like cloud bands
  for (let y = 0; y < height; y++) {
    const lat = 90 - (y / height) * 180;
    const equatorFactor = Math.cos((lat * Math.PI) / 180);

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Multi-octave harmonic noise
      const scale1 = Math.sin(x * 0.015 + y * 0.008) * Math.cos(y * 0.012 - x * 0.005);
      const scale2 = Math.sin(x * 0.04 - y * 0.03) * Math.cos(x * 0.02 + y * 0.04);
      const scale3 = Math.sin(x * 0.09 + y * 0.07);

      // Cloud density thresholding
      let density = (scale1 * 0.5 + scale2 * 0.3 + scale3 * 0.2) + 0.15;

      // Cyclone swirl clusters (subtropical & temperate storm tracks)
      if (Math.abs(lat) > 35 && Math.abs(lat) < 65) {
        density += 0.25;
      }
      // Intertropical Convergence Zone (ITCZ near equator)
      if (Math.abs(lat) < 10) {
        density += 0.2;
      }

      density = Math.max(0, Math.min(1, density));

      if (density > 0.35) {
        const val = Math.floor(255 * ((density - 0.35) / 0.65));
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = Math.floor(val * 0.85); // Alpha
      } else {
        data[idx + 3] = 0;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Generate Equirectangular Night City Lights Texture
 * @param {number} width 
 * @param {number} height 
 * @returns {THREE.CanvasTexture}
 */
export function createEarthNightTexture(width = 2048, height = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Pure dark base
  ctx.fillStyle = '#010309';
  ctx.fillRect(0, 0, width, height);

  const toX = (lon) => ((lon + 180) / 360) * width;
  const toY = (lat) => ((90 - lat) / 180) * height;

  // Major global metropolitan clusters (North America, Europe, East Asia, India, etc.)
  const majorMetros = [
    // North America East Coast & Midwest
    { lon: -74, lat: 40.7, r: 24, i: 1.0 },   // NYC
    { lon: -87.6, lat: 41.8, r: 20, i: 0.9 }, // Chicago
    { lon: -84.3, lat: 33.7, r: 16, i: 0.8 }, // Atlanta
    { lon: -80.2, lat: 25.8, r: 15, i: 0.8 }, // Miami
    { lon: -71.0, lat: 42.3, r: 14, i: 0.8 }, // Boston
    { lon: -77.0, lat: 38.9, r: 18, i: 0.9 }, // Washington DC
    { lon: -95.3, lat: 29.7, r: 18, i: 0.8 }, // Houston
    { lon: -96.8, lat: 32.7, r: 17, i: 0.8 }, // Dallas
    // North America West Coast
    { lon: -118.2, lat: 34.0, r: 22, i: 0.9 },// Los Angeles
    { lon: -122.4, lat: 37.7, r: 18, i: 0.8 },// San Francisco
    { lon: -122.3, lat: 47.6, r: 15, i: 0.8 },// Seattle
    // Europe
    { lon: -0.1, lat: 51.5, r: 22, i: 1.0 },  // London
    { lon: 2.3, lat: 48.8, r: 20, i: 0.9 },   // Paris
    { lon: 4.9, lat: 52.3, r: 18, i: 0.9 },   // Amsterdam / Benelux
    { lon: 13.4, lat: 52.5, r: 16, i: 0.8 },  // Berlin
    { lon: 9.2, lat: 45.4, r: 16, i: 0.8 },   // Milan
    { lon: -3.7, lat: 40.4, r: 15, i: 0.8 },  // Madrid
    { lon: 37.6, lat: 55.7, r: 20, i: 0.9 },  // Moscow
    // East Asia
    { lon: 139.6, lat: 35.6, r: 26, i: 1.0 }, // Tokyo
    { lon: 126.9, lat: 37.5, r: 22, i: 0.9 }, // Seoul
    { lon: 121.4, lat: 31.2, r: 25, i: 1.0 }, // Shanghai
    { lon: 116.4, lat: 39.9, r: 24, i: 1.0 }, // Beijing
    { lon: 113.2, lat: 23.1, r: 24, i: 1.0 }, // Pearl River Delta / HK
    // South Asia
    { lon: 77.2, lat: 28.6, r: 22, i: 0.9 },  // Delhi
    { lon: 72.8, lat: 19.0, r: 20, i: 0.9 },  // Mumbai
    { lon: 77.6, lat: 12.9, r: 18, i: 0.8 },  // Bangalore
    // Middle East
    { lon: 55.3, lat: 25.2, r: 18, i: 0.9 },  // Dubai
    { lon: 31.2, lat: 30.0, r: 18, i: 0.8 },  // Cairo
    // South America & Africa & Australia
    { lon: -46.6, lat: -23.5, r: 22, i: 0.9 },// Sao Paulo
    { lon: -58.3, lat: -34.6, r: 18, i: 0.8 },// Buenos Aires
    { lon: 28.0, lat: -26.2, r: 16, i: 0.8 }, // Johannesburg
    { lon: 151.2, lat: -33.8, r: 18, i: 0.8 } // Sydney
  ];

  majorMetros.forEach(({ lon, lat, r, i }) => {
    const x = toX(lon);
    const y = toY(lat);

    const grad = ctx.createRadialGradient(x, y, 1, x, y, r);
    grad.addColorStop(0, `rgba(255, 235, 175, ${i})`);
    grad.addColorStop(0.3, `rgba(255, 180, 70, ${i * 0.7})`);
    grad.addColorStop(0.7, `rgba(255, 120, 20, ${i * 0.3})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
