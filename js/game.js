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

// ——— Estado del juego ———
// Empezamos con la cabeza en el centro
let head = { x: canvas.width/2, y: canvas.height/2 };
// El “snake” es un array de segmentos (empezamos con la cabeza sola)
let snake = [ { ...head } ];

// Cuánto crece al comer
let growth = 0;

// Velocidad en px/frame
const speed = 4;

// Creamos la comida en posición aleatoria
const grid = 20;
let food = randomFood();

// ——— Captura de puntero (mouse/touch/stylus) ———
let pointer = { x: head.x, y: head.y };
canvas.addEventListener('pointermove', e => {
  const r = canvas.getBoundingClientRect();
  pointer.x = e.clientX - r.left;
  pointer.y = e.clientY - r.top;
});

// ——— Función para colocar comida nueva aleatoria ———
function randomFood(){
  return {
    x: Math.floor(Math.random()*(canvas.width/grid))*grid,
    y: Math.floor(Math.random()*(canvas.height/grid))*grid
  };
}

// ——— Lógica de actualización ———
function update(){
  // 1) Calculamos vector hacia el puntero
  let dx = pointer.x - head.x;
  let dy = pointer.y - head.y;
  const dist = Math.hypot(dx, dy) || 1;

  // 2) Movemos la cabeza hacia el puntero a velocidad constante
  head.x += (dx/dist) * speed;
  head.y += (dy/dist) * speed;

  // 3) Insertamos la nueva posición al frente del array
  snake.unshift({ x: head.x, y: head.y });

  // 4) Si no estamos en fase de crecimiento, cortamos la cola
  if (growth > 0) {
    growth--;
  } else {
    snake.pop();
  }

  // 5) Detectamos colisión con la comida
  if (
    Math.abs(head.x - food.x) < grid/2 &&
    Math.abs(head.y - food.y) < grid/2
  ) {
    growth += 10;        // aumentamos la longitud
    food = randomFood(); // nueva comida
  }
}

// ——— Lógica de dibujo ———
function draw(){
  // Fondo
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Comida
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(food.x + grid/2, food.y + grid/2, grid/2, 0, Math.PI*2);
  ctx.fill();

  // Gusano
  ctx.fillStyle = 'lime';
  snake.forEach(seg => {
    ctx.fillRect(
      seg.x - grid/2,
      seg.y - grid/2,
      grid,
      grid
    );
  });
}

// ——— Bucle principal ———
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
