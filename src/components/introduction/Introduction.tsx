import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMerge } from "../../context/MergeContext";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import IntroductionUI from "./IntroductionUI";

const Introduction: React.FC = () => {
  const [title, setTitle] = useState("INTRODUCTION");
  const [paragraphs, setParagraphs] = useState("");
  const [fontFamily, setFontFamily] = useState("Times New Roman");
  const [titleSize, setTitleSize] = useState(14); // ✅ default 14 pt
  const [bodySize, setBodySize] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(2.0); // ✅ default 2.0 spacing

  const { addSection } = useMerge();
  const navigate = useNavigate();

  // 🟩 Generate Word File
  const handleGenerate = async () => {
    if (!paragraphs.trim()) {
      alert("Please enter some content before generating!");
      return;
    }

    // Build the Word document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: { width: 11907, height: 16839 },
              margin: { top: 1440, right: 1440, bottom: 1440, left: 2160 },
            },
          },
          children: [
            // 🟩 Title paragraph
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, line: 2.0 * 240, after: 160 }, // ✅ line 2.0, after 8 pt
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: titleSize * 2, // Word uses half-points
                  font: fontFamily,
                }),
              ],
            }),

            // 🟩 Body paragraphs
            ...paragraphs
              .split(/\r?\n\s*\r?\n|[\r\n]+/)
              .filter((p) => p.trim() !== "")
              .map(
                (p) =>
                  new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { before: 0, after: 160, line: 2.0 * 240 }, // ✅ 2.0 spacing
                    indent: { firstLine: 720 },
                    children: [
                      new TextRun({
                        text: p.trim(),
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

  // 🟩 Merge this section into the global merged list
  const handleMerge = () => {
    if (!paragraphs.trim()) {
      alert("Please add some content before merging!");
      return;
    }

    addSection({
      title,
      paragraphs,
      fontFamily,
      titleSize,
      bodySize,
      lineSpacing,
    });

    navigate("/merged");
  };

  return (
    <IntroductionUI
      title={title}
      setTitle={setTitle}
      paragraphs={paragraphs}
      setParagraphs={setParagraphs}
      fontFamily={fontFamily}
      setFontFamily={setFontFamily}
      titleSize={titleSize}
      setTitleSize={setTitleSize}
      bodySize={bodySize}
      setBodySize={setBodySize}
      lineSpacing={lineSpacing}
      setLineSpacing={setLineSpacing}
      onGenerate={handleGenerate}
      onMerge={handleMerge}
    />
  );
};

export default Introduction;
