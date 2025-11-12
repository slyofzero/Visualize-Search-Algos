import "./style.css";
import type { Edge, Node } from "./types";
import { drawEdge, drawNode } from "./utils";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("Element #app not found in DOM");
}

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const header = document.querySelector("#header") as HTMLDivElement;
const drawingModeSelector = document.querySelector(
  "#drawingMode"
) as HTMLSelectElement;
const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - header.offsetHeight;

// ============================== Drawing Starts ==============================
const nodes: Node[] = [];
let edges: Edge[] = [];
const nodesRedoStack: Node[] = [];
const edgesRedoStack: Edge[] = [];
const edgesForNodes: { [key: number]: Edge[] }[] = [];

const nodeSize = 20;
const radius = 10;
type DrawingModeType = "fill" | "select";
let drawingMode = drawingModeSelector.value as DrawingModeType;

// ========== Fill Mode ==========
// Draw nodes
canvas.addEventListener("click", (e) => {
  if (drawingMode === "fill") {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const node: Node = {
      id: nodes.length,
      x: x,
      y: y,
      fill: "red",
    };

    drawNode(ctx, x, y, nodeSize, node.fill);
    nodes.push(node);
  }
});

// Redraw nodes
function reDrawGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const node of nodes) {
    drawNode(ctx, node.x, node.y, nodeSize, node.fill);
  }

  for (const edge of edges) {
    const { from, to } = edge;
    const node1 = nodes[from];
    const node2 = nodes[to];
    drawEdge(ctx, node1.x, node1.y, node2.x, node2.y, radius, edge.fill);
  }
}

// Undo
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key == "z") {
    if (drawingMode === "fill") {
      const removedNode = nodes.pop();
      if (removedNode) {
        nodesRedoStack.push(removedNode);

        const [toRemove, toKeep] = edges.reduce(
          ([remove, keep], edge) => {
            if (edge.from === removedNode.id || edge.to === removedNode.id) {
              remove.push(edge);
            } else {
              keep.push(edge);
            }
            return [remove, keep];
          },
          [[], []] as [Edge[], Edge[]]
        );

        edges = toKeep;
        edgesForNodes.push({ [removedNode.id]: toRemove });
      }
    } else {
      const removedEdge1 = edges.pop();
      const removedEdge2 = edges.pop();
      if (removedEdge1 && removedEdge2) {
        edgesRedoStack.push(removedEdge1);
        edgesRedoStack.push(removedEdge2);
      }
    }
    reDrawGraph();
  } else if ((e.ctrlKey || e.metaKey) && e.key == "y") {
    if (drawingMode === "fill") {
      const addBackNode = nodesRedoStack.pop();
      if (addBackNode) {
        nodes.push(addBackNode);
        const lastNode = edgesForNodes.at(-1);
        if (lastNode && Number(Object.keys(lastNode)[0]) === addBackNode.id) {
          edgesForNodes.pop();
          edges.push(...Object.values(lastNode).flat());
        }
      }
    } else {
      const addBackEdge1 = edgesRedoStack.pop();
      const addBackEdge2 = edgesRedoStack.pop();
      if (addBackEdge1 && addBackEdge2) {
        edges.push(addBackEdge1);
        edges.push(addBackEdge2);
      }
    }
    reDrawGraph();
  }
});

// ========== Select Mode ==========
let from: Node | null = null;
let to: Node | null = null;

function resetFromTo() {
  from = null;
  to = null;
}

drawingModeSelector.addEventListener("change", (e) => {
  if (e.target instanceof HTMLSelectElement) {
    drawingMode = e.target.value as DrawingModeType;
  }

  resetFromTo();
});

canvas.addEventListener("mousemove", (e) => {
  if (drawingMode === "select") {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let hovering = false;
    for (const node of nodes) {
      if ((node.x - x) ** 2 + (node.y - y) ** 2 <= nodeSize ** 2) {
        hovering = true;
        break;
      }
    }

    canvas.style.cursor = hovering ? "pointer" : "default";
  }
});

canvas.addEventListener("mousedown", (e) => {
  if (drawingMode === "select") {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const node of nodes) {
      if ((node.x - x) ** 2 + (node.y - y) ** 2 <= nodeSize ** 2) {
        if (!from) from = node;
        else if (!to) {
          if (node.id === from.id) break;

          to = node;

          const edge1: Edge = { from: from.id, to: to.id, fill: "black" };
          const edge2: Edge = { from: to.id, to: from.id, fill: "black" };
          edges.push(edge1);
          edges.push(edge2);

          drawEdge(ctx, from.x, from.y, to.x, to.y, radius, "black");

          resetFromTo();
        }

        break;
      }
    }
  }
});
