import { useEffect, useRef, useState } from "react";
import { Application, Color, Graphics, Container} from "pixi.js";
import { createForceLayout } from "../utils/forceLayout";
import graphData from "../data/sampleGraph.json";
import * as d3 from "d3";

export default function GraphCanvas() {
//   const [zoomLevel, setZoomLevel] = useState(1);

// //   // Filtra i nodi in base allo zoom
// //   const getVisibleNodes = () => {
// //     const minConnections = zoomLevel < 0.8 ? 5 : 0;
// //     //return graphData.nodes.filter(n => n.connections >= minConnections);
// //     return graphData.nodes;
// //   };

// //   useEffect(() => {
//     // Ottieni dimensioni del contenitore o della finestra
//     const width = window.innerWidth;
//     const height = window.innerHeight;
//     const centrex = 0;
//     const centrey = 0;
//     // const app = new Application()
//     // async () => {
//     //     await app.init({
//     //     width,
//     //     height,
//     //     backgroundColor: 0x1e1e1e, // colore sfondo
//     //     antialias: true,           // bordi più smooth
//     //     resolution: window.devicePixelRatio || 1, // per retina
//     //     })
    
//     // document.body.appendChild(app.canvas)

//     // // Monta il canvas dentro il div
//     // const container = new Container()
//     // app.stage.addChild(container)

//     // }
//     // // const nodes = JSON.parse(JSON.stringify(graphData.nodes));
//     // // const links = JSON.parse(JSON.stringify(graphData.links));

//     // // const draw = () => {
//     // //   app.stage.removeChildren();

//     // //   const visibleNodes = getVisibleNodes();
//     // //   const visibleLinks = links.filter(
//     // //     l =>
//     // //       visibleNodes.some(n => n.id === l.source.id || n.id === l.source) &&
//     // //       visibleNodes.some(n => n.id === l.target.id || n.id === l.target)
//     // //   );

//     // //   // Disegna le connessioni
//     // //   visibleLinks.forEach(link => {
//     // //     const g = new Graphics();
//     // //     g.lineStyle(1, 0xffffff, 0.5);
//     // //     g.moveTo(link.source.x, link.source.y);
//     // //     g.lineTo(link.target.x, link.target.y);
//     // //     app.stage.addChild(g);
//     // //   });

//     // //   // Disegna i nodi
//     // //   visibleNodes.forEach(node => {
//     // //     const g = new Graphics();
//     // //     g.beginFill(0x00ffcc);
//     // //     g.drawCircle(node.x, node.y, 8);
//     // //     g.endFill();
//     // //     app.stage.addChild(g);
//     // //   });
//     // // };

//     // // // Simulazione fisica
//     // // const simulation = createForceLayout(nodes, links, draw);

//     // // // Zoom handler
//     // // const onWheel = e => {
//     // //   setZoomLevel(prev => Math.max(0.5, Math.min(prev - e.deltaY * 0.001, 2)));
//     // // };
//     // // app.view.addEventListener("wheel", onWheel);

//     // // return () => {
//     // //   simulation.stop();
//     // //   app.destroy(true, true);
//     // // };
//     // // Cleanup allo smontaggio del componente
//     // // return () => {
//     // //   app.destroy(true, true);
//     // // };
//     // console.log("Eseguito solo al montaggio!");

//     (async () => {
//         // Create a new application
//         const app = new Application();

//         // Initialize the application
//         await app.init({ background: '#1099bb', resizeTo: window, width: window.innerWidth, height: window.innerHeight, resolution: 1, antialias:  true});

//         // Append the application canvas to the document body
//         document.body.appendChild(app.canvas);

//         // Create and add a container to the stage
//         //const container = new Container();

//         // app.stage.addChild(container);

//         const nodes = JSON.parse(JSON.stringify(graphData.nodes));
//         const links = JSON.parse(JSON.stringify(graphData.links));

//         // const draw = () => {
//         // app.stage.removeChildren();
//         // };

//         // Simulazione fisica
//         const simulation = createForceLayout(nodes, links, centrex, centrey);

//         // Create the SVG container.
//         // const svg = d3.create("svg")
//             // .attr("width", width)
//             // .attr("height", height)
//             // .attr("viewBox", [-width / 2, -height / 2, width, height])
//             // .attr("style", "max-width: 100%; height: auto;");


//         const container = new Container()
//         const scale = 1;

//         container
//         .setSize(400,400);
//         container.position.set(200);
//         app.stage.addChild(container);

//         // Disegna le connessioni
//         links.forEach(link => {

//             const g = new Graphics();

//             g
//             g.moveTo(link.source.x*scale, link.source.y*scale)
//             g.lineTo(link.target.x*scale, link.target.y*scale)
//             // .moveTo(10, 10)
//             // .lineTo(40, 40)
//             .stroke({width: 2, color: 0xffffff, alpha: 1});
//             container.addChild(g);
//         });

  
//     })();

//   }, []);

  // return <div ref={container} style={{ width: "100%", height: "100vh" }} />;
  //return (<h1>basta</h1>);

  const svgRef = useRef();
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  useEffect(() => {
    const width = 800;
    const height = 600;

    // const svg = d3.create("svg")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .attr("viewBox", [-width / 2, -height / 2, width, height])
    //     .attr("style", "max-width: 100%; height: auto;");

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "#222");;

    const nodes = JSON.parse(JSON.stringify(graphData.nodes));
    const links = JSON.parse(JSON.stringify(graphData.links));

    const simulation = createForceLayout(nodes, links);

    // Add a line for each link, and a circle for each node.
    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", d => color(d.group));

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
            .attr("cy", d => d.y);
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


    // // Zoom behavior
    // const zoom = d3.zoom().on("zoom", (event) => {
    //   svg.selectAll("circle").attr("transform", event.transform);
    // });

    // svg.call(zoom);
  }, []);

  return <svg ref={svgRef}></svg>;
}