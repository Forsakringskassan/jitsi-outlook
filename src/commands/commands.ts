// SPDX-FileCopyrightText: Microsoft Corporation
//
// SPDX-License-Identifier: MIT

import { loadConfig } from "../utils/ConfigHelper"
import { Config } from "../models/Config";
import { addMeeting } from "../utils/OfficeCallHandler";
import addinConfig from "./addinConfig.json"

/* global Office */

(async () => {
  await Office.onReady();
})();

const addJitsiLink = (event: Office.AddinCommands.Event, name: string) => {
  try {
    loadConfig((config: Config) =>   addMeeting(name, config, event));
  } catch (error) {
    console.log(error);
    return;
  }
};

addinConfig.meetingLinks.forEach( (element) => {
  Office.actions.associate(element.associate, (f: any) => addJitsiLink(f, element.meetingName))
});
