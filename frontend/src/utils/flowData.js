export const createNode = (id, label, position, theme) => ({
    id,
    data: { label },
    position,
    style: {
      background: theme === "dark" ? "rgba(40, 40, 40, 0.9)" : "rgba(255, 255, 255, 0.2)",
      color: theme === "dark" ? "#fff" : "#212529",
      borderRadius: "20px",
      padding: "15px",
    },
  });
  
export const createEdge = (source, target, label = "") => ({
    id: `e${source}-${target}`,
    source,
    target,
    type: "smoothstep",
    label,
  });
  
export const getInitialNodes = (theme) => [
    createNode("1", "Start Flow", { x: 0, y: 0 }, theme),
    createNode("2", "First Mail Sent", { x: 200, y: 0 }, theme),
    createNode("3", "3 Days Wait", { x: 400, y: 0 }, theme),
    createNode("4", "Second Mail Sent", { x: 600, y: 0 }, theme),
    createNode("5", "2 Days Wait", { x: 800, y: 0 }, theme),
    createNode("6", "Thank You Mail Sent", { x: 1000, y: -100 }, theme),
    createNode("7", "No Renewal - End Flow", { x: 1000, y: 100 }, theme),
  ];
  
export const getInitialEdges = () => [
    createEdge("1", "2"),
    createEdge("2", "3"),
    createEdge("3", "4", "Not Renewed"),
    createEdge("4", "5"),
    createEdge("3", "6", "Renewed"),
    createEdge("5", "6", "Renewed"),
    createEdge("5", "7", "Not Renewed"),
  ];
  