// src/components/conclusion/ConclusionUI.tsx
import React from "react";

interface ConclusionUIProps {
  title: string;
  paragraphs: string;
  fontFamily: string;
  titleSize: number;
  bodySize: number;
  lineSpacing: number;
  setTitle: (v: string) => void;
  setParagraphs: (v: string) => void;
  setFontFamily: (v: string) => void;
  setTitleSize: (v: number) => void;
  setBodySize: (v: number) => void;
  setLineSpacing: (v: number) => void;
  generateDocx: () => void;
  onMerge: () => void; // ✅ added prop
}

const ConclusionUI: React.FC<ConclusionUIProps> = ({
  title,
  paragraphs,
  fontFamily,
  titleSize,
  bodySize,
  lineSpacing,
  setTitle,
  setParagraphs,
  setFontFamily,
  setTitleSize,
  setBodySize,
  setLineSpacing,
  generateDocx,
  onMerge,
}) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold text-center mb-4">Conclusion</h2>

      {/* Title */}
      <label className="block mb-2 font-semibold">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      />

      {/* Paragraphs */}
      <label className="block mb-2 font-semibold">Paragraphs</label>
      <textarea
        className="w-full border p-2 mb-4 rounded h-48"
        value={paragraphs}
        onChange={(e) => setParagraphs(e.target.value)}
        placeholder="Enter conclusion content..."
      />

      {/* Formatting Controls */}
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

      {/* ✅ Side-by-side Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={generateDocx}
          className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all"
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

export default ConclusionUI;
