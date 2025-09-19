import { useState, useEffect } from 'react';
import { Settings, Move, Type, Square, Play, Pause } from 'lucide-react';

const PropertiesPanel = ({ selectedNode, onUpdateNode, onClose }) => {
  const [properties, setProperties] = useState({
    label: '',
    type: 'default',
    width: 150,
    height: 50,
    x: 0,
    y: 0,
    animated: false,
    backgroundColor: '#6B7280', // Default gray color
  });

  // Update properties when selectedNode changes
  useEffect(() => {
    if (selectedNode) {
      setProperties({
        label: selectedNode.data?.label || '',
        type: selectedNode.type || 'default',
        width: selectedNode.data?.width || 150,
        height: selectedNode.data?.height || 50,
        x: selectedNode.position?.x || 0,
        y: selectedNode.position?.y || 0,
        animated: selectedNode.data?.animated || false,
        backgroundColor: selectedNode.data?.backgroundColor || '#6B7280',
      });
    }
  }, [selectedNode]);

  const handlePropertyChange = (property, value) => {
    const newProperties = { ...properties, [property]: value };
    setProperties(newProperties);
  };

  const handleApplyChanges = () => {
    if (selectedNode) {
      const updatedNode = {
        ...selectedNode,
        type: properties.type,
        position: { x: properties.x, y: properties.y },
        data: {
          ...selectedNode.data,
          label: properties.label,
          animated: properties.animated,
          width: properties.width,
          height: properties.height,
          backgroundColor: properties.backgroundColor,
        },
      };
      onUpdateNode(updatedNode);
    }
  };

  const handleReset = () => {
    if (selectedNode) {
      setProperties({
        label: selectedNode.data?.label || '',
        type: selectedNode.type || 'default',
        width: selectedNode.data?.width || 150,
        height: selectedNode.data?.height || 50,
        x: selectedNode.position?.x || 0,
        y: selectedNode.position?.y || 0,
        animated: selectedNode.data?.animated || false,
        backgroundColor: selectedNode.data?.backgroundColor || '#6B7280',
      });
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 shadow-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-sm">Select a node to edit properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">Node ID: {selectedNode.id}</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Label */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Type className="w-4 h-4" />
            Label
          </label>
          <input
            type="text"
            value={properties.label}
            onChange={(e) => handlePropertyChange('label', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter node label"
          />
        </div>

        {/* Type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Square className="w-4 h-4" />
            Type
          </label>
          <select
            value={properties.type}
            onChange={(e) => handlePropertyChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="default">Default</option>
            <option value="input">Input</option>
            <option value="output">Output</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Position */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Move className="w-4 h-4" />
            Position
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">X</label>
              <input
                type="number"
                value={properties.x}
                onChange={(e) => handlePropertyChange('x', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Y</label>
              <input
                type="number"
                value={properties.y}
                onChange={(e) => handlePropertyChange('y', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Square className="w-4 h-4" />
            Size
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Width</label>
              <input
                type="number"
                value={properties.width}
                onChange={(e) => handlePropertyChange('width', parseInt(e.target.value) || 150)}
                min="50"
                max="500"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Height</label>
              <input
                type="number"
                value={properties.height}
                onChange={(e) => handlePropertyChange('height', parseInt(e.target.value) || 50)}
                min="30"
                max="300"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2">Background Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={properties.backgroundColor}
              onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={properties.backgroundColor}
              onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="#6B7280"
            />
          </div>
        </div>

        {/* Animated */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            {properties.animated ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            Animation
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={properties.animated}
                onChange={(e) => handlePropertyChange('animated', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable animation</span>
            </label>
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2">Preview</label>
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <div
              className="mx-auto text-white text-center rounded px-3 py-2 text-sm"
              style={{
                width: Math.min(properties.width, 200),
                height: Math.min(properties.height, 100),
                backgroundColor: properties.backgroundColor,
                lineHeight: `${Math.min(properties.height, 100)}px`,
              }}
            >
              {properties.label || 'Preview'}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={handleApplyChanges}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Apply Changes
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Reset
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center">
          Changes will be applied immediately
        </p>
      </div>
    </div>
  );
};

export default PropertiesPanel;
