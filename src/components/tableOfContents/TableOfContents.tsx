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
} from "docx";
import { saveAs } from "file-saver";
import { Trash2 } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface TOCItem {
  title: string;
  page: string;
}

const TableOfContents: React.FC = () => {
  const [contents, setContents] = useState<TOCItem[]>([
    { title: "INTRODUCTION", page: "" },
    { title: "OBJECTIVES", page: "" },
    { title: "REVIEW OF LITERATURE", page: "" },
    { title: "METHODOLOGY", page: "" },
    { title: "RESULTS", page: "" },
    { title: "DISCUSSION", page: "" },
    { title: "CONCLUSION", page: "" },
    { title: "SUMMARY", page: "" },
    { title: "BIBLIOGRAPHY", page: "" },
    { title: "ANNEXURES", page: "" },
  ]);

  // Handle edit
  const handleEdit = (index: number, field: keyof TOCItem, newValue: string) => {
    const updated = [...contents];
    updated[index][field] = field === "title" ? newValue.toUpperCase() : newValue;
    setContents(updated);
  };

  // Add new section
  const handleAdd = () => {
    setContents([...contents, { title: "NEW SECTION", page: "" }]);
  };

  // Delete section
  const handleDelete = (index: number) => {
    const updated = contents.filter((_, i) => i !== index);
    setContents(updated);
  };

  // Handle drag reorder
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(contents);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setContents(items);
  };

  // Export to Word
  const handleDownloadWord = async () => {
    const headerRow = new TableRow({
      children: [
        new TableCell({
          width: { size: 12, type: WidthType.PERCENTAGE },
          margins: { left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 160, line: 480 },
              children: [
                new TextRun({
                  text: "SI NO",
                  bold: true,
                  font: "Times New Roman",
                  size: 24,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 69, type: WidthType.PERCENTAGE },
          margins: { left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 160, line: 480 },
              children: [
                new TextRun({
                  text: "CONTENTS",
                  bold: true,
                  font: "Times New Roman",
                  size: 24,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          margins: { left: 100, right: 100 },
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

    const dataRows = contents.map((item, i) => {
      return new TableRow({
        children: [
          new TableCell({
            margins: { left: 100, right: 100 },
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
                children: [new TextRun({ text: `${i + 1}`, font: "Times New Roman", size: 24 })],
              }),
            ],
          }),
          new TableCell({
            margins: { left: 100, right: 100 },
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
                children: [new TextRun({ text: item.title, font: "Times New Roman", size: 24 })],
              }),
            ],
          }),
          new TableCell({
            margins: { left: 100, right: 100 },
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
                children: [new TextRun({ text: item.page || "", font: "Times New Roman", size: 24 })],
              }),
            ],
          }),
        ],
      });
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1440, right: 1440, bottom: 1440, left: 2160 },
            },
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 240, line: 480 },
              children: [
                new TextRun({
                  text: "TABLE OF CONTENTS",
                  bold: true,
                  font: "Times New Roman",
                  size: 28,
                }),
              ],
            }),
            new Table({
              width: { size: 90, type: WidthType.PERCENTAGE },
              indent: { size: 360, type: WidthType.DXA },
              rows: [headerRow, ...dataRows],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Table_of_Contents.docx");
  };

  return (
    <div className="p-6 font-[Times_New_Roman]">
      <h2 className="text-2xl font-semibold mb-4 uppercase text-center">Table of Contents</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="toc-table">
          {(provided) => (
            <table
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="w-full border border-gray-400 border-collapse mb-6"
            >
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-400 px-3 py-2 text-center">SI NO</th>
                  <th className="border border-gray-400 px-3 py-2 text-center">CONTENTS</th>
                  <th className="border border-gray-400 px-3 py-2 text-center">PAGE NO</th>
                  <th className="border border-gray-400 px-3 py-2 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {contents.map((item, i) => (
                  <Draggable key={i.toString()} draggableId={i.toString()} index={i}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="hover:bg-gray-100 transition"
                      >
                        <td className="border border-gray-400 px-3 py-2 text-center">{i + 1}</td>
                        <td className="border border-gray-400 px-3 py-2">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleEdit(i, "title", e.target.value)}
                            className="w-full outline-none uppercase"
                          />
                        </td>
                        <td className="border border-gray-400 px-3 py-2 text-center">
                          <input
                            type="text"
                            value={item.page}
                            onChange={(e) => handleEdit(i, "page", e.target.value)}
                            className="w-16 text-center outline-none"
                          />
                        </td>
                        <td className="border border-gray-400 px-3 py-2 text-center">
                          <button
                            onClick={() => handleDelete(i)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleAdd}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
        >
          + Add Row
        </button>

        <button
          onClick={handleDownloadWord}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          Download Word
        </button>
      </div>
    </div>
  );
};

export default TableOfContents;
