const canvas = document.getElementById('posterCanvas');
const ctx = canvas.getContext('2d');
const photoInput = document.getElementById('photoInput');
const nameInput = document.getElementById('nameInput');
const downloadBtn = document.getElementById('downloadBtn');
const zoomSlider = document.getElementById('zoomSlider');

const background = new Image();
background.src = 'y serai1.png';

let userImage = new Image();
let userImageX = 192;
let userImageY = 230;
let userImageScale = 1;

let dragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let initialDistance = null;
let initialScale = userImageScale;

background.onload = () => drawPoster();

photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(evt) {
    userImage = new Image();
    userImage.onload = () => {
      userImageX = (canvas.width - userImage.width) / 2;
      userImageY = (canvas.height - userImage.height) / 2;
      userImageScale = 1;
      zoomSlider.value = 1;
      drawPoster();
    };
    userImage.src = evt.target.result;
  };
  if (file) reader.readAsDataURL(file);
});

nameInput.addEventListener('input', drawPoster);

// Mouse events (desktop)
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const w = userImage.width * userImageScale;
  const h = userImage.height * userImageScale;

  if (x >= userImageX && x <= userImageX + w && y >= userImageY && y <= userImageY + h) {
    dragging = true;
    dragOffsetX = x - userImageX;
    dragOffsetY = y - userImageY;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (dragging) {
    const rect = canvas.getBoundingClientRect();
    userImageX = e.clientX - rect.left - dragOffsetX;
    userImageY = e.clientY - rect.top - dragOffsetY;
    requestAnimationFrame(drawPoster);
  }
});

canvas.addEventListener('mouseup', () => dragging = false);
canvas.addEventListener('mouseleave', () => dragging = false);

// Wheel zoom (desktop)
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomSpeed = 0.1;
  userImageScale += e.deltaY < 0 ? zoomSpeed : -zoomSpeed;
  userImageScale = Math.max(0.1, userImageScale);
  zoomSlider.value = userImageScale;
  requestAnimationFrame(drawPoster);
}, { passive: false });

// Touch events (mobile)
function onTouchStart(e) {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  if (e.touches.length === 1) {
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    const w = userImage.width * userImageScale;
    const h = userImage.height * userImageScale;
    if (x >= userImageX && x <= userImageX + w && y >= userImageY && y <= userImageY + h) {
      dragging = true;
      dragOffsetX = x - userImageX;
      dragOffsetY = y - userImageY;
    }
  } else if (e.touches.length === 2) {
    const x1 = e.touches[0].clientX;
    const y1 = e.touches[0].clientY;
    const x2 = e.touches[1].clientX;
    const y2 = e.touches[1].clientY;
    initialDistance = Math.hypot(x2 - x1, y2 - y1);
    initialScale = userImageScale;
  }
}

function onTouchMove(e) {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  if (dragging && e.touches.length === 1) {
    userImageX = e.touches[0].clientX - rect.left - dragOffsetX;
    userImageY = e.touches[0].clientY - rect.top - dragOffsetY;
    requestAnimationFrame(drawPoster);
  } else if (e.touches.length === 2 && initialDistance) {
    const x1 = e.touches[0].clientX;
    const y1 = e.touches[0].clientY;
    const x2 = e.touches[1].clientX;
    const y2 = e.touches[1].clientY;
    const currentDistance = Math.hypot(x2 - x1, y2 - y1);
    userImageScale = initialScale * (currentDistance / initialDistance);
    zoomSlider.value = userImageScale;
    requestAnimationFrame(drawPoster);
  }
}

function onTouchEnd(e) {
  dragging = false;
  if (e.touches.length < 2) initialDistance = null;
}

canvas.addEventListener('touchstart', onTouchStart, { passive: false });
canvas.addEventListener('touchmove', onTouchMove, { passive: false });
canvas.addEventListener('touchend', onTouchEnd);

// Zoom via slider
zoomSlider.addEventListener('input', (e) => {
  userImageScale = parseFloat(e.target.value);
  requestAnimationFrame(drawPoster);
});

function drawPoster() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (userImage.src) {
    const w = userImage.width * userImageScale;
    const h = userImage.height * userImageScale;
    ctx.drawImage(userImage, userImageX, userImageY, w, h);
  }

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  if (nameInput.value) {
    ctx.font = '15px Futura Bk BT';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(nameInput.value, canvas.width / 2, 550);
  }
}

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'affiche-ASPD.png';
  link.href = canvas.toDataURL();
  link.click();
});