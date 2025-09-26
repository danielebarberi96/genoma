import { useEffect, useRef, useState } from "react";
import { Application, Color, Graphics, Container} from "pixi.js";
import { createForceLayout } from "../utils/forceLayout";
import graphData from "../data/graph_ws_100.json";
import * as d3 from "d3";

export default function GraphCanvas() {

    const svgRef = useRef();
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    // let currentCenter = 0; // nodo iniziale
    const [currentCenter, setCurrentCenter] = useState(0); // nodo iniziale
//   let depth = 3;
    const [depth, setDepth] = useState(1);

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const centreX = width/2;
    const centreY = height/2;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "#ffffffff");;

    const nodes_total = JSON.parse(JSON.stringify(graphData.nodes));
    const links_total = JSON.parse(JSON.stringify(graphData.links));

    const subgraph = getSubgraph(currentCenter, depth, nodes_total, links_total);

    subgraph.nodes.forEach(node => {
    if (node.x === undefined || node.y === undefined) {
      node.x = centreX + (Math.random() - 0.5) * 50;
      node.y = centreY + (Math.random() - 0.5) * 50;
    }
  });

    const minRadius = 4;
    const maxRadius = 12;

    // Trova min e max delle connessioni
    const minConnections = d3.min(subgraph.nodes, d => d.connections);
    const maxConnections = d3.max(subgraph.nodes, d => d.connections);

    // Scala lineare
    const sizeScale = d3.scaleLinear()
    .domain([minConnections, maxConnections])
    .range([minRadius, maxRadius]);

    const nodes = subgraph.nodes;
    const links = subgraph.links;

    const simulation = createForceLayout(nodes, links, centreX, centreY, currentCenter);

    // Add a line for each link, and a circle for each node.
    const link = svg.append("g")
        .attr("stroke", "#636363ff")
        .attr("stroke-opacity", 0.5)
        .selectAll("line")
        .data(links)
        .join("line")
        // .attr("stroke-width", d => Math.sqrt(d.value));
        .attr("stroke-width", 0.2);

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", d => sizeScale(d.connections))
        .attr("fill", d => color(d.group))
        .on("click", (event, d) => {
        setCurrentCenter(d.id); // aggiorna stato React
      })
      .on("mouseover", (event, d) => {
        if (d.id !== currentCenter) {
        svg.select(`#name-${d.id}`).attr("opacity", 1);
        }
        
    })
    .on("mouseout", (event, d) => {
        if (d.id !== currentCenter) {
        svg.select(`#name-${d.id}`).attr("opacity", 0);
        }
    });

    // Disegna i nomi dei nodi
    const labels = svg.selectAll("text")
        .data(subgraph.nodes)
        .enter()
        .append("text")
        .attr("id", d => `name-${d.id}`)
        .text(d => d.name)
        .attr("fill", "black")
        .attr("font-size", 14)
        .attr("x", d => d.x + 200)
        .attr("y", d => d.y + 200)
        .style("pointer-events", "none")
        .attr("opacity", d => d.id === currentCenter ? 1 : 0); // solo currentNode visibile

       // Add a drag behavior.
    node.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    
    // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("fill", d => d.id === currentCenter ? "red" : "#555555ff");

        labels
            .attr("x", d => d.x + 10)
            .attr("y", d => d.y + 10);
    });

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    function getSubgraph(centerId, depth, nodes, links) {
        const visited = new Set();
        const resultNodes = [];
        const resultLinks = [];
        const queue = [{ id: centerId, level: 0 }];
        visited.add(centerId);

        while (queue.length > 0) {
            const { id, level } = queue.shift();
            resultNodes.push(nodes[id]);

            if (level < depth) {
            for (const link of links) {
                if (link.source === id || link.target === id) {
                const neighbor = link.source === id ? link.target : link.source;
                resultLinks.push(link);
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push({ id: neighbor, level: level + 1 });
                }
                }
            }
            }
        }
        return { nodes: resultNodes, links: resultLinks };
        }



    // // Zoom behavior
    // const zoom = d3.zoom().on("zoom", (event) => {
    //   svg.selectAll("circle").attr("transform", event.transform);
    // });

    // svg.call(zoom);
    return () => simulation.stop();
  }, [currentCenter, depth, svgRef.current]);

//   return <svg ref={svgRef}></svg>;
    return (
        <div style={{ position: "relative"}}>
        <svg ref={svgRef}></svg>
        <input
            type="range"
            min={1}
            max={3}
            value={depth}
            onChange={e => setDepth(Number(e.target.value))}
            style={{
            position: "absolute",
            bottom: "100px",   // distanza dal fondo
            left: "66.6%",
            transform: "translateX(-50%)",
            width: "200px",
            background: "transparent",
            accentColor: "#69b3a2", // colore della track in Chrome
            cursor: "pointer",
            }}
        />
        </div>
    );
}