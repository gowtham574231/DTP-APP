import React from "react";
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
} from "docx";
import { saveAs } from "file-saver";

interface TableItem {
  number: string;
  title: string;
  page: string;
}

interface ListOfTablesProps {
  tables: TableItem[];
}

const ListOfTables: React.FC<ListOfTablesProps> = ({ tables }) => {
  const handleDownloadWord = async () => {
    if (!tables || tables.length === 0) {
      alert("No tables to export.");
      return;
    }

    // Header row
    const headerRow = new TableRow({
      children: [
        new TableCell({
           margins: {
    top: 0,
    bottom: 0,
    left: 100, // ✅ reduce this if you want it tighter (e.g., 50)
    right: 100,
  },
          width: { size: 20, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
             spacing: { before: 160, line: 480 },
              children: [
                new TextRun({
                  text: "TABLE NO",
                  bold: true,
                  font: "Times New Roman",
                  size: 24,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
           margins: {
    top: 0,
    bottom: 0,
    left: 100, // ✅ reduce this if you want it tighter (e.g., 50)
    right: 100,
  },
          width: { size: 60, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 160, line: 480 },
              children: [
                new TextRun({
                  text: "TITLE",
                  bold: true,
                  font: "Times New Roman",
                  size: 24,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
           margins: {
    top: 0,
    bottom: 0,
    left: 100, // ✅ reduce this if you want it tighter (e.g., 50)
    right: 100,
  },
          width: { size: 20, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 160, line: 480 },
              children: [
                new TextRun({
                  text: "PAGE NO",
                  bold: true,
                  font: "Times New Roman",
                  size: 24,
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // Table rows with plain numbers (1, 2, 3)
    const dataRows = tables.map((t, i) =>
      new TableRow({
        children: [
          new TableCell({
             margins: {
    top: 0,
    bottom: 0,
    left: 100, // ✅ reduce this if you want it tighter (e.g., 50)
    right: 100,
  },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 160, line: 480 },
                children: [
                  new TextRun({
                    text: `${i + 1}`,
                    font: "Times New Roman",
                    size: 24,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
             margins: {
    top: 0,
    bottom: 0,
    left: 100, // ✅ reduce this if you want it tighter (e.g., 50)
    right: 100,
  },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 160, line: 480 },
                children: [
                  new TextRun({
                    text: t.title, // ✅ only the title, not all caps
                    font: "Times New Roman",
                    size: 24,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
             margins: {
    top: 0,
    bottom: 0,
    left: 100, // ✅ reduce this if you want it tighter (e.g., 50)
    right: 100,
  },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 160, line: 480 },
                children: [
                  new TextRun({
                    text: t.page || "",
                    font: "Times New Roman",
                    size: 24,
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );

    // ✅ Create Word Document with heading in FULL CAPS
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 2.54 cm
                right: 1440, // 2.54 cm
                bottom: 1440, // 2.54 cm
                left: 2160, // 3.81 cm
              },
            },
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before:160,after: 400 },
              children: [
                new TextRun({
                  text: "LIST OF TABLES", // ✅ FULL CAPS heading
                  bold: true,
                  font: "Times New Roman",
                  size: 28,
                }),
              ],
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [headerRow, ...dataRows],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "List_of_Tables.docx");
  };

  return (
    <div className="p-6 font-[Times_New_Roman]">
      <h2 className="text-2xl font-semibold mb-4 uppercase text-center">List of Tables</h2>

      <table className="w-full border border-gray-400 border-collapse mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-400 px-3 py-2 text-center">
              TABLE NO
            </th>
            <th className="border border-gray-400 px-3 py-2 text-left text-center">TITLE</th>
            <th className="border border-gray-400 px-3 py-2 text-center">
              PAGE NO
            </th>
          </tr>
        </thead>
        <tbody>
          {tables.length > 0 ? (
            tables.map((t, i) => (
              <tr key={i}>
                <td className="border border-gray-400 px-3 py-2 text-center">
                  {i + 1}
                </td>
                <td className="border border-gray-400 px-3 py-2">{t.title}</td>
                <td className="border border-gray-400 px-3 py-2">{t.page}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="text-center border border-gray-400 py-3 text-gray-600"
              >
                No tables found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Download Word button */}
      {tables.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleDownloadWord}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Download Word
          </button>
        </div>
      )}
    </div>
  );
};

export default ListOfTables;
