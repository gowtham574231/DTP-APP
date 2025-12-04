import React, { useState, useEffect } from "react";

interface ObjectivesProps {
  onDataChange: (data: {
    objectivesIntro: string;
    primaryObjectives: string[];
    secondaryObjectives: string[];
  }) => void;
}

const Objectives: React.FC<ObjectivesProps> = ({ onDataChange }) => {
  const [objectivesIntro, setObjectivesIntro] = useState("");
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const [includePrimary, setIncludePrimary] = useState(false);
  const [includeSecondary, setIncludeSecondary] = useState(false);

  useEffect(() => {
    onDataChange({
      objectivesIntro,
      primaryObjectives: includePrimary
        ? primary.split(/\r?\n/).filter((p) => p.trim() !== "")
        : [],
      secondaryObjectives: includeSecondary
        ? secondary.split(/\r?\n/).filter((p) => p.trim() !== "")
        : [],
    });
  }, [objectivesIntro, primary, secondary, includePrimary, includeSecondary]);

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold text-center mb-4">OBJECTIVES</h2>

      {/* Intro Paragraph */}
      <textarea
        className="w-full border p-2 mb-4 rounded h-20 leading-relaxed"
        value={objectivesIntro}
        onChange={(e) => setObjectivesIntro(e.target.value)}
        placeholder="Enter general objectives introduction..."
      />

      {/* Primary Objectives */}
      <div className="flex items-center mb-2 space-x-2">
        <input
          type="checkbox"
          checked={includePrimary}
          onChange={(e) => setIncludePrimary(e.target.checked)}
          className="w-5 h-5 accent-blue-600"
        />
        <label className="font-semibold">Include Primary Objectives</label>
      </div>

      {includePrimary && (
        <textarea
          className="w-full border p-2 mb-4 rounded h-24 leading-relaxed"
          value={primary}
          onChange={(e) => setPrimary(e.target.value)}
          placeholder="Each line = one primary objective..."
        />
      )}

      {/* Secondary Objectives */}
      <div className="flex items-center mb-2 space-x-2">
        <input
          type="checkbox"
          checked={includeSecondary}
          onChange={(e) => setIncludeSecondary(e.target.checked)}
          className="w-5 h-5 accent-blue-600"
        />
        <label className="font-semibold">Include Secondary Objectives</label>
      </div>

      {includeSecondary && (
        <textarea
          className="w-full border p-2 mb-4 rounded h-24 leading-relaxed"
          value={secondary}
          onChange={(e) => setSecondary(e.target.value)}
          placeholder="Each line = one secondary objective..."
        />
      )}
    </div>
  );
};

export default Objectives;
