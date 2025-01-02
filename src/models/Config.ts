// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
//
// SPDX-License-Identifier: MIT

export const defaultMeetJitsiUrl = "https://meet.jit.si/";
export const defaultFontFamily = "Arial";

interface Meeting {
  type?: string;
  startWithAudioMuted?: boolean;
  startWithVideoMuted?: boolean;
}

export interface Config {
  baseUrl?: string;
  locationString?: string;
  additionalText?: string;
  meetings?: Meeting[];
  fontFamily?: string;
}

export interface AddinConfig {
  configUrl?: string;
  meetingLinks: {
    associate: string;
    meetingName: string;
  }[];
}
