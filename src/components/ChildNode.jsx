import { Handle } from "@xyflow/react";

// Default Node Component
export const DefaultNode = ({ data }) => {
  return (
    <div className="transition-all">
      <div className="font-medium text-center leading-tight">{data.label}</div>
      <Handle type="target" position="left" />
      <Handle type="source" position="right" />
    </div>
  );
};

// Input Node Component
export const InputNode = ({ data }) => {
  return (
    <div className="transition-all">
      <div className="font-medium text-center leading-tight">{data.label}</div>
      <Handle type="source" position="right" />
    </div>
  );
};

// Output Node Component
export const OutputNode = ({ data }) => {
  return (
    <div className="transition-all">
      <div className="font-medium text-center leading-tight">{data.label}</div>
      <Handle type="target" position="left" />
    </div>
  );
};

// Custom Node Component
export const CustomNode = ({ data, selected }) => {
  const backgroundColor = data?.backgroundColor || "#000000";

  return (
    <div
      className={`px-4 py-3 rounded-lg text-white transition-all ${
        selected ? "ring-2 ring-gray-500 shadow-lg" : "hover:opacity-90"
      }`}
      style={{
        backgroundColor: backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="font-medium text-center leading-tight">{data.label}</div>
      <Handle type="target" position="left" />
      <Handle type="source" position="right" />
    </div>
  );
};
