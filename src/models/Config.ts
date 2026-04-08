// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
// SPDX-FileCopyrightText: 2025 Försäkringskassan
//
// SPDX-License-Identifier: MIT

export const defaultMeetJitsiUrl = "https://meet.jit.si/";
export const defaultFontFamily = "Arial";
export const defaultFontSize = "20px";
export const defaultFontColor = "#000000";

export interface PairList {
  [key: string]: string | boolean;
}

interface Texts {
  addNewLine: boolean;
  text: PairList;
  url?: PairList;
}

export interface AdditionalTexts {
  fontSize?: string;
  fontFamily?: string;
  fontColor?: string;
  texts: Texts[];
}

export interface AdditionalLinks {
  fontSize?: string;
  fontFamily?: string;
  fontColor?: string;
  text: PairList;
  config: PairList;
}

export interface Meeting {
  type?: string;
  additionalConfig?: PairList;
  meetingPrefix?: string;
  meetingSuffix?: string;
  meetingHeader?: PairList;
  additionalLinks?: AdditionalLinks[];
  additionalTexts?: AdditionalTexts[];
}

export interface Config {
  currentLanguage?: string;
  baseUrl?: string;
  locationString?: PairList;
  globalAdditionalLinks?: AdditionalLinks[];
  globalAdditionalTexts?: AdditionalTexts[];
  overrideLinkToMeeting?: PairList;
  overrideConnectToMeeting?: PairList;
  meetings?: Meeting[];
  fontFamily?: string;
  fontSize?: string;
  fontColor?: string;
  useDiv?: boolean;
  divColor?: string;
  useGraphics?: boolean;
  userGraphics?: string;
}

export interface AddinConfig {
  configUrl?: string;
  meetingLinks: {
    associate: string;
    meetingName: string;
  }[];
}
