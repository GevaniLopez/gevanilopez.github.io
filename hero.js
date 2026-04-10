const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let time = 0;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, "#050c14");
  grad.addColorStop(0.45, "#08111c");
  grad.addColorStop(1, "#0b1720");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

function drawMoon() {
  const moonX = width * 0.78;
  const moonY = height * 0.2;
  const moonR = Math.min(width, height) * 0.08;

  const glow = ctx.createRadialGradient(moonX, moonY, moonR * 0.2, moonX, moonY, moonR * 3.2);
  glow.addColorStop(0, "rgba(245, 239, 227, 0.20)");
  glow.addColorStop(0.35, "rgba(95, 168, 211, 0.08)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 3.2, 0, Math.PI * 2);
  ctx.fill();

  const moon = ctx.createRadialGradient(
    moonX - moonR * 0.25,
    moonY - moonR * 0.25,
    moonR * 0.15,
    moonX,
    moonY,
    moonR
  );
  moon.addColorStop(0, "rgba(255,255,255,0.98)");
  moon.addColorStop(0.45, "rgba(245,239,227,0.95)");
  moon.addColorStop(1, "rgba(245,239,227,0.78)");

  ctx.fillStyle = moon;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();
}

function drawStars() {
  for (let i = 0; i < 45; i++) {
    const x = (i * 97) % width;
    const y = ((i * 53) % Math.floor(height * 0.45));
    const alpha = 0.15 + ((Math.sin(time * 0.0015 + i) + 1) / 2) * 0.35;

    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, i % 3 === 0 ? 1.5 : 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWaterLayer(baseY, amplitude, wavelength, speed, color, opacity) {
  ctx.beginPath();
  ctx.moveTo(0, height);

  for (let x = 0; x <= width; x += 8) {
    const y =
      baseY +
      Math.sin((x / wavelength) + time * speed) * amplitude +
      Math.sin((x / (wavelength * 0.55)) + time * speed * 0.7) * (amplitude * 0.35);

    if (x === 0) {
      ctx.lineTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = color.replace("OPACITY", opacity.toString());
  ctx.fill();
}

function drawReflection() {
  const moonX = width * 0.78;
  const moonY = height * 0.2;
  const startY = height * 0.42;
  const reflectionWidth = Math.max(70, width * 0.05);

  const grad = ctx.createLinearGradient(moonX, startY, moonX, height);
  grad.addColorStop(0, "rgba(245,239,227,0.00)");
  grad.addColorStop(0.2, "rgba(245,239,227,0.05)");
  grad.addColorStop(0.5, "rgba(95,168,211,0.10)");
  grad.addColorStop(1, "rgba(95,168,211,0.00)");

  ctx.save();
  ctx.translate(Math.sin(time * 0.0012) * 6, 0);
  ctx.fillStyle = grad;

  for (let i = 0; i < 18; i++) {
    const y = startY + i * ((height - startY) / 18);
    const w = reflectionWidth * (1 - i / 22) + Math.sin(time * 0.002 + i) * 6;
    ctx.fillRect(moonX - w / 2, y, w, 6);
  }

  ctx.restore();
}

function drawMist() {
  const mist = ctx.createRadialGradient(
    width * 0.28,
    height * 0.3,
    20,
    width * 0.28,
    height * 0.3,
    width * 0.55
  );
  mist.addColorStop(0, "rgba(95,168,211,0.08)");
  mist.addColorStop(1, "rgba(95,168,211,0)");
  ctx.fillStyle = mist;
  ctx.fillRect(0, 0, width, height);
}

function drawScene() {
  drawBackground();
  drawMist();
  drawStars();
  drawMoon();
  drawReflection();

  drawWaterLayer(height * 0.58, 8, 180, 0.0018, "rgba(24, 50, 73, OPACITY)", 0.92);
  drawWaterLayer(height * 0.64, 10, 220, 0.0014, "rgba(32, 68, 96, OPACITY)", 0.78);
  drawWaterLayer(height * 0.71, 12, 260, 0.0011, "rgba(48, 96, 128, OPACITY)", 0.64);
  drawWaterLayer(height * 0.79, 14, 300, 0.0009, "rgba(16, 32, 45, OPACITY)", 0.95);
}

function animate() {
  time += 16;
  drawScene();
  window.requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animate();
