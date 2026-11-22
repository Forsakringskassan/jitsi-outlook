// SPDX-FileCopyrightText: Microsoft Corporation
//
// SPDX-License-Identifier: MIT
const configUrl = new URL('./config.json', window.location.href).href;
import { loadConfig } from "../utils/ConfigHelper";
import { Config, AddinConfig } from "../models/Config";
import { addMeeting } from "../utils/OfficeCallHandler";

/* global console */

(async () => {
  await Office.onReady();
})();

const loadAddinConfig = function (filename: string, callback: (e: string, config: AddinConfig) => void) {
  const cacheBuster = `?t=${Date.now()}`
  fetch(filename + cacheBuster)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      callback("", json)
    })
    .catch((error) => {
      callback(error, { meetingLinks: [] })
    });
}

const addJitsiLink = (event: Office.AddinCommands.Event, name: string, addinConfig?: string) => {
  if (addinConfig) {
    try {
      loadConfig((config: Config, error: string) => addMeeting(name, config, error, event), addinConfig);
    } catch (error) {
      console.log(error);
      return;
    }
  }
};

loadAddinConfig(configUrl, (e, addinConfig: AddinConfig) => {
  if (e == "") {
    addinConfig.meetingLinks.forEach((element) => {
      Office.actions.associate(element.associate, (f: Office.AddinCommands.Event) => addJitsiLink(f, element.meetingName, addinConfig.configUrl));
    })
  }
});
