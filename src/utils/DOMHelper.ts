// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
// SPDX-FileCopyrightText: 2025 Försäkringskassan
//
// SPDX-License-Identifier: MIT

import getLocalizedStrings from "../localization";
import Config, { defaultFontFamily, defaultMeetJitsiUrl } from "../models/Config";
import { videoCameraURI } from "./IconHelper";
import { getJitsiUrl } from "./URLHelper";

const DIV_ID_JITSI = "jitsi-link";

export const combineBodyWithJitsiDiv = (body: string, config: Config, subject: string): string => {
  const jitsiUrl = getJitsiUrl(config, subject);

  const linkDOM = getJitsiLinkDiv(jitsiUrl, config);
  const parser = new DOMParser();

  const bodyString = `
        ${body}
        ${linkDOM}
    `;

  const combinedDOM = parser.parseFromString(bodyString, "text/html");

  return combinedDOM.body.innerHTML;
};

export const bodyHasJitsiLink = (body: string, config: Config): boolean => {
  const baseUrl = config.baseUrl ?? defaultMeetJitsiUrl;
  const urlRegex = new RegExp(baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return urlRegex.test(body);
};

export const overwriteJitsiLinkDiv = (body: Document, config: Config, subject?: string): string => {
  const jitsiUrl = getJitsiUrl(config, subject);

  const jitsiLink = body.querySelector(`[id*="${DIV_ID_JITSI}"]`);
  const newJitsiLink = getJitsiLinkDiv(jitsiUrl, config);
  jitsiLink.outerHTML = newJitsiLink;

  const updatedHtmlString = body.body.innerHTML;
  return updatedHtmlString;
};

export const getJitsiLinkDiv = (jitsiUrl: string, config: Config): string => {
  const localizedStrings = getLocalizedStrings();

  const tdStyles = "padding-right: 10px; vertical-align: middle; background-color: transparent;";
  const fontFamily = config.fontFamily ?? defaultFontFamily;

  return `
    <div id="${DIV_ID_JITSI}" style="font-family: '${fontFamily}';">
        <span style="font-size: 14px; font-weight: 700;">
            ${localizedStrings.connectToMeeting}
        </span>
        <table style="border-collapse: collapse; margin-top: 6px; background-color: transparent;">
            <tr>
                <td style="${tdStyles}">
                    <img
                        style="vertical-align: middle;"
                        width="18"
                        height="18"
                        src=${videoCameraURI}
                    />
                </td>
                <td style="${tdStyles}">
                    <a
                        aria-label="${localizedStrings.linkToMeeting}"
                        title="${localizedStrings.linkToMeeting}"
                        alt=${localizedStrings.linkToMeeting}
                        style="font-size: 12px;"
                        href="${jitsiUrl}">
                        ${jitsiUrl}
                    </a>
                </td>
            </tr>
        </table>
        <br />
        ${
          config.additionalText
            ? `
            <br />
            <span style="font-size: 0.8em; font-style: italic;">
                ${config.additionalText}
            </span>
            `
            : ""
        }
    </div>
  `;
};
