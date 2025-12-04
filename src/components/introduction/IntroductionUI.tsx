import React from "react";

interface Props {
  title: string;
  setTitle: (value: string) => void;
  paragraphs: string;
  setParagraphs: (value: string) => void;
  fontFamily: string;
  setFontFamily: (value: string) => void;
  titleSize: number;
  setTitleSize: (value: number) => void;
  bodySize: number;
  setBodySize: (value: number) => void;
  lineSpacing: number;
  setLineSpacing: (value: number) => void;
  onGenerate: () => void;
  onMerge: () => void; // ✅ new prop added
}

const IntroductionUI: React.FC<Props> = ({
  title,
  setTitle,
  paragraphs,
  setParagraphs,
  fontFamily,
  setFontFamily,
  titleSize,
  setTitleSize,
  bodySize,
  setBodySize,
  lineSpacing,
  setLineSpacing,
  onGenerate,
  onMerge, // ✅ destructured new prop
}) => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white shadow-lg rounded-2xl p-8 max-w-3xl mx-auto mt-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Introduction
      </h2>

      {/* Title Input */}
      <label className="block mb-2 font-semibold text-gray-700">Section Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-3 mb-5 rounded-lg focus:ring-2 focus:ring-blue-400"
      />

      {/* Paragraph Input */}
      <label className="block mb-2 font-semibold text-gray-700">Paragraphs</label>
      <textarea
        className="w-full border p-3 mb-6 rounded-lg h-48 resize-none focus:ring-2 focus:ring-blue-400"
        value={paragraphs}
        onChange={(e) => setParagraphs(e.target.value)}
        placeholder="Enter your introduction paragraphs..."
      />

      {/* Formatting Options */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Font Family</label>
          <select
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
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
          <label className="block mb-2 font-semibold text-gray-700">Title Size</label>
          <input
            type="number"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            value={titleSize}
            onChange={(e) => setTitleSize(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">Body Size</label>
          <input
            type="number"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            value={bodySize}
            onChange={(e) => setBodySize(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">Line Spacing</label>
          <select
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
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

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onGenerate}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition-all duration-200"
        >
          Generate Word File
        </button>

        <button
          onClick={onMerge}
          className="bg-green-600 text-white py-3 px-8 rounded-lg font-semibold text-lg shadow hover:bg-green-700 transition-all duration-200"
        >
          Merge
        </button>
      </div>
    </div>
  );
};

export default IntroductionUI;
