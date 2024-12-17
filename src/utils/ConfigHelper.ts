// SPDX-FileCopyrightText: 2024 Försäkringskassan IT

// SPDX-License-Identifier: MIT

/* global Office, localStorage, console */

import { Config, defaultConfigUrl } from "../models/Config";

export const getConfigXHR = function (callback: (config: Config) => void) {
  let domain: string | null = getDomain();
  const xhr = new XMLHttpRequest();
  if (domain) {
    xhr.open("GET", defaultConfigUrl + domain + "/config.json", false);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        callback(JSON.parse(xhr.responseText) as Config);
      } else {
        callback({} as Config);
      }
    };
    xhr.send();
  } else {
    console.log("getConfig - No domain found.");
  }
};

const getDomain = (): string | null => {
  const emailAddress: string = Office.context.mailbox.userProfile.emailAddress;
  const domain: string = emailAddress.split("@")[1];

  if (domain) {
    return domain;
  } else {
    return null;
  }
};

export const loadConfig = function (callback: (config: Config) => void) {
  getConfigXHR((config) => {
    if (config != null) {
      callback(config);
    } else {
      callback({} as Config);
    }
  });
};

export const getMeetingConfig = (config: Config, type: string): number => {
    let value = -1;
    if (!config.meetings) {
      return null;
    }
    config.meetings.forEach((entry: any, index: number) => {
      if (entry.type === type) {
        value = index;
      }
    });
    return value;
  };
