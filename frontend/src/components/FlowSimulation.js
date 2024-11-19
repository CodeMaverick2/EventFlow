import React, { useState, useEffect, useContext } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "react-flow-renderer";
import { ThemeContext } from "../App";
import { getInitialNodes, getInitialEdges } from "../utils/flowData";

const FlowSimulation = () => {
  const { theme } = useContext(ThemeContext);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isFlowRunning, setIsFlowRunning] = useState(false);

  // Loading initial nodes and edges 
  useEffect(() => {
    setNodes(getInitialNodes(theme));
    setEdges(getInitialEdges());
  }, [theme]);

  const addTimestamp = (message) => `${new Date().toLocaleTimeString()}: ${message}`;
  const resetFlow = () => {
    setNodes(getInitialNodes(theme)); // Reseting nodes
    setEdges(getInitialEdges()); // Reseting edges
    setLogs([]); // Clearing logs
  };

  const highlightNode = (nodeId) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId
          ? { ...node, style: { ...node.style, background: "rgba(0, 255, 0, 0.8)", color: "#fff", border: "2px solid neon" } }
          : node
      )
    );
  };

  const startFlow = async () => {
    resetFlow(); // Reseting the flow on each start
    highlightNode("1");
    setIsFlowRunning(true);
    setLogs([addTimestamp("Flow started.")]);

    const eventSource = new EventSource("http://localhost:5000/stream-flow");

    eventSource.onmessage = (event) => {
      const logMessage = event.data;
      setLogs((prevLogs) => [...prevLogs, addTimestamp(logMessage)]);

      // Highlighting nodes based on specific log messages
      if (logMessage.includes("First Mail Sent")) highlightNode("2");
      if (logMessage.includes("3 Days Wait Ended")) highlightNode("3");
      if (logMessage.includes("Second Mail Sent")) highlightNode("4");
      if (logMessage.includes("2 Days Wait Ended")) highlightNode("5");
      if (logMessage.includes("Subscription renewed")) highlightNode("6");
      if (logMessage.includes("No Renewal")) highlightNode("7");

      // Stoping the SSE connection if the flow is complete
      if (logMessage.includes("Flow completed")) {
        eventSource.close();
        setIsFlowRunning(false);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
      setIsFlowRunning(false);
    };
  };

  return (
    <div className={`flow-container ${theme}`}>
      <header className="header">Event Flow</header>
      <button onClick={startFlow} disabled={isFlowRunning} className="start-btn">
        {isFlowRunning ? "Flow in Progress..." : "Start Flow"}
      </button>
      <div className="flow-chart">
        <ReactFlow nodes={nodes} edges={edges}>
          <Background variant="dots" gap={16} size={1} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      <div className="flow-logs">
        <h3>Flow Logs:</h3>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FlowSimulation;
