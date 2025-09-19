import { useState } from 'react';
import { Plus, Trash2, Square, Circle, Triangle } from 'lucide-react';

const Sidebar = ({ onAddNode, onDeleteNode, selectedNodeId }) => {
  const [isOpen, setIsOpen] = useState(true);

  const nodeTypes = [
    {
      id: 'input',
      label: 'Input Node',
      icon: <Circle className="w-4 h-4" />,
      color: 'bg-blue-500',
    },
    {
      id: 'default',
      label: 'Default Node',
      icon: <Square className="w-4 h-4" />,
      color: 'bg-gray-500',
    },
    {
      id: 'output',
      label: 'Output Node',
      icon: <Circle className="w-4 h-4" />,
      color: 'bg-green-500',
    },
    {
      id: 'custom',
      label: 'Custom Node',
      icon: <Triangle className="w-4 h-4" />,
      color: 'bg-red-500',
    },
  ];

  const handleAddNode = (nodeType) => {
    const defaultColors = {
      input: '#3B82F6',
      default: '#6B7280',
      output: '#10B981',
      custom: '#EF4444',
    };

    const newNode = {
      id: `node-${Date.now()}`,
      type: nodeType,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`,
        width: 150,
        height: 50,
        backgroundColor: defaultColors[nodeType] || '#6B7280',
        animated: false,
      },
    };
    onAddNode(newNode);
  };

  const handleDeleteNode = () => {
    if (selectedNodeId) {
      onDeleteNode(selectedNodeId);
    }
  };

  return (
    <div className={`bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {isOpen && (
            <h2 className="text-lg font-semibold text-gray-800">Node Tools</h2>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-4 space-y-6">
          {/* Add Nodes Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Add Nodes</h3>
            <div className="space-y-2">
              {nodeTypes.map((nodeType) => (
                <button
                  key={nodeType.id}
                  onClick={() => handleAddNode(nodeType.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
                >
                  <div className={`p-2 rounded-md ${nodeType.color} text-white`}>
                    {nodeType.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {nodeType.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Delete Node Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Delete Node</h3>
            <button
              onClick={handleDeleteNode}
              disabled={!selectedNodeId}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                selectedNodeId
                  ? 'border-red-200 hover:border-red-300 hover:bg-red-50 text-red-700 hover:text-red-800'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className={`p-2 rounded-md ${
                selectedNodeId ? 'bg-red-500' : 'bg-gray-300'
              } text-white`}>
                <Trash2 className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">
                {selectedNodeId ? 'Delete Selected' : 'No Node Selected'}
              </span>
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-xs font-medium text-blue-800 mb-1">Instructions</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Click "Add Nodes" to create new nodes</li>
              <li>• Click on a node to select it</li>
              <li>• Use "Delete Selected" to remove nodes</li>
            </ul>
          </div>
        </div>
      )}

      {/* Collapsed State */}
      {!isOpen && (
        <div className="p-2 space-y-2">
          <button
            onClick={() => handleAddNode('default')}
            className="w-full p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Add Default Node"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleDeleteNode}
            disabled={!selectedNodeId}
            className={`w-full p-2 rounded-md transition-colors ${
              selectedNodeId
                ? 'hover:bg-red-100 text-red-600'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            title="Delete Selected Node"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
