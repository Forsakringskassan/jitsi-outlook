// SPDX-FileCopyrightText: 2024 Försäkringskassan IT

// SPDX-License-Identifier: MIT

/* global Office, console */

import { Config } from "../models/Config";
import DefaultConfig from "../../config.json";

export const getConfigXHR = function (callback: (config: Config, error: string) => void, configUrl?: string) {
  let domain: string | null = getDomain();
  const xhr = new XMLHttpRequest();
  if (configUrl !== undefined) {
    if (domain) {
      xhr.open("GET", configUrl + domain + "/config.json", false);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          callback(JSON.parse(xhr.responseText) as Config, "");
        } else {
          let error: string = "Error fetching config: " + configUrl + domain + "/config.json<br><br>";
          error += "Error code: " + xhr.status.toString() + "<br>";
          error += "Error message: " + xhr.responseText + "<br>";
          callback(DefaultConfig as Config, error);
        }
      };
      xhr.send();
    } else {
      console.log("getConfig - No domain found.");
    }
  } else {
    callback(DefaultConfig as Config, "");
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

export const loadConfig = function (callback: (config: Config, error: string) => void, configUrl?: string) {
  console.log(configUrl);
  getConfigXHR((config, e) => {
    callback(config, e);
  }, configUrl);
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
