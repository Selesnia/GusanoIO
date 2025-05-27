const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Ajusta el canvas al tamaño de la ventana
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Estado del juego
let snake = [{ x: 50, y: 50 }];
let dir = { x: 1, y: 0 };        // dirección inicial
const grid = 20;                 
let food = { x: 200, y: 200 };

// Control con flechas
window.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp')    dir = { x: 0, y: -1 };
  if (e.key === 'ArrowDown')  dir = { x: 0, y: 1 };
  if (e.key === 'ArrowLeft')  dir = { x: -1, y: 0 };
  if (e.key === 'ArrowRight') dir = { x: 1, y: 0 };
});

// Bucle principal
function loop() {
  // Mover cabeza
  const head = {
    x: snake[0].x + dir.x * grid,
    y: snake[0].y + dir.y * grid
  };
  snake.unshift(head);

  // Comer comida
  if (head.x === food.x && head.y === food.y) {
    food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
    food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
  } else {
    snake.pop();
  }

  // Dibujar fondo
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar comida
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, grid, grid);

  // Dibujar gusano
  ctx.fillStyle = 'lime';
  snake.forEach(s => ctx.fillRect(s.x, s.y, grid, grid));

  setTimeout(loop, 100);
}
loop();
