import * as fs from "fs";

const numNodes = 100;
const nodes = [];
const links = [];

// Crea nodi
for (let i = 0; i < numNodes; i++) {
  nodes.push({ id: i, name: `Node ${i}`, connections: 0 });
}

// Funzione per collegare due nodi e aggiornare connections
function connect(a, b) {
  if (a !== b) {
    links.push({ source: a, target: b });
    nodes[a].connections++;
    nodes[b].connections++;
  }
}

// Crea gruppi piccoli (5-15 nodi)
for (let g = 0; g < 100; g++) {
  const groupSize = Math.floor(Math.random() * 11) + 5;
  const start = Math.floor(Math.random() * (numNodes - groupSize));
  for (let i = start; i < start + groupSize; i++) {
    for (let j = i + 1; j < start + groupSize; j++) {
      connect(i, j);
    }
  }
}

// Crea gruppi grandi (circa 100 nodi)
for (let g = 0; g < 2; g++) {
  const groupSize = 10;
  const start = Math.floor(Math.random() * (numNodes - groupSize));
  for (let i = start; i < start + groupSize; i++) {
    for (let j = i + 1; j < start + groupSize; j++) {
      if (Math.random() > 0.7) connect(i, j); // non tutti collegati per non esplodere
    }
  }
}

// Aggiungi collegamenti casuali extra
for (let i = 0; i < numNodes; i++) {
  const extraLinks = Math.floor(Math.random() * 5);
  for (let j = 0; j < extraLinks; j++) {
    const target = Math.floor(Math.random() * numNodes);
    connect(i, target);
  }
}

const graph = { nodes, links };

// Salva in file JSON
fs.writeFileSync('graph.json', JSON.stringify(graph, null, 2));
console.log(`✅ File graph.json creato con ${numNodes} nodi e ${links.length} collegamenti`);
