import { useState, useEffect } from 'react';
import { Settings, Type, ArrowRight, Palette, Zap } from 'lucide-react';

const EdgePropertiesPanel = ({ selectedEdge, onUpdateEdge, onClose }) => {
  const [properties, setProperties] = useState({
    label: '',
    type: 'default',
    animated: false,
    style: {
      stroke: '#000000',
      strokeWidth: 2,
    },
    markerEnd: {
      type: 'arrowclosed',
      color: '#000000',
    },
  });

  // Update properties when selectedEdge changes
  useEffect(() => {
    if (selectedEdge) {
      // Determine arrow type based on existing markers
      let arrowType = 'default';
      if (selectedEdge.markerEnd && selectedEdge.markerStart) {
        arrowType = 'bidirectional';
      } else if (selectedEdge.markerEnd) {
        arrowType = 'arrowclosed';
      }

      const strokeColor = selectedEdge.style?.stroke || '#000000';

      setProperties({
        label: selectedEdge.label || '',
        type: selectedEdge.type || 'default',
        animated: selectedEdge.animated || false,
        style: {
          stroke: strokeColor,
          strokeWidth: selectedEdge.style?.strokeWidth || 2,
        },
        markerEnd: {
          type: arrowType,
          color: strokeColor, // Always use stroke color
        },
      });
    }
  }, [selectedEdge]);

  const handlePropertyChange = (property, value) => {
    const newProperties = { ...properties, [property]: value };
    setProperties(newProperties);
  };

  const handleStyleChange = (styleProperty, value) => {
    const newProperties = {
      ...properties,
      style: {
        ...properties.style,
        [styleProperty]: value,
      },
    };
    
    // If stroke color changes, update arrow color too
    if (styleProperty === 'stroke') {
      newProperties.markerEnd = {
        ...newProperties.markerEnd,
        color: value,
      };
    }
    
    setProperties(newProperties);
  };

  const handleMarkerEndChange = (markerProperty, value) => {
    const newProperties = {
      ...properties,
      markerEnd: {
        ...properties.markerEnd,
        [markerProperty]: value,
      },
    };
    setProperties(newProperties);
  };

  const handleApplyChanges = () => {
    if (selectedEdge) {
      let markerEnd = null;
      let markerStart = null;
      
      // Use stroke color for all arrows, but keep arrow size independent
      const arrowColor = properties.style.stroke;
      
      // Handle different arrow types
      if (properties.markerEnd.type === 'default') {
        // No markers for smooth default
        markerEnd = null;
        markerStart = null;
      } else if (properties.markerEnd.type === 'arrowclosed') {
        // One-way arrow pointing to target
        markerEnd = {
          type: 'arrowclosed',
          color: arrowColor,
          width: 20, // Fixed arrow size, independent of stroke width
          height: 20,
        };
        markerStart = null;
      } else if (properties.markerEnd.type === 'bidirectional') {
        // Two-way arrows
        markerEnd = {
          type: 'arrowclosed',
          color: arrowColor,
          width: 20, // Fixed arrow size, independent of stroke width
          height: 20,
        };
        markerStart = {
          type: 'arrowclosed',
          color: arrowColor,
          width: 20, // Fixed arrow size, independent of stroke width
          height: 20,
        };
      }

      const updatedEdge = {
        ...selectedEdge,
        type: properties.type,
        label: properties.label,
        animated: properties.animated,
        style: properties.style,
        markerEnd,
        markerStart,
      };
      onUpdateEdge(updatedEdge);
    }
  };

  const handleReset = () => {
    if (selectedEdge) {
      // Determine arrow type based on existing markers
      let arrowType = 'default';
      if (selectedEdge.markerEnd && selectedEdge.markerStart) {
        arrowType = 'bidirectional';
      } else if (selectedEdge.markerEnd) {
        arrowType = 'arrowclosed';
      }

      const strokeColor = selectedEdge.style?.stroke || '#000000';

      setProperties({
        label: selectedEdge.label || '',
        type: selectedEdge.type || 'default',
        animated: selectedEdge.animated || false,
        style: {
          stroke: strokeColor,
          strokeWidth: selectedEdge.style?.strokeWidth || 2,
        },
        markerEnd: {
          type: arrowType,
          color: strokeColor, // Always use stroke color
        },
      });
    }
  };

  if (!selectedEdge) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 shadow-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-sm">Select an edge to edit properties</p>
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
            <h2 className="text-lg font-semibold text-gray-800">Edge Properties</h2>
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
        <p className="text-sm text-gray-500 mt-1">Edge ID: {selectedEdge.id}</p>
        <p className="text-xs text-gray-400 mt-1">
          {selectedEdge.source} → {selectedEdge.target}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* 1. Label */}
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
            placeholder="Enter edge label"
          />
        </div>

        {/* 2. Type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <ArrowRight className="w-4 h-4" />
            Type
          </label>
          <select
            value={properties.type}
            onChange={(e) => handlePropertyChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="default">Default</option>
            <option value="straight">Straight</option>
            <option value="step">Step</option>
            <option value="smoothstep">Smooth Step</option>
            <option value="bezier">Bezier</option>
          </select>
        </div>

        {/* 3. Arrow Type */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2">Arrow Type</label>
          <select
            value={properties.markerEnd.type}
            onChange={(e) => handleMarkerEndChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="default">Default (Smooth)</option>
            <option value="arrowclosed">One-way Arrow (Target)</option>
            <option value="bidirectional">Two-way Arrow (Both)</option>
          </select>
        </div>

        {/* 4. Stroke Width */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2">Stroke Width</label>
          <select
            value={properties.style.strokeWidth}
            onChange={(e) => handleStyleChange('strokeWidth', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>Light (1px)</option>
            <option value={2}>Regular (2px)</option>
            <option value={3}>Strong (3px)</option>
          </select>
        </div>

        {/* 5. Stroke Color */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Palette className="w-4 h-4" />
            Stroke Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={properties.style.stroke}
              onChange={(e) => handleStyleChange('stroke', e.target.value)}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={properties.style.stroke}
              onChange={(e) => handleStyleChange('stroke', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* 6. Animation */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Zap className="w-4 h-4" />
            Animation
          </label>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="animated"
              checked={properties.animated}
              onChange={(e) => handlePropertyChange('animated', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="animated" className="text-sm text-gray-700">
              Animated
            </label>
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

export default EdgePropertiesPanel;
