// SPDX-FileCopyrightText: 2024 Försäkringskassan IT

// SPDX-License-Identifier: MIT

/* global Office, console, XMLHttpRequest */

import { Config } from "../models/Config";
const DefaultConfig: Config = {};

export const getConfigXHR = function (callback: (config: Config) => void, configUrl?: string) {
  let domain: string | null = getDomain();
  const xhr = new XMLHttpRequest();
  if (configUrl !== undefined) {
    if (domain) {
      xhr.open("GET", configUrl + domain + "/config.json", false);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          callback(JSON.parse(xhr.responseText) as Config);
        } else {
          callback(DefaultConfig as Config);
        }
      };
      xhr.send();
    } else {
      console.log("getConfig - No domain found.");
    }
  } else {
    callback(DefaultConfig as Config);
  }
};

export const getDomain = (): string | null => {
  const emailAddress: string = Office.context.mailbox.userProfile.emailAddress;
  const domain: string = emailAddress ? emailAddress.split("@")[1].toLowerCase() : undefined;

  if (domain) {
    return domain;
  } else {
    return null;
  }
};

export const loadConfig = function (callback: (config: Config) => void, configUrl?: string) {
  getConfigXHR((config) => {
    callback(config);
  }, configUrl);
};

export const getMeetingConfig = (config: Config, type: string): number => {
  let value = -1;
  if (!config.meetings) {
    return undefined;
  }
  config.meetings.forEach((entry: any, index: number) => {
    if (entry.type === type) {
      value = index;
    }
  });
  return value;
};
