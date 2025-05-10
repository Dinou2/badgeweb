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
let userImageSize = 384;

let dragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

background.onload = () => drawPoster();

photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(evt) {
    userImage = new Image();
    userImage.onload = drawPoster;
    userImage.src = evt.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

nameInput.addEventListener('input', drawPoster);

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (x >= userImageX && x <= userImageX + userImageSize &&
      y >= userImageY && y <= userImageY + userImageSize) {
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

function drawPoster() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (userImage.src) {
    ctx.drawImage(userImage, userImageX, userImageY, userImageSize, userImageSize);
  }
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  if (nameInput.value) {
    ctx.font = '15px Futura Bk BT ';
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

// canvas.addEventListener('wheel', (e) => {
//   e.preventDefault();
//   const zoomSpeed = 20;
//   if (e.deltaY < 0) {
//     userImageSize += zoomSpeed;
//   } else {
//     userImageSize = Math.max(20, userImageSize - zoomSpeed);
//   }
//   drawPoster();
// });
