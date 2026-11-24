const step = 5;
const desk = { x: 149, y: 77 };
const directions = [
  [step, 0, 'right'], [-step, 0, 'left'], [0, -step, 'up'], [0, step, 'down'],
];

function findRoute(player, obstacles) {
  const start = { x: Math.round(player.x), y: Math.round(player.y) };
  const { halfWidth, halfHeight, center } = player.body;
  const offsetX = center.x - player.x;
  const offsetY = center.y - player.y;
  const queue = [start];
  const key = (x, y) => `${x},${y}`;
  const visited = new Set([key(start.x, start.y)]);
  const blocked = (x, y) => {
    const centerX = x + offsetX;
    const centerY = y + offsetY;
    const left = centerX - halfWidth;
    const right = centerX + halfWidth;
    const top = centerY - halfHeight;
    const bottom = centerY + halfHeight;
    return left < 0 || right > 240 || top < 0 || bottom > 160 ||
      obstacles.some(body => left < body.right && right > body.left && top < body.bottom && bottom > body.top);
  };
  for (let index = 0; index < queue.length; index += 1) {
    const point = queue[index];
    if (Math.hypot(point.x - desk.x, point.y - desk.y) < step) {
      const route = [];
      for (let next = point; next.previous; next = next.previous) route.push(next);
      return route.reverse();
    }
    for (const [dx, dy, direction] of directions) {
      const x = point.x + dx;
      const y = point.y + dy;
      const id = key(x, y);
      if (visited.has(id) || blocked(x, y)) continue;
      visited.add(id);
      queue.push({ x, y, direction, previous: point });
    }
  }
  return [];
}

export function walkToDesk(scene, complete) {
  const { player } = scene;
  const points = findRoute(player, scene.obstacles.getChildren().map(zone => zone.body));
  const arrival = points.at(-1);
  const settle = () => {
    player.body.reset(player.x, player.y);
    player.facing = 'up';
    player.stopAnimation();
    complete();
  };
  if (!scene.motion || !arrival) {
    if (arrival) player.setPosition(arrival.x, arrival.y);
    settle();
    return;
  }
  const segments = [];
  let origin = { x: player.x, y: player.y };
  for (const [index, point] of points.entries()) {
    if (points[index + 1]?.direction === point.direction) continue;
    segments.push({
      targets: player,
      x: point.x,
      y: point.y,
      duration: Math.max(45, Math.hypot(point.x - origin.x, point.y - origin.y) * 12),
      onStart: () => player.anims.play(`walk_${point.direction}`, true),
      onUpdate: () => player.setDepth(Math.floor(player.y)),
    });
    origin = point;
  }
  scene.tweens.chain({ tweens: segments, onComplete: settle });
}
