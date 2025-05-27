// js/game.js
const canvas = document.getElementById('game');
const ctx    = canvas.getContext('2d');

// ——— Ajuste de tamaño ———
function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// ——— Detectamos si es móvil ———
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// ——— Estado del juego ———
let head = { x: canvas.width/2, y: canvas.height/2 };
let snake = [ { ...head } ];
let growth = 0;
const speed = 4;
const grid  = 20;
let food   = randomFood();

// ——— Variables de control ———
let pointer = { x: head.x, y: head.y }; // para desktop
let joyX = 0, joyY = 0;                  // para móvil

// ——— Pointer Events (sólo si NO es móvil) ———
if (!isMobile) {
  canvas.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
  });
}

// ——— Joystick en móvil ———
if (isMobile) {
  // crear HTML
  const joyBase = document.createElement('div');
  joyBase.id = 'joystick';
  joyBase.innerHTML = '<div class="stick"></div>';
  document.body.appendChild(joyBase);

  const stick = joyBase.querySelector('.stick');

  // touchmove en el joystick
  joyBase.addEventListener('touchmove', e => {
    e.preventDefault();
    const t = e.touches[0];
    const r = joyBase.getBoundingClientRect();
    const cx = r.left + r.width/2;
    const cy = r.top  + r.height/2;
    let dx = (t.clientX - cx)/(r.width/2);
    let dy = (t.clientY - cy)/(r.height/2);
    const mag = Math.hypot(dx, dy) || 1;
    if (mag > 1) { dx /= mag; dy /= mag; }
    joyX = dx; joyY = dy;
    stick.style.transform = `translate(${dx*25}px,${dy*25}px)`;
  }, { passive: false });

  // al soltar el dedo vuelve al centro
  joyBase.addEventListener('touchend', () => {
    joyX = joyY = 0;
    stick.style.transform = `translate(0,0)`;
  });
}

// ——— Alimentar comida aleatoria ———
function randomFood(){
  return {
    x: Math.floor(Math.random() * (canvas.width/grid)) * grid,
    y: Math.floor(Math.random() * (canvas.height/grid)) * grid
  };
}

// ——— Lógica de actualización ———
function update(){
  // elegimos vector según plataforma
  let dx, dy;
  if (isMobile) {
    dx = joyX;
    dy = joyY;
  } else {
    dx = pointer.x - head.x;
    dy = pointer.y - head.y;
  }

  const dist = Math.hypot(dx, dy) || 1;
  head.x += (dx/dist) * speed;
  head.y += (dy/dist) * speed;

  snake.unshift({ x: head.x, y: head.y });
  if (growth > 0) {
    growth--;
  } else {
    snake.pop();
  }

  // comer comida
  if (
    Math.abs(head.x - food.x) < grid/2 &&
    Math.abs(head.y - food.y) < grid/2
  ) {
    growth += 10;
    food = randomFood();
  }
}

// ——— Lógica de dibujo ———
function draw(){
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // comida
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(food.x + grid/2, food.y + grid/2, grid/2, 0, Math.PI*2);
  ctx.fill();

  // gusano
  ctx.fillStyle = 'lime';
  snake.forEach(seg => {
    ctx.fillRect(seg.x-grid/2, seg.y-grid/2, grid, grid);
  });
}

// ——— Bucle ———
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
