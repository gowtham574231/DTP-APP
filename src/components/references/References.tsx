import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMerge } from "../../context/MergeContext";
import { Document, Packer, Paragraph, TextRun, AlignmentType, NumberFormat, LevelFormat } from "docx";
import { saveAs } from "file-saver";
import ReferencesUI from "./ReferencesUI";

const References: React.FC = () => {
  const [title, setTitle] = useState("REFERENCES");
  const [references, setReferences] = useState(""); // each line = one reference
  const [fontFamily, setFontFamily] = useState("Times New Roman");
  const [titleSize, setTitleSize] = useState(14);
  const [bodySize, setBodySize] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(2.0);

  const { addSection } = useMerge();
  const navigate = useNavigate();

  // 🟩 Generate numbered reference DOCX
  const generateDocx = async () => {
    if (!references.trim()) {
      alert("Please enter at least one reference!");
      return;
    }

    const lines = references
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== "");

    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "ref-numbering",
            levels: [
              {
                level: 0,
                format: LevelFormat.DECIMAL,
                text: "%1.",
                alignment: AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: { left: 720, hanging: 360 },
                  },
                },
              },
            ],
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              size: { width: 11907, height: 16839 },
              margin: { top: 1440, right: 1440, bottom: 1440, left: 2160 },
            },
          },
          children: [
            // 🟪 Title
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, line: lineSpacing * 240, after: 160 },
              children: [
                new TextRun({
                  text: title.toUpperCase(),
                  bold: true,
                  size: titleSize * 2,
                  font: fontFamily,
                }),
              ],
            }),

            // 🟪 Numbered References
            ...lines.map(
              (ref) =>
                new Paragraph({
                  numbering: {
                    reference: "ref-numbering",
                    level: 0,
                  },
                  alignment: AlignmentType.JUSTIFIED,
                  spacing: { after: 160, line: lineSpacing * 240 },
                  children: [
                    new TextRun({
                      text: ref,
                      size: bodySize * 2,
                      font: fontFamily,
                    }),
                  ],
                })
            ),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${title.replace(/\s+/g, "_")}.docx`);
  };

  // 🟩 Merge into global merged list
  const handleMerge = () => {
    if (!references.trim()) {
      alert("Please add some references before merging!");
      return;
    }

    // Add section to global merge context
    addSection({
      title,
      paragraphs: references, // we’ll split them as numbered later in merged
      fontFamily,
      titleSize,
      bodySize,
      lineSpacing,
    });

    navigate("/merged");
  };

  return (
    <ReferencesUI
      title={title}
      setTitle={setTitle}
      references={references}
      setReferences={setReferences}
      fontFamily={fontFamily}
      setFontFamily={setFontFamily}
      titleSize={titleSize}
      setTitleSize={setTitleSize}
      bodySize={bodySize}
      setBodySize={setBodySize}
      lineSpacing={lineSpacing}
      setLineSpacing={setLineSpacing}
      generateDocx={generateDocx}
      onMerge={handleMerge}
    />
  );
};

export default References;
