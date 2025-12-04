import React from "react";
import { useMerge } from "../../context/MergeContext";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import MergedUI from "./MergedUI"; // ✅ clean separate UI

const Merged: React.FC = () => {
  const { mergedSections, clearAll, deleteSection, reorderSections } = useMerge();

  // 🟩 Drag and drop reorder handler
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderSections(result.source.index, result.destination.index);
  };

  // 🟩 Generate merged Word file
  const generateMergedDocx = async () => {
    if (mergedSections.length === 0) {
      alert("No sections added yet!");
      return;
    }

    const children: Paragraph[] = [];

    mergedSections.forEach((data, index) => {
      if (!data) return;

      const spacingValue =
        data.lineSpacing && !isNaN(data.lineSpacing) ? data.lineSpacing : 2.0;

      // ✅ Add a page break between sections (except first)
      if (index > 0) {
        children.push(new Paragraph({ pageBreakBefore: true }));
      }

      // ✅ Add section title
      if (data.title && data.title.trim()) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, line: spacingValue * 240, after: 200 },
            children: [
              new TextRun({
                text: data.title.toUpperCase(),
                bold: true,
                size: (data.titleSize || 14) * 2,
                font: data.fontFamily || "Times New Roman",
              }),
            ],
          })
        );
      }

      // ✅ Preserve pre-formatted paragraphs if available
      if (data.structuredParagraphs && data.structuredParagraphs.length > 0) {
        data.structuredParagraphs.forEach((p: Paragraph) => children.push(p));
        return;
      }

      // ✅ Fallback — split plain text paragraphs with spacing and formatting
      if (data.paragraphs && typeof data.paragraphs === "string") {
        data.paragraphs
          .split(/\r?\n\s*\r?\n|[\r\n]+/)
          .filter((p: string) => p.trim() !== "")
          .forEach((p: string) => {
            children.push(
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { before: 0, after: 160, line: spacingValue * 240 }, // 8pt after
                indent: { firstLine: 720 },
                children: [
                  new TextRun({
                    text: p.trim(),
                    size: (data.bodySize || 12) * 2,
                    font: data.fontFamily || "Times New Roman",
                  }),
                ],
              })
            );
          });
      } else {
        // Empty fallback paragraph
        children.push(new Paragraph({ spacing: { after: 200 } }));
      }
    });

    // ✅ Build the final DOCX
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: { width: 11907, height: 16839 },
              margin: { top: 1440, right: 1440, bottom: 1440, left: 2160 },
            },
          },
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Merged_Report.docx");
  };

  // ✅ Render the UI
  return (
    <MergedUI
      sections={mergedSections}
      onDelete={deleteSection}
      onDragEnd={handleDragEnd}
      onGenerate={generateMergedDocx}
      onClear={clearAll}
    />
  );
};

export default Merged;
