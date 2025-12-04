import React, { useState } from "react";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import Aim from "./aim"
import Objectives from "./Objectives";

const AimsAndObjectives: React.FC = () => {
  const [aim, setAim] = useState("");
  const [objectives, setObjectives] = useState({
    objectivesIntro: "",
    primaryObjectives: [] as string[],
    secondaryObjectives: [] as string[],
  });

  const handleAimChange = (data: { aim: string }) => setAim(data.aim);
  const handleObjectivesChange = (data: typeof objectives) => setObjectives(data);

  const generateDocx = async () => {
    const doubleSpacing = 480; // 2.0 line spacing
    const font = "Times New Roman";

    const children: Paragraph[] = [
      // Title
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: doubleSpacing, after: 160 },
        children: [
          new TextRun({
            text: "AIMS AND OBJECTIVES",
            bold: true,
            size: 28,
            font,
          }),
        ],
      }),

      // AIM heading
      new Paragraph({
        spacing: { line: doubleSpacing, after: 160 },
        children: [
          new TextRun({
            text: "AIM",
            bold: true,
            size: 24,
            font,
          }),
        ],
      }),

      // AIM paragraph (reduced after-spacing so no blank gap)
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: doubleSpacing, after: 160 }, // 🟩 reduced from 160 → 60
        indent: { left: 360, firstLine: 500 },
        children: [
          new TextRun({
            text: aim.trim(),
            size: 24,
            font,
          }),
        ],
      }),

      // OBJECTIVES heading (same page now)
      new Paragraph({
        spacing: { line: doubleSpacing, after: 160 },
        children: [
          new TextRun({
            text: "OBJECTIVES",
            bold: true,
            size: 24,
            font,
          }),
        ],
      }),
    ];

    // OBJECTIVES intro
    if (objectives.objectivesIntro) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { line: doubleSpacing, after: 160 },
          indent: { left: 360, firstLine: 500 },
          children: [
            new TextRun({
              text: objectives.objectivesIntro,
              size: 24,
              font,
            }),
          ],
        })
      );
    }

    // PRIMARY OBJECTIVES
    if (objectives.primaryObjectives.length > 0) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { line: doubleSpacing, after: 160 },
          indent: { left: 720 },
          children: [
            new TextRun({
              text: "Primary Objectives:",
              bold: true,
              size: 24,
              font,
            }),
          ],
        })
      );

      objectives.primaryObjectives.forEach((p) =>
        children.push(
          new Paragraph({
            bullet: { level: 1 },
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: doubleSpacing, after: 160 },
            indent: { left: 1080, hanging: 360 },
            children: [
              new TextRun({
                text: p.trim(),
                size: 24,
                font,
              }),
            ],
          })
        )
      );
    }

    // SECONDARY OBJECTIVES
    if (objectives.secondaryObjectives.length > 0) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { line: doubleSpacing, after: 160 },
          indent: { left: 720 },
          children: [
            new TextRun({
              text: "Secondary Objectives:",
              bold: true,
              size: 24,
              font,
            }),
          ],
        })
      );

      objectives.secondaryObjectives.forEach((p) =>
        children.push(
          new Paragraph({
            bullet: { level: 1 },
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: doubleSpacing, after: 160 },
            indent: { left: 1080, hanging: 360 },
            children: [
              new TextRun({
                text: p.trim(),
                size: 24,
                font,
              }),
            ],
          })
        )
      );
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
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Aims_and_Objectives.docx");
  };

  return (
    <div>
      <Aim onDataChange={handleAimChange} />
      <Objectives onDataChange={handleObjectivesChange} />

      <div className="text-center mt-6">
        <button
          onClick={generateDocx}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
        >
          Generate Combined Word File
        </button>
      </div>
    </div>
  );
};

export default AimsAndObjectives;
