import * as d3 from "d3-force";

export function createForceLayout(nodes, links, centreX, centreY, currentCenter) {

    return d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).strength(0.5))
      //.force("charge", d3.forceManyBody().strength(-200))
      .force("x", d3.forceX(centreX))
      .force("y", d3.forceY(centreY))
      .force("center", d3.forceCenter(centreX, centreY))
      .force(
    "charge",
    d3.forceManyBody()
      .strength(d => d.id === currentCenter ? -1000 : -500) // -300 repulsione maggiore per nodo centrale
  );
}