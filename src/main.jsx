const c = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let mouseX = 0;
let mouseY = 0;

// Обновляем координаты курсора
c.addEventListener("mousemove", function (event) {
  const rect = c.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
});

// Обрабатываем клик по шару
c.addEventListener("click", function (event) {
  const rect = c.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
  for (const ball of balls) {
    if (checkMouseCollision(ball)) {
      showMenu(ball);
      break;
    }
  }
});

function drawCircle(circle) {
  ctx.beginPath();
  ctx.ellipse(
    circle.x,
    circle.y,
    circle.radius,
    circle.radius,
    0,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = circle.color;
  ctx.fill();
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

let balls = [];
let bullets = [];

balls.push({
  x: 30,
  y: 30,
  dx: 0,
  dy: getRandom(3, 5),
  radius: 25,
  color: "pink",
  shootInterval: 100,
  score: 0,
  bulletColor: "red",
  speed: 2,
  currentShootTimer: 100, // Добавлено для отслеживания текущего интервала стрельбы
});

balls.push({
  x: c.width - 30,
  y: c.height - 30,
  dx: 0,
  dy: -getRandom(3, 5),
  radius: 25,
  color: "blue",
  shootInterval: 100,
  score: 0,
  bulletColor: "red",
  speed: 2,
  currentShootTimer: 100, // Добавлено для отслеживания текущего интервала стрельбы
});

function shootBullet(ball, target) {
  let angle = Math.atan2(target.y - ball.y, target.x - ball.x);
  let speed = 5;

  bullets.push({
    x: ball.x,
    y: ball.y,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    radius: 5,
    color: ball.bulletColor,
    shooter: ball,
  });
}

function checkMouseCollision(ball) {
  let distX = ball.x - mouseX;
  let distY = ball.y - mouseY;
  let distance = Math.sqrt(distX * distX + distY * distY);

  return distance <= ball.radius;
}

function checkBulletCollision(bullet, target) {
  let distX = bullet.x - target.x;
  let distY = bullet.y - target.y;
  let distance = Math.sqrt(distX * distX + distY * distY);

  return distance <= bullet.radius + target.radius;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const ball of balls) {
    ball.x += ball.dx * ball.speed;
    ball.y += ball.dy * ball.speed;

    if (ball.y + ball.radius >= c.height || ball.y - ball.radius <= 0) {
      ball.dy *= -1;
      ball.y += ball.dy;
    }

    if (checkMouseCollision(ball)) {
      ball.dx *= -1;
      ball.dy *= -1;
    }

    // Таймер для стрельбы
    if (ball.currentShootTimer <= 0) {
      const target = balls.find((b) => b !== ball);
      shootBullet(ball, target);
      ball.currentShootTimer = ball.shootInterval; // Используем обновленный интервал
    } else {
      ball.currentShootTimer--; // Отсчитываем время до следующего выстрела
    }

    drawCircle(ball);

    // Отрисовка счета каждого шара
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    const scoreX = ball.color === "pink" ? 10 : c.width - 100;
    const scoreY = 20;
    ctx.fillText("Score: " + ball.score, scoreX, scoreY);

    // Проверка клика на счет
    c.addEventListener("click", function (event) {
      const rect = c.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      if (
        clickX >= scoreX &&
        clickX <= scoreX + 80 &&
        clickY >= scoreY - 16 &&
        clickY <= scoreY
      ) {
        showMenu(ball, clickX, clickY);
      }
    });
  }

  // Движение и отрисовка пуль
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;

    const target = balls.find(
      (b) => b !== bullet.shooter && checkBulletCollision(bullet, b)
    );
    if (target) {
      bullets.splice(i, 1);
      bullet.shooter.score++;
      continue;
    }

    if (
      bullet.x < 0 ||
      bullet.x > c.width ||
      bullet.y < 0 ||
      bullet.y > c.height
    ) {
      bullets.splice(i, 1);
    } else {
      drawCircle(bullet);
    }
  }

  window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);

function showMenu(ball) {
  const menuX = ball.x + 30; // Сохраняем положение меню
  const menuY = ball.y + 30;

  ReactDOM.render(
    <ControlMenu ball={ball} menuX={menuX} menuY={menuY} />,
    document.getElementById("menu-container")
  );
}

function ControlMenu({ ball, menuX, menuY }) {
  const [bulletColor, setBulletColor] = React.useState(ball.bulletColor);
  const [shootInterval, setShootInterval] = React.useState(ball.shootInterval);
  const [speed, setSpeed] = React.useState(ball.speed);

  const applySettings = () => {
    ball.bulletColor = bulletColor;
    ball.shootInterval = shootInterval;
    ball.speed = speed;

    ball.currentShootTimer = ball.shootInterval; // Обновление таймера выстрела
    ReactDOM.unmountComponentAtNode(document.getElementById("menu-container"));
  };

  return (
    <div
      style={{
        background: "white",
        padding: "10px",
        border: "1px solid black",
        top: menuY + "px",
        left: menuX + "px",
        position: "absolute",
      }}
    >
      <p>Change Bullet Color:</p>
      <input
        type="color"
        value={bulletColor}
        onChange={(e) => setBulletColor(e.target.value)}
      />
      <p>Reduce reload speed:</p>
      <input
        type="range"
        min="5"
        max="50"
        step="5"
        value={shootInterval}
        onChange={(e) => setShootInterval(parseInt(e.target.value))}
      />

      <p>Increase speed:</p>
      <input
        type="range"
        min="1"
        max="10"
        value={speed}
        onChange={(e) => setSpeed(parseInt(e.target.value))}
      />
      <br />
      <br />
      <button onClick={applySettings}>Apply</button>
    </div>
  );
}
