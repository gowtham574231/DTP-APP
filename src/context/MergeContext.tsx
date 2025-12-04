import React, { createContext, useContext, useState } from "react";
import { Paragraph } from "docx";

// ✅ Generic type every section can follow
export interface SectionData {
  title?: string;
  paragraphs?: string;
  fontFamily?: string;
  titleSize?: number;
  bodySize?: number;
  lineSpacing?: number;
  structuredParagraphs?: Paragraph[];
}

// ✅ Context definition
interface MergeContextType {
  mergedSections: SectionData[];
  addSection: (section: SectionData) => void;
  clearAll: () => void;
  deleteSection: (index: number) => void;
  reorderSections: (from: number, to: number) => void;
}

const MergeContext = createContext<MergeContextType | undefined>(undefined);

export const MergeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mergedSections, setMergedSections] = useState<SectionData[]>([]);

  const addSection = (section: SectionData) =>
    setMergedSections((prev) => [...prev, section]);

  const clearAll = () => setMergedSections([]);
  const deleteSection = (index: number) =>
    setMergedSections((prev) => prev.filter((_, i) => i !== index));

  const reorderSections = (from: number, to: number) => {
    setMergedSections((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  return (
    <MergeContext.Provider
      value={{ mergedSections, addSection, clearAll, deleteSection, reorderSections }}
    >
      {children}
    </MergeContext.Provider>
  );
};

export const useMerge = () => {
  const ctx = useContext(MergeContext);
  if (!ctx) throw new Error("useMerge must be used within MergeProvider");
  return ctx;
};
