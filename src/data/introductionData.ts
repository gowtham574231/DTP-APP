// src/data/introductionData.ts
import { AlignmentType } from "docx";

let introductionData: any = null;
let subscribers: (() => void)[] = [];

export const setIntroductionData = (data: any) => {
  introductionData = {
    ...data,
    alignment: AlignmentType.JUSTIFIED,
    indent: 720,
  };
  subscribers.forEach((cb) => cb());
};

export const getIntroductionData = () => introductionData;

export const subscribeIntroduction = (callback: () => void) => {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter((cb) => cb !== callback);
  };
};
