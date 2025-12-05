// SPDX-FileCopyrightText: Microsoft Corporation
//
// SPDX-License-Identifier: MIT
declare const CONFIG_URL: string;
import { loadConfig } from "../utils/ConfigHelper";
import { Config, AddinConfig } from "../models/Config";
import { addMeeting } from "../utils/OfficeCallHandler";
import a_config from "./config.json";

/* global console */

(async () => {
  await Office.onReady();
})();

const addinConfig: AddinConfig = a_config;

const addJitsiLink = (event: Office.AddinCommands.Event, name: string) => {
  try {
    loadConfig((config: Config, error: string) => addMeeting(name, config, error, event), CONFIG_URL);
  } catch (error) {
    console.log(error);
    return;
  }
};

addinConfig.meetingLinks.forEach((element) => {
  Office.actions.associate(element.associate, (f: Office.AddinCommands.Event) => addJitsiLink(f, element.meetingName));
});
