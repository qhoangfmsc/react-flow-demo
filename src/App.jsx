import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Controls,
  MiniMap,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Sidebar from "./components/Sidebar";
import PropertiesPanel from "./components/PropertiesPanel";

const initialNodes = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    data: { 
      label: "Node 1",
      width: 150,
      height: 50,
      backgroundColor: '#3B82F6',
      animated: false,
    },
    type: "input",
  },
  { 
    id: "n2", 
    position: { x: 0, y: 100 }, 
    data: { 
      label: "Node 2",
      width: 150,
      height: 50,
      backgroundColor: '#6B7280',
      animated: false,
    },
    type: "default",
  },
  {
    id: "n3",
    position: { x: 0, y: 200 },
    data: { 
      label: "Node 3",
      width: 150,
      height: 50,
      backgroundColor: '#EF4444',
      animated: false,
    },
    type: "custom",
  },
];
const initialEdges = [
  { id: "n1-n2", source: "n1", target: "n2", label: "Edge 1", animated: true },
];

// Default Node Component
const DefaultNode = ({ data, selected }) => {
  const isAnimated = data?.animated;
  const backgroundColor = data?.backgroundColor || '#6B7280';
  const width = data?.width || 150;
  const height = data?.height || 50;
  
  return (
    <div
      className={`px-4 py-3 rounded-lg text-white transition-all ${
        selected 
          ? 'ring-2 ring-gray-300 shadow-lg' 
          : 'hover:opacity-90'
      } ${isAnimated ? 'animate-pulse' : ''}`}
      style={{
        width: width,
        height: height,
        backgroundColor: backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="font-medium text-center leading-tight">{data.label}</div>
      <Handle type="target" position="left" />
      <Handle type="source" position="right" />
    </div>
  );
};

// Input Node Component
const InputNode = ({ data, selected }) => {
  const isAnimated = data?.animated;
  const backgroundColor = data?.backgroundColor || '#3B82F6';
  const width = data?.width || 150;
  const height = data?.height || 50;
  
  return (
    <div
      className={`px-4 py-3 rounded-lg text-white transition-all ${
        selected 
          ? 'ring-2 ring-blue-300 shadow-lg' 
          : 'hover:opacity-90'
      } ${isAnimated ? 'animate-pulse' : ''}`}
      style={{
        width: width,
        height: height,
        backgroundColor: backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="font-medium text-center leading-tight">{data.label}</div>
      <Handle type="source" position="right" />
    </div>
  );
};

// Output Node Component
const OutputNode = ({ data, selected }) => {
  const isAnimated = data?.animated;
  const backgroundColor = data?.backgroundColor || '#10B981';
  const width = data?.width || 150;
  const height = data?.height || 50;
  
  return (
    <div
      className={`px-4 py-3 rounded-lg text-white transition-all ${
        selected 
          ? 'ring-2 ring-green-300 shadow-lg' 
          : 'hover:opacity-90'
      } ${isAnimated ? 'animate-pulse' : ''}`}
      style={{
        width: width,
        height: height,
        backgroundColor: backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="font-medium text-center leading-tight">{data.label}</div>
      <Handle type="target" position="left" />
    </div>
  );
};

// Custom Node Component
const CustomNode = ({ data, selected }) => {
  const isAnimated = data?.animated;
  const backgroundColor = data?.backgroundColor || '#EF4444';
  const width = data?.width || 150;
  const height = data?.height || 50;
  
  return (
    <div
      className={`px-4 py-3 rounded-lg text-white transition-all ${
        selected 
          ? 'ring-2 ring-red-300 shadow-lg' 
          : 'hover:opacity-90'
      } ${isAnimated ? 'animate-pulse' : ''}`}
      style={{
        width: width,
        height: height,
        backgroundColor: backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="font-medium text-center leading-tight">{data.label}</div>
      <Handle type="target" position="left" />
      <Handle type="source" position="right" />
    </div>
  );
};

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
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);

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
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    setShowPropertiesPanel(true);
  }, []);

  // Handle background click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
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

  // Update nodes with selected state
  const nodesWithSelection = nodes.map((node) => ({
    ...node,
    selected: node.id === selectedNodeId,
  }));

  // Get selected node for properties panel
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        onAddNode={handleAddNode}
        onDeleteNode={handleDeleteNode}
        selectedNodeId={selectedNodeId}
      />
      
      {/* React Flow */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodesWithSelection}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
        >
          <Controls />
          <MiniMap zoomable pannable />
        </ReactFlow>
      </div>

      {/* Properties Panel */}
      {showPropertiesPanel && (
        <PropertiesPanel
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
          onClose={() => setShowPropertiesPanel(false)}
        />
      )}
    </div>
  );
}
