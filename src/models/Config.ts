// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
// SPDX-FileCopyrightText: 2025 Försäkringskassan
//
// SPDX-License-Identifier: MIT

export const defaultMeetJitsiUrl = "https://meet.jit.si/";
export const defaultFontFamily = "Arial";
export const defaultFontSize = "20px";
export const defaultFontColor = "#000000";

interface Text {
  addNewLine: boolean;
  text: string;
  url?: string;
}

export interface AdditionalTexts {
  fontSize?: string;
  fontFamily?: string;
  fontColor?: string;
  texts: Text[];
}

export interface AdditionalLinks {
  fontSize?: string;
  fontFamily?: string;
  fontColor?: string;
  text: string;
  config: object;
}

interface Meeting {
  type?: string;
  additionalConfig?: object;
  meetingPrefix?: string;
  meetingSuffix?: string;
  meetingHeader?: string;
  additionalLinks?: AdditionalLinks[];
  additionalTexts?: AdditionalTexts[];
}

export interface Config {
  baseUrl?: string;
  locationString?: string;
  globalAdditionalLinks?: AdditionalLinks[];
  globalAdditionalTexts?: AdditionalTexts[];
  meetings?: Meeting[];
  fontFamily?: string;
  fontSize?: string;
  fontColor?: string;
  divColor?: string;
}

export interface AddinConfig {
  configUrl?: string;
  meetingLinks: {
    associate: string;
    meetingName: string;
  }[];
}
