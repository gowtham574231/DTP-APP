import React, { useState } from "react";

type Cell = { text: string; colSpan: number; rowSpan: number };
type Section = {
  heading: string;
  rows: Cell[][];
  paragraph: string;
  figureCaption: string;
};

interface Props {
  title: string;
  sections: Section[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateWord: () => void;
}

const ResultsUI: React.FC<Props> = ({
  title,
  sections,
  onFileUpload,
  onGenerateWord,
}) => {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
    onFileUpload(e);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-10 border border-gray-200">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-10 font-[Times_New_Roman] uppercase tracking-wide">
          {title}
        </h2>

        {/* Upload Box */}
        <div className="flex justify-center mb-6">
          <label
            htmlFor="file-upload"
            className="relative flex flex-col items-center justify-center w-full max-w-md border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-100 transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center gap-3 p-3">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </div>
              <span className="text-black-700 font-[Times_New_Roman] text-base">
                <strong className="text-indigo-600">Choose File</strong> to upload (.docx)
              </span>
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".docx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>

        {/* File name display */}
        {fileName && (
          <p className="text-center text-gray-600 text-sm font-[Times_New_Roman] italic mb-6">
            Selected file: <span className="font-semibold text-indigo-700">{fileName}</span>
          </p>
        )}

        {/* No tables yet */}
        {sections.length === 0 ? (
          <p className="text-center text-gray-500 italic font-[Times_New_Roman]">
            Upload a .docx file to preview results here.
          </p>
        ) : (
          sections.map((sec, idx) => (
            <div key={idx} className="mb-12">
              {/* Table title */}
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center font-[Times_New_Roman]">
                Table {idx + 1}: {sec.heading}
              </h3>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-600 text-sm font-[Times_New_Roman] table-fixed">
                  <tbody>
                    {sec.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td
                            key={`${rIdx}-${cIdx}`}
                            colSpan={cell.colSpan}
                            rowSpan={cell.rowSpan}
                            className="border border-gray-600 px-3 py-2 text-center align-middle leading-[1.8] break-words"
                            style={{ width: `${100 / row.length}%` }}
                          >
                            {cell.text || "\u00A0"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paragraph (with tab before first line) */}
              {sec.paragraph && (
                <p className="text-justify leading-[2] mt-4 mb-3 font-[Times_New_Roman] indent-8">
                  {sec.paragraph}
                </p>
              )}

              {/* Figure caption (bold, not italic) */}
              <p className="text-center text-gray-800 mt-3 font-[Times_New_Roman] font-bold">
                {sec.figureCaption}
              </p>

              {/* Divider */}
              {idx < sections.length - 1 && (
                <hr className="mt-10 border-gray-300" />
              )}
            </div>
          ))
        )}

        {/* Generate Word button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={onGenerateWord}
            className="bg-indigo-600 text-white py-3 px-10 rounded-lg font-semibold text-lg shadow-md hover:bg-indigo-700 transition-all"
          >
            Generate Word File
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsUI;
