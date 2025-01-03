// SPDX-FileCopyrightText: Microsoft Corporation
// SPDX-FileCopyrightText: 2025 Försäkringskassan
//
// SPDX-License-Identifier: MIT

import { Config } from "../models/Config";
import { bodyHasJitsiLink, combineBodyWithJitsiDiv, overwriteJitsiLinkDiv } from "../utils/DOMHelper";
import { getMeetingConfig } from "../utils/ConfigHelper";

/* global Office, console */

const setData = async (str: string, event?: Office.AddinCommands.Event) => {
  Office.context.mailbox.item.body.setAsync(
    str,
    {
      coercionType: Office.CoercionType.Html,
    },
    () => {
      event.completed();
    },
  );
};

export const setDataTest = { setData };

const setLocation = async (config: Config) => {
  let location: string = config.locationString ?? "Jitsi meeting";
  Office.context.mailbox.item?.location.getAsync((r) => {
    let r_value: string = r.value.trimEnd();
    if (r.value.length > 0) {
      if (r_value.includes(location)) {
        location = r_value;
      } else {
        location = " " + location;
        if (!r_value.endsWith(";")) {
          location = ";" + location;
        }
        location = r_value + location;
      }
    }
    Office.context.mailbox.item?.location.setAsync(location, (result) => {
      if (result.status !== Office.AsyncResultStatus.Succeeded) {
        return;
      }
    });
  });
};

export const setLocationTest = { setLocation };

export const addMeeting = async (name: string, config: Config, event?: Office.AddinCommands.Event) => {
  let index: number = getMeetingConfig(config, name);

  Office.context.mailbox.item.body.getAsync(Office.CoercionType.Html, (result) => {
    if (result.error) {
      event.completed();
    }

    try {
      Office.context.mailbox.item.subject.getAsync((subject) => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(result.value, "text/html");

        const bodyDOM = bodyHasJitsiLink(result.value, config) ? overwriteJitsiLinkDiv(htmlDoc, config, index, subject.value) : combineBodyWithJitsiDiv(result.value, config, index, subject.value);
        setData(htmlDoc.head.innerHTML + bodyDOM, event);
        setLocation(config);
      });
    } catch (error) {
      // If it fails to manipulate the DOM with a new link it will fallback to its original state
      setData(result.value, event);
      console.log(error);
    }
  });
};
