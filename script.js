const canvas = document.getElementById('posterCanvas');
const ctx = canvas.getContext('2d');
const photoInput = document.getElementById('photoInput');
const nameInput = document.getElementById('nameInput');
const downloadBtn = document.getElementById('downloadBtn');

const background = new Image();
background.src = 'y serai1.png';

let userImage = new Image();
let userImageX = 192;
let userImageY = 230;
let userImageScale = 1;

let dragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

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
      drawPoster();
    };
    userImage.src = evt.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

nameInput.addEventListener('input', drawPoster);

// Déplacement sur ordinateur
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const scaledWidth = userImage.width * userImageScale;
  const scaledHeight = userImage.height * userImageScale;

  if (x >= userImageX && x <= userImageX + scaledWidth &&
      y >= userImageY && y <= userImageY + scaledHeight) {
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
    drawPoster();
  }
});

canvas.addEventListener('mouseup', () => {
  dragging = false;
});

canvas.addEventListener('mouseleave', () => {
  dragging = false;
});

// Zoom avec la molette sur ordinateur
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomSpeed = 0.1;
  if (e.deltaY < 0) {
    userImageScale += zoomSpeed;
  } else {
    userImageScale = Math.max(0.1, userImageScale - zoomSpeed);
  }
  drawPoster();
});

// Déplacement sur mobile (touches)
canvas.addEventListener('touchstart', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.touches[0].clientX - rect.left;
  const y = e.touches[0].clientY - rect.top;

  const scaledWidth = userImage.width * userImageScale;
  const scaledHeight = userImage.height * userImageScale;

  if (x >= userImageX && x <= userImageX + scaledWidth &&
      y >= userImageY && y <= userImageY + scaledHeight) {
    dragging = true;
    dragOffsetX = x - userImageX;
    dragOffsetY = y - userImageY;
  }
});

canvas.addEventListener('touchmove', (e) => {
  if (dragging) {
    const rect = canvas.getBoundingClientRect();
    userImageX = e.touches[0].clientX - rect.left - dragOffsetX;
    userImageY = e.touches[0].clientY - rect.top - dragOffsetY;
    drawPoster();
  }
});

canvas.addEventListener('touchend', () => {
  dragging = false;
});

// Zoom avec un geste de pincement sur mobile
let initialDistance = null;
let initialScale = userImageScale;

canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    const x1 = e.touches[0].clientX;
    const y1 = e.touches[0].clientY;
    const x2 = e.touches[1].clientX;
    const y2 = e.touches[1].clientY;
    initialDistance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    initialScale = userImageScale;
  }
});

canvas.addEventListener('touchmove', (e) => {
  if (e.touches.length === 2 && initialDistance) {
    const x1 = e.touches[0].clientX;
    const y1 = e.touches[0].clientY;
    const x2 = e.touches[1].clientX;
    const y2 = e.touches[1].clientY;
    const currentDistance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    userImageScale = initialScale * (currentDistance / initialDistance);
    drawPoster();
  }
});

function drawPoster() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (userImage.src) {
    const scaledWidth = userImage.width * userImageScale;
    const scaledHeight = userImage.height * userImageScale;
    ctx.drawImage(userImage, userImageX, userImageY, scaledWidth, scaledHeight);
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
