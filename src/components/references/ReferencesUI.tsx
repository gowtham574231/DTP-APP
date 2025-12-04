import React from "react";

interface ReferencesUIProps {
  title: string;
  references: string;
  fontFamily: string;
  titleSize: number;
  bodySize: number;
  lineSpacing: number;
  setTitle: (v: string) => void;
  setReferences: (v: string) => void;
  setFontFamily: (v: string) => void;
  setTitleSize: (v: number) => void;
  setBodySize: (v: number) => void;
  setLineSpacing: (v: number) => void;
  generateDocx: () => void;
  onMerge: () => void;
}

const ReferencesUI: React.FC<ReferencesUIProps> = ({
  title,
  references,
  fontFamily,
  titleSize,
  bodySize,
  lineSpacing,
  setTitle,
  setReferences,
  setFontFamily,
  setTitleSize,
  setBodySize,
  setLineSpacing,
  generateDocx,
  onMerge,
}) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold text-center mb-4">References</h2>

      <label className="block mb-2 font-semibold">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      />

      <label className="block mb-2 font-semibold">References (one per line)</label>
      <textarea
        className="w-full border p-2 mb-4 rounded h-48"
        value={references}
        onChange={(e) => setReferences(e.target.value)}
        placeholder="Enter each reference on a new line..."
      />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-semibold">Font Family</label>
          <select
            className="w-full border p-2 rounded"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          >
            <option>Times New Roman</option>
            <option>Arial</option>
            <option>Calibri</option>
            <option>Georgia</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Title Size</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={titleSize}
            onChange={(e) => setTitleSize(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Body Size</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={bodySize}
            onChange={(e) => setBodySize(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Line Spacing</label>
          <select
            className="w-full border p-2 rounded"
            value={lineSpacing}
            onChange={(e) => setLineSpacing(Number(e.target.value))}
          >
            <option value={1}>1.0</option>
            <option value={1.15}>1.15</option>
            <option value={1.5}>1.5</option>
            <option value={2}>2.0</option>
          </select>
        </div>
      </div>

      {/* Buttons side by side */}
      <div className="flex justify-center gap-4">
        <button
          onClick={generateDocx}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Generate Word
        </button>

        <button
          onClick={onMerge}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all"
        >
          Merge
        </button>
      </div>
    </div>
  );
};

export default ReferencesUI;
