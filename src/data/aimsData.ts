import type { SectionData } from "../context/MergeContext";

export interface AimsSection extends SectionData {
  aim?: string;
  objectivesIntro?: string;
  includePrimary?: boolean;
  primaryObjective?: string;
  includeSecondary?: boolean;
  secondaryObjectives?: string;
}

let aimsData: AimsSection = {
  title: "AIMS AND OBJECTIVES",
  paragraphs: "",
  fontFamily: "Times New Roman",
  titleSize: 14,
  bodySize: 12,
  lineSpacing: 2.0,
  aim: "",
  objectivesIntro: "",
  includePrimary: false,
  primaryObjective: "",
  includeSecondary: false,
  secondaryObjectives: "",
};

export const setAimsData = (data: Partial<AimsSection>) => {
  aimsData = { ...aimsData, ...data };
};

export const getAimsData = () => aimsData;
