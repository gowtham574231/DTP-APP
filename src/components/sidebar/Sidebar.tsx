import React from "react";

interface SidebarProps {
  active: string;
  onSelect: (feature: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active, onSelect }) => {
  const features = [
    "Table of Contents",
    "List of Tables",
    "List of Figures",
    "Introduction",
    "AimsAndObjectives", // ✅ key that matches your App.tsx switch
    "Discussion",
    "Summary",
    "References",
    "Results",
    "Conclusion",
    "Merged"
  ];

  return (
    <div className="w-64 h-screen bg-blue-800 text-white flex flex-col shadow-lg">
      <h1 className="text-2xl font-bold text-center py-6 border-b border-blue-600">
        DTP App
      </h1>

      <ul className="flex-1 p-4 space-y-3">
        {features.map((feature) => (
          <li key={feature}>
            <button
              onClick={() => onSelect(feature)}
              className={`w-full text-left p-3 rounded-lg font-medium transition-all ${
                active === feature
                  ? "bg-blue-600 text-white shadow-inner"
                  : "hover:bg-blue-700"
              }`}
            >
              {feature === "AimsAndObjectives" ? "Aims & Objectives" : feature}
            </button>
          </li>
        ))}
      </ul>

      <div className="p-4 text-sm border-t border-blue-600 text-center opacity-80">
        © 2025 Gautham
      </div>
    </div>
  );
};

export default Sidebar;
