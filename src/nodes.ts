import { sum } from "mathjs";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function heuristic(goal: Node, node: Node) {
  return Math.abs(goal.x - node.x) + Math.abs(goal.y - node.y);
}

function pickRandomWithoutReplacement(array: any[], n = 1, weights: number[]) {
  if (n > array.length) throw new Error("Sample size larger than array");

  const items = [...array];
  const probs = weights ? [...weights] : Array(items.length).fill(1); // equal weights if none given

  const result = [];

  for (let k = 0; k < n; k++) {
    // Normalize weights
    const total = probs.reduce((a, b) => a + b, 0);
    const normalized = probs.map((w) => w / total);

    // Draw one item
    const r = Math.random();
    let cumulative = 0;
    let index = 0;
    for (let i = 0; i < normalized.length; i++) {
      cumulative += normalized[i];
      if (r <= cumulative) {
        index = i;
        break;
      }
    }

    // Store chosen element
    result.push(items[index]);

    // Remove it so it’s not chosen again
    items.splice(index, 1);
    probs.splice(index, 1);
  }

  return result;
}

interface Node {
  id: number;
  x: number;
  y: number;
}

interface Edge {
  from: number;
  to: number;
}

type Nodes = Node[];
type Edges = Edge[];

const nodes: Nodes = [
  { id: 0, x: 1274.29, y: 264.6 },
  { id: 1, x: 26.7, y: 362.62 },
  { id: 2, x: 1121.9, y: 49.41 },
  { id: 3, x: 183.87, y: 392.54 },
  { id: 4, x: 289.59, y: 409.5 },
  { id: 5, x: 362.78, y: 45.76 },
  { id: 6, x: 526.67, y: 475.42 },
  { id: 7, x: 489.02, y: 428.92 },
  { id: 8, x: 1254.34, y: 291.16 },
  { id: 9, x: 1276.14, y: 390.21 },
];

const edges: Edges = [];

for (const node1 of nodes) {
  const hVals = nodes
    .filter((node) => node.id != node1.id)
    .map((node) => ({
      id: node.id,
      h: heuristic(node1, node),
    }));

  const maxHVal = 0.9 * Math.max(...hVals.map((o) => o.h));
  const sortedHVal = hVals
    .map((node) => ({ id: node.id, h: Math.abs(maxHVal - node.h) }))
    .sort((a, b) => b.h - a.h);

  const candidates = sortedHVal.map((o) => o.id);
  const totalWeight = sum(sortedHVal.map((o) => o.h));
  const weights = sortedHVal.map((o) => o.h / totalWeight);
  const connections = randomInt(1, 3);
  const neighbours = pickRandomWithoutReplacement(
    candidates,
    connections,
    weights
  ).map((id) => nodes[id]);

  for (const neighbour of neighbours) {
    edges.push({ from: node1.id, to: neighbour.id });
  }
}

console.log(edges);
