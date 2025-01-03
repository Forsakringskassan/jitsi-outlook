// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
// SPDX-FileCopyrightText: 2025 Försäkringskassan
//
// SPDX-License-Identifier: MIT

export const defaultMeetJitsiUrl = "https://meet.jit.si/";
export const defaultFontFamily = "Arial";

interface Config {
  baseUrl?: string;
  locationString?: string;
  additionalText?: string;
  meetingUrl?: {
    startWithAudioMuted?: boolean;
    startWithVideoMuted?: boolean;
  };
  fontFamily?: string;
}

export default Config;
