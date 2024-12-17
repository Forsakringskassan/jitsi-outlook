// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
//
// SPDX-License-Identifier: MIT

export const defaultMeetJitsiUrl = "https://meet.jit.si/";
export const defaultConfigUrl = "./" //Url to folder containing config about meeting
export const defaultFontFamily = "Arial";

export interface Config {
  baseUrl?: string;
  locationString?: string;
  additionalText?: string;
  meetings?: {
    type?: string;
    startWithAudioMuted?: boolean;
    startWithVideoMuted?: boolean;
  }[];
  fontFamily?: string;
}

interface AddinConfig {
  meetingLinks: {
    associate: string;
    meetingName: string;
  }[]
}
