// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
// SPDX-FileCopyrightText: 2025 Försäkringskassan
//
// SPDX-License-Identifier: MIT

import { Config, defaultMeetJitsiUrl } from "../models/Config";

export const getRandomRoomName = (): string => {
  var randomChars = "abcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < 16; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};

export const getConfigUrl = (config: Config, index?: number): string => {
  if (!config.meetings || !config.meetings[index] || !config.meetings[index].additionalConfig) {
    return "";
  }

  var keys = Object.keys(config.meetings[index].additionalConfig);
  const url = keys.reduce((acc, currentValue) => {
    return acc + `config.${currentValue}=${config.meetings[index].additionalConfig[currentValue]}&`;
  }, "#");

  return url.slice(0, -1);
};

export const secureSubjectUrl = (string: string, length?: number): string => {
  if (length === undefined) {
    length = 30;
  }
  let subject: string = string;
  subject = subject.replace(/[áàäâãåÁÀÄÂÃÅ]/g, "a");
  subject = subject.replace(/[óòöôõÓÒÖÔÕ]/g, "o");
  subject = subject.replace(/[éèëêÉÈËÊ]/g, "e");
  subject = subject.replace(/[úùüûÚÙÜÛ]/g, "u");
  subject = subject.replace(/[íìïîÍÌÏÎ]/g, "i");
  subject = subject.replace(/[^A-Za-z0-9]/g, "-");
  subject = subject.replace(/--+/g, "-");
  subject = subject.slice(0, length);
  if (subject.length <= 1) {
    subject = "";
  } else {
    subject = subject + "_";
  }
  return subject;
};

export const getJitsiUrl = (config: Config, index?: number, subject?: string): string => {
  let subjectText: string = "";
  if (subject) {
    subjectText = secureSubjectUrl(subject);
  }
  let prefix: string = "";
  let suffix: string = "";
  if (index !== undefined) {
    if (config.meetings[index] !== undefined) {
      prefix = config.meetings[index].meetingPrefix ?? "";
      suffix = config.meetings[index].meetingSuffix ?? "";
    }
  }
  let baseUrl = config.baseUrl ?? defaultMeetJitsiUrl;
  if (!baseUrl.endsWith("/")) {
    baseUrl = baseUrl + "/";
  }
  return baseUrl + prefix + subjectText + getRandomRoomName() + suffix + getConfigUrl(config, index);
};
