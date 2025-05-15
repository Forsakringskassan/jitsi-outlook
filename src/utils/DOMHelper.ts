// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
// SPDX-FileCopyrightText: 2025 Försäkringskassan
//
// SPDX-License-Identifier: MIT

/* global DOMParser, Document */

import getLocalizedStrings from "../localization";
import { Config, defaultFontFamily, defaultMeetJitsiUrl, defaultFontSize, defaultFontColor } from "../models/Config";
import { videoCameraURI } from "./IconHelper";
import { getJitsiUrl } from "./URLHelper";

const DIV_ID_JITSI = "jitsi-link";

export const combineBodyWithJitsiDiv = (body: string, config: Config, index?: number, subject?: string): string => {
  const jitsiUrl = getJitsiUrl(config, index, subject);

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

export const overwriteJitsiLinkDiv = (body: Document, config: Config, index?: number, subject?: string): string => {
  const jitsiUrl = getJitsiUrl(config, index, subject);

  const jitsiLink = body.querySelector(`[id*="${DIV_ID_JITSI}"]`);
  const newJitsiLink = getJitsiLinkDiv(jitsiUrl, config, index);
  jitsiLink.outerHTML = newJitsiLink;

  const updatedHtmlString = body.body.innerHTML;
  return updatedHtmlString;
};

export const getMeetingAdditionalTexts = (config: Config, index?: number): string => {
  let output: string = "";
  if (index) {
    config.meetings[index]?.additionalTexts?.forEach((entry) =>{
      output += `<span style="font-size: ${entry.fontSize ?? defaultFontSize}; font-family: '${entry.fontFamily ?? defaultFontFamily}'; color: ${entry.fontColor ?? defaultFontColor};">`;
      entry.texts.forEach((additional) => {
        if (additional.url) {
          output += `
            <a
              aria-label="${additional.text}"
              title="${additional.text}"
              style="text-decoration: none;"
              href="${additional.url}"
            >
              ${additional.text}
            </a>`;
        } else {
          output += additional.text
        }
        if (additional.addNewLine) {
          output += `<br>`;
        }
      });
      output += `</span>`;
    });
  }
  return output;
};

export const getJitsiLinkDiv = (jitsiUrl: string, config: Config, index?: number): string => {
  let output: string = "";
  const localizedStrings = getLocalizedStrings();

  const tdStyles = "padding-right: 10px; vertical-align: middle; background-color: transparent;";
  const fontFamily = config.fontFamily ?? defaultFontFamily;
  const fontSize = config.fontSize ?? defaultFontSize;
  const fontColor = config.fontColor ?? defaultFontColor;
  const divColor = config.divColor ?? "#ffffff";
  output += `
    <div id="${DIV_ID_JITSI}">
      <br><hr style="color: ${divColor}; border-color: ${divColor}">`
  if (index >= 0) {
    output += `<div style="font-size: ${fontSize}; font-weight: 700; font-family: '${fontFamily}'">${config.meetings[index].meetingHeader ?? ""}</div>`;
  }
  output += `
      <div style="${tdStyles}">
        <span
          style="font-size: ${fontSize}; font-family: '${fontFamily}';color: ${fontColor};">
          <a
            aria-label="${localizedStrings.linkToMeeting}"
            title="${localizedStrings.linkToMeeting}"
            style="text-decoration: none;"
            href="${jitsiUrl}">
            <img
              style="vertical-align: middle;"
              width="18"
              height="18"
              src=${videoCameraURI}
            />
            <span
              style="font-size: ${fontSize}; font-family: '${fontFamily}'">
                &rarr;
            </span>
              ${localizedStrings.connectToMeeting}
          </a>
        <br>
        </span>
      <div>`;
  output += getMeetingAdditionalTexts(config, index);
  output += `<br><hr><div>`

  return output;
  /*`
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
    </div>
  `;*/
};
