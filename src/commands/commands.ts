// SPDX-FileCopyrightText: Microsoft Corporation
//
// SPDX-License-Identifier: MIT

import { loadConfig } from "../utils/ConfigHelper";
import { Config, AddinConfig } from "../models/Config";
import { addMeeting } from "../utils/OfficeCallHandler";
import a_config from "./config.json";

/* global Office, console */

(async () => {
  await Office.onReady();
})();

let addinConfig: AddinConfig = a_config;

const addJitsiLink = (event: Office.AddinCommands.Event, name: string) => {
  try {
    loadConfig((config: Config) => addMeeting(name, config, event), addinConfig.configUrl);
  } catch (error) {
    console.log(error);
    return;
  }
};

addinConfig.meetingLinks.forEach((element) => {
  Office.actions.associate(element.associate, (f: any) => addJitsiLink(f, element.meetingName));
});
