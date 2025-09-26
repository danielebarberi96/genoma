import * as fs from "fs";

// Parametri WS
const n = 5000;  // numero di nodi
const k = 100;    // ogni nodo collegato ai k vicini
const p = 0.05;  // probabilità di rewiring

// Inizializza nodi
const nodes = Array.from({ length: n }, (_, i) => ({
  id: i,
  name: `User_${i}`,
  connections: 0
}));

// Array per i link
const links = [];

// Funzione per aggiungere un collegamento senza duplicati
function addLink(source, target) {
  if (source !== target && !links.some(l => (l.source === source && l.target === target) || (l.source === target && l.target === source))) {
    links.push({ source, target });
    nodes[source].connections++;
    nodes[target].connections++;
  }
}

// Crea collegamenti iniziali (anello regolare)
for (let i = 0; i < n; i++) {
  for (let j = 1; j <= k / 2; j++) {
    let target = (i + j) % n;
    addLink(i, target);
  }
}

// Applica rewiring con probabilità p
for (let i = 0; i < n; i++) {
  for (let j = 1; j <= k / 2; j++) {
    if (Math.random() < p) {
      // Scollega il vicino e collega un nodo casuale
      let oldTarget = (i + j) % n;
      // Rimuovi il link vecchio
      const index = links.findIndex(l => (l.source === i && l.target === oldTarget) || (l.source === oldTarget && l.target === i));
      if (index > -1) {
        links.splice(index, 1);
        nodes[i].connections--;
        nodes[oldTarget].connections--;
      }
      // Nuovo target casuale
      let newTarget;
      do {
        newTarget = Math.floor(Math.random() * n);
      } while (newTarget === i || links.some(l => (l.source === i && l.target === newTarget) || (l.source === newTarget && l.target === i)));
      addLink(i, newTarget);
    }
  }
}

// Salva su file
const graph = { nodes, links };
fs.writeFileSync('graph_ws_100.json', JSON.stringify(graph, null, 2));

console.log(`Grafo WS generato con ${n} nodi e ${links.length} collegamenti`);
