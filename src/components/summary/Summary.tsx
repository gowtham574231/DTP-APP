import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMerge } from "../../context/MergeContext"; // ✅ add this
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import SummaryUI from "./SummaryUI";

const Summary: React.FC = () => {
  const [title, setTitle] = useState("SUMMARY");
  const [paragraphs, setParagraphs] = useState("");
  const [fontFamily, setFontFamily] = useState("Times New Roman");
  const [titleSize, setTitleSize] = useState(14);
  const [bodySize, setBodySize] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(2.0);

  const { addSection } = useMerge(); // ✅ use global merge
  const navigate = useNavigate();

  // 🟩 Generate Word File
  const generateDocx = async (): Promise<void> => {
    if (!paragraphs.trim()) {
      alert("Please enter some content before generating!");
      return;
    }

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
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, line: 2.0 * 240, after: 160 },
              children: [
                new TextRun({
                  text: title.toUpperCase(),
                  bold: true,
                  size: titleSize * 2,
                  font: fontFamily,
                }),
              ],
            }),
            ...paragraphs
              .split(/\r?\n\s*\r?\n|[\r\n]+/)
              .filter((p) => p.trim() !== "")
              .map(
                (p) =>
                  new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 160, line: 2.0 * 240 },
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

  // 🟩 Merge into global list
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
    <SummaryUI
      title={title}
      paragraphs={paragraphs}
      fontFamily={fontFamily}
      titleSize={titleSize}
      bodySize={bodySize}
      lineSpacing={lineSpacing}
      setTitle={setTitle}
      setParagraphs={setParagraphs}
      setFontFamily={setFontFamily}
      setTitleSize={setTitleSize}
      setBodySize={setBodySize}
      setLineSpacing={setLineSpacing}
      generateDocx={generateDocx}
      onMerge={handleMerge} // ✅ global merge now works
    />
  );
};

export default Summary;
