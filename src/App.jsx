import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Controls,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Sidebar from "./components/Sidebar";
import PropertiesPanel from "./components/PropertiesPanel";
import EdgePropertiesPanel from "./components/EdgePropertiesPanel";
import { DefaultNode, InputNode, OutputNode, CustomNode } from "./components/ChildNode";

const initialNodes = [
  {
    id: "n1",
    position: { x: 10, y: 10 },
    data: {
      label: "Node 1",
      backgroundColor: '#3B82F6',
    },
    type: "input",
  },
  {
    id: "n2",
    position: { x: 200, y: -50 },
    data: {
      label: "Node 2",
      backgroundColor: '#6B7280',
    },
    type: "default",
  },
  {
    id: "n3",
    position: { x: 200, y: 50 },
    data: {
      label: "Node 3",
      backgroundColor: '#EF4444',
    },
    type: "custom",
  },
];
const initialEdges = [
  { 
    id: "n1-n2", 
    source: "n1", 
    target: "n2", 
    label: "Edge 1", 
    animated: true,
    style: { stroke: '#3B82F6', strokeWidth: 2 },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#3B82F6',
      width: 20,
      height: 20
    }
  },
  { 
    id: "n1-n3", 
    source: "n1", 
    target: "n3",
    style: { stroke: '#6B7280', strokeWidth: 2 },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#6B7280',
      width: 20,
      height: 20
    }
  },
];


const nodeTypes = {
  default: DefaultNode,
  input: InputNode,
  output: OutputNode,
  custom: CustomNode,
};

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
  const [propertiesPanelType, setPropertiesPanelType] = useState('node'); // 'node' or 'edge'

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        style: { stroke: '#6B7280', strokeWidth: 2 },
        markerEnd: { 
          type: 'arrowclosed', 
          color: '#6B7280',
          width: 20,
          height: 20
        }
      };
      setEdges((edgesSnapshot) => addEdge(newEdge, edgesSnapshot));
    },
    []
  );

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
    setPropertiesPanelType('node');
    setShowPropertiesPanel(true);
  }, []);

  // Handle edge selection
  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
    setPropertiesPanelType('edge');
    setShowPropertiesPanel(true);
  }, []);

  // Handle background click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setShowPropertiesPanel(false);
  }, []);

  // Add new node
  const handleAddNode = useCallback((newNode) => {
    setNodes((nodesSnapshot) => [...nodesSnapshot, newNode]);
  }, []);

  // Delete selected node
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nodesSnapshot) => nodesSnapshot.filter((node) => node.id !== nodeId));
    setEdges((edgesSnapshot) =>
      edgesSnapshot.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setShowPropertiesPanel(false);
  }, []);

  // Delete selected edge
  const handleDeleteEdge = useCallback((edgeId) => {
    setEdges((edgesSnapshot) => edgesSnapshot.filter((edge) => edge.id !== edgeId));
    setSelectedEdgeId(null);
    setShowPropertiesPanel(false);
  }, []);

  // Update node properties
  const handleUpdateNode = useCallback((updatedNode) => {
    setNodes((nodesSnapshot) =>
      nodesSnapshot.map((node) =>
        node.id === updatedNode.id ? updatedNode : node
      )
    );
  }, []);

  // Update edge properties
  const handleUpdateEdge = useCallback((updatedEdge) => {
    setEdges((edgesSnapshot) =>
      edgesSnapshot.map((edge) =>
        edge.id === updatedEdge.id ? updatedEdge : edge
      )
    );
  }, []);

  // Update nodes with selected state
  const nodesWithSelection = nodes.map((node) => ({
    ...node,
    selected: node.id === selectedNodeId,
  }));

  // Update edges with selected state
  const edgesWithSelection = edges.map((edge) => ({
    ...edge,
    selected: edge.id === selectedEdgeId,
  }));

  // Get selected node and edge for properties panel
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        onAddNode={handleAddNode}
        onDeleteNode={handleDeleteNode}
        onDeleteEdge={handleDeleteEdge}
        selectedNodeId={selectedNodeId}
        selectedEdgeId={selectedEdgeId}
      />

      {/* React Flow */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodesWithSelection}
          edges={edgesWithSelection}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          fitView
        >
          <Controls />
          <MiniMap zoomable pannable />
        </ReactFlow>
      </div>

      {/* Properties Panel */}
      {showPropertiesPanel && (
        <>
          {propertiesPanelType === 'node' && (
            <PropertiesPanel
              selectedNode={selectedNode}
              onUpdateNode={handleUpdateNode}
              onClose={() => setShowPropertiesPanel(false)}
            />
          )}
          {propertiesPanelType === 'edge' && (
            <EdgePropertiesPanel
              selectedEdge={selectedEdge}
              onUpdateEdge={handleUpdateEdge}
              onClose={() => setShowPropertiesPanel(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
