// function heuristic(goal: Node, node: Node) {
//   return Math.abs(goal.x - node.x) + Math.abs(goal.y - node.y);
// }

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function drawNode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  fill: string
) {
  ctx.beginPath();
  ctx?.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function drawEdge(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  radius: number,
  fill: string
) {
  const x1 = fromX;
  const x2 = toX;
  const y1 = fromY;
  const y2 = toY;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);

  // Unit vector
  const ux = dx / dist;
  const uy = dy / dist;

  const startX = x1 + ux * radius;
  const startY = y1 + uy * radius;
  const endX = x2 - ux * radius;
  const endY = y2 - uy * radius;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = fill;
  ctx.stroke();
}

// export function genEdges(nodes: Nodes) {
//   const edges: Edges = [];

//   for (const node1 of nodes) {
//     const hVals = nodes
//       .map((node) => ({ id: node.id, h: heuristic(node1, node) }))
//       .sort((a, b) => a.h - b.h);

//     const connections = 4;
//     const neighbours = hVals
//       .slice(1, 1 + connections)
//       .map((node) => nodes[node.id]);

//     neighbours.forEach((neighbour) => {
//       edges.push({ from: node1.id, to: neighbour.id });
//       edges.push({ from: neighbour.id, to: node1.id });
//     });
//   }

//   return edges;
// }
