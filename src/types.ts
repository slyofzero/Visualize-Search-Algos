export interface Node {
  id: number;
  x: number;
  y: number;
  fill: string;
}

export interface Edge {
  from: number;
  to: number;
  fill: string;
}

export type Nodes = Node[];
export type Edges = Edge[];
