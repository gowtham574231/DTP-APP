import React, { useState } from "react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  PageBreak,
} from "docx";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import mammoth from "mammoth";

type Cell = { text: string; colSpan: number; rowSpan: number };
type Section = {
  heading: string;
  rows: Cell[][];
  paragraph: string;
  figureCaption: string;
  imageData?: ArrayBuffer | null;
};

interface ResultsProps {
  onTablesExtracted: (tables: { number: string; title: string; page: string }[]) => void;
  onFiguresExtracted: (figures: { number: string; caption: string; page: string }[]) => void;
}

const Results: React.FC<ResultsProps> = ({
  onTablesExtracted,
  onFiguresExtracted,
}) => {
  const [title] = useState("RESULTS");
  const [sections, setSections] = useState<Section[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("");

  // --- Extract tables from HTML ---
  const extractSectionsFromHtml = (html: string): Section[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const tables = Array.from(doc.querySelectorAll("table"));
    const secs: Section[] = [];

    tables.forEach((tableEl, idx) => {
      const heading =
        tableEl.previousElementSibling?.textContent?.trim() ||
        `Table ${idx + 1}`;
      const paragraph =
        tableEl.nextElementSibling?.textContent?.trim() || "";
      const cleanHeading = heading.replace(/^Table\s*\d*[:\-]?\s*/i, "").trim();
      const figureCaption = `Figure ${idx + 1}: Representing ${cleanHeading}`;

      const rEls = Array.from(
        tableEl.querySelectorAll(":scope > tbody > tr, :scope > tr")
      );
      const grid: Cell[][] = [];
      const occupancy: number[] = [];

      rEls.forEach((tr) => {
        const cEls = Array.from(tr.querySelectorAll("th,td"));
        const row: Cell[] = [];
        let colIndex = 0;

        const pushCellAt = (cell: Cell) => {
          while (occupancy[colIndex] && occupancy[colIndex] > 0) colIndex++;
          for (let i = 0; i < cell.colSpan; i++) {
            if (cell.rowSpan > 1) {
              const pos = colIndex + i;
              occupancy[pos] = Math.max(occupancy[pos] || 0, cell.rowSpan - 1);
            }
          }
          row.push(cell);
          colIndex += cell.colSpan;
        };

        cEls.forEach((c) => {
          const colSpan = parseInt(c.getAttribute("colspan") || "1", 10);
          const rowSpan = parseInt(c.getAttribute("rowspan") || "1", 10);
          const text = (c.textContent || "").trim();
          pushCellAt({ text, colSpan, rowSpan });
        });

        for (let i = 0; i < occupancy.length; i++) {
          if (occupancy[i] && occupancy[i] > 0) occupancy[i]--;
        }

        grid.push(row);
      });

      secs.push({
        heading: cleanHeading,
        rows: grid,
        paragraph,
        figureCaption,
        imageData: null,
      });
    });

    return secs;
  };

  // --- Handle file upload ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSections([]);
    setStatusMessage("Processing file...");

    const arrayBuffer = await file.arrayBuffer();
    const zip = new PizZip(arrayBuffer);
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

    const parsed = extractSectionsFromHtml(html);

    const tableList = parsed.map((sec, i) => ({
      number: `${i + 1}`,
      title: sec.heading,
      page: "",
    }));

    const figureList = parsed.map((sec, i) => ({
      number: `${i + 1}`,
      caption: sec.figureCaption,
      page: "",
    }));

    onTablesExtracted(tableList);
    onFiguresExtracted(figureList);

    setSections(parsed);
    setStatusMessage(`File processed successfully. Found ${parsed.length} table(s).`);
  };

  // --- Generate Word File ---
  const handleGenerateWord = async () => {
    if (sections.length === 0) {
      console.error("Upload a .docx file first!");
      return;
    }

    const children: any[] = [];

    // Title
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
         spacing: { before: 200, after: 160, line: 480 },
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 28,
            font: "Times New Roman",
          }),
        ],
      })
    );

    // --- Loop through tables ---
    sections.forEach((sec, index) => {
      const tableTitle = `Table ${index + 1}: ${sec.heading}`;

      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
           spacing: { before: 200, after: 160, line: 480 },
          children: [
            new TextRun({
              text: tableTitle,
              bold: true,
              size: 26,
              font: "Times New Roman",
            }),
          ],
        })
      );

      // Define fixed width for columns (in DXA units)
      const defaultColWidth = 1800; // ~1.5 inch per column

      const tableRows = sec.rows.map(
        (r) =>
          new TableRow({
            children: r.map(
              (cell) =>
                new TableCell({
                  columnSpan: cell.colSpan > 1 ? cell.colSpan : undefined,
                  rowSpan: cell.rowSpan > 1 ? cell.rowSpan : undefined,
                  width: { size: defaultColWidth * cell.colSpan, type: WidthType.DXA },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                  },
                  children: [
                    new Paragraph({
                       spacing: { before: 200, after: 160, line: 480 },
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: cell.text,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                })
            ),
          })
      );

      children.push(
        new Table({
          alignment: AlignmentType.CENTER,
          layout: "fixed",
          width: { size: 9000, type: WidthType.DXA }, // total table width (~6.25")
          rows: tableRows,
        })
      );

      // Paragraph under table
      if (sec.paragraph) {
        children.push(
          new Paragraph({
            
            alignment: AlignmentType.JUSTIFIED,
            indent: { firstLine: 720 },
            spacing: { before: 200, after: 160, line: 480 },
            children: [
              new TextRun({
                text: sec.paragraph,
                size: 24,
                font: "Times New Roman",
              }),
            ],
          })
        );
      }

      // Figure caption
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
           spacing: { before: 200, after: 160, line: 480 },
          children: [
            new TextRun({
              text: sec.figureCaption,
              bold: true,
              size: 24,
              font: "Times New Roman",
            }),
          ],
        })
      );

      if (index < sections.length - 1) {
        children.push(new Paragraph({ children: [new PageBreak()] }));
      }
    });

    // Create Word Document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 2160 } },
          },
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Results_with_Graphs.docx");
  };

  // --- UI ---
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 font-[Times_New_Roman] text-gray-900">
      <h1 className="text-3xl font-bold text-center mb-8">{title}</h1>

      <div className="flex justify-center mb-6">
        <input
          type="file"
          accept=".docx"
          onChange={handleFileUpload}
          className="border border-gray-400 rounded-md p-2 cursor-pointer hover:bg-gray-100"
        />
      </div>

      {statusMessage && (
        <p className="text-center text-sm text-gray-700 mb-6">{statusMessage}</p>
      )}

      {sections.length > 0 && (
        <div className="flex flex-col items-center space-y-10">
          {sections.map((sec, i) => (
            <div
              key={i}
              className="bg-white w-[794px] h-[1123px] shadow-md border border-gray-300 p-10 relative"
            >
              <div className="absolute top-4 right-6 text-xs text-gray-400">
                Page {i + 1}
              </div>

              <h3 className="text-center font-bold mb-3 text-[18px]">
                Table {i + 1}: {sec.heading}
              </h3>

              <table className="w-full table-fixed border-collapse border border-black text-[15px]">
                <tbody>
                  {sec.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          colSpan={cell.colSpan}
                          rowSpan={cell.rowSpan}
                          className="border border-black px-2 py-2 text-center align-middle break-words"
                        >
                          {cell.text}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {sec.paragraph && (
                <p className="text-justify mt-4 mb-3 text-[15px] indent-8 leading-[1.8]">
                  {sec.paragraph}
                </p>
              )}

              <p className="text-center font-bold mt-3 text-[15px]">
                {sec.figureCaption}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-10">
        <button
          onClick={handleGenerateWord}
          disabled={sections.length === 0}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          Generate Word File
        </button>
      </div>
    </div>
  );
};

export default Results;
