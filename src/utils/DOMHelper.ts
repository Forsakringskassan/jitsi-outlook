// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
// SPDX-FileCopyrightText: 2025 Försäkringskassan
//
// SPDX-License-Identifier: MIT

/* global DOMParser, Document */

import getLocalizedStrings from "../localization";
import { Config, AdditionalLinks, AdditionalTexts, defaultFontFamily, defaultMeetJitsiUrl, defaultFontSize, defaultFontColor } from "../models/Config";
import { videoCameraURI } from "./IconHelper";
import { getJitsiUrl } from "./URLHelper";

const DIV_ID_JITSI = "jitsi-link";

export const combineBodyWithJitsiDiv = (body: string, config: Config, index?: number, subject?: string): string => {
  return combineBodyWithChosenDiv(body, getJitsiLinkDiv(getJitsiUrl(config, index, subject), config, index));
};

export const combineBodyWithErrorDiv = (body: string, error: string): string => {
  return combineBodyWithChosenDiv(body, error);
};

export const combineBodyWithChosenDiv = (body: string, linkDOM: string): string => {
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

const concatAdditionalLinks = (lang: string, additionalLinks: AdditionalLinks, baseUrl: string): string => {
  let output: string = "";
  var keys: string[] = Object.keys(additionalLinks.config);
  let aL: string = getLocalizedText(additionalLinks.text, lang, "");
  let url: string = keys.reduce((acc, currentValue) => {
    return acc + `config.${currentValue}=${additionalLinks.config[currentValue]}&`;
  }, "#");
  output += `<span style="font-size: ${additionalLinks.fontSize ?? defaultFontSize}; font-family: '${additionalLinks.fontFamily ?? defaultFontFamily}'; color: ${additionalLinks.fontColor ?? defaultFontColor};">`;
  output += `<a aria-label="${aL}" title="${aL}" style="text-decoration: none;" href="${baseUrl + url.slice(0, -1)}"> ${aL} </a>`;
  output += `</span>`;
  output += `<br>`;
  return output;
};

export const getMeetingAdditionalLinks = (config: Config, jitsiUrl: string, index?: number): string => {
  let output: string = "<br>";
  let baseUrl: string = jitsiUrl.split("#")[0];
  if (index !== undefined) {
    config.meetings[index]?.additionalLinks?.forEach((entry) => {
      output += concatAdditionalLinks(config.currentLanguage, entry, baseUrl);
    });
  }
  config.globalAdditionalLinks?.forEach((entry) => {
    output += concatAdditionalLinks(config.currentLanguage, entry, baseUrl);
  });
  return output;
};

const concatAdditionalTexts = (lang: string, additionalTexts: AdditionalTexts): string => {
  let output: string = "";
  let aT: string = "";
  let aU: string = "";
  output += `<span style="font-size: ${additionalTexts.fontSize ?? defaultFontSize}; font-family: '${additionalTexts.fontFamily ?? defaultFontFamily}'; color: ${additionalTexts.fontColor ?? defaultFontColor};">`;
  additionalTexts.texts.forEach((additional) => {
    aT = getLocalizedText(additional.text, lang, "");
    aU = getLocalizedText(additional.url, lang, "");
    if (additional.url) {
      output += `<a aria-label="${aT}" title="${aT}" style="text-decoration: none;" href="${aU}"> ${aT} </a>`;
    } else {
      output += aT;
    }
    if (additional.addNewLine) {
      output += `<br>`;
    }
  });
  output += `</span>`;
  return output;
};

export const getMeetingAdditionalTexts = (config: Config, index?: number): string => {
  let output: string = "";
  if (index !== undefined) {
    config.meetings[index]?.additionalTexts?.forEach((entry) => {
      output += concatAdditionalTexts(config.currentLanguage, entry);
    });
  }
  config.globalAdditionalTexts?.forEach((entry) => {
    output += concatAdditionalTexts(config.currentLanguage, entry);
  });
  return output;
};

export const getLocalizedText = (obj: object | null, lang: string, def: string): string => {
  return obj ? (lang in obj ? obj[lang] : obj["default"]) : def;
};

export const getJitsiLinkDiv = (jitsiUrl: string, config: Config, index?: number): string => {
  let output: string = "";
  const localizedStrings = getLocalizedStrings(config.currentLanguage);
  const tdStyles = "padding-right: 10px; vertical-align: middle; background-color: transparent;";
  const fontFamily = config.fontFamily ?? defaultFontFamily;
  const fontSize = config.fontSize ?? defaultFontSize;
  const fontColor = config.fontColor ?? defaultFontColor;
  const divColor = config.divColor ?? "#ffffff";
  output += `<div id="${DIV_ID_JITSI}"><br>`;
  if (config.useDiv !== undefined && config.useDiv == true) {
    output += `<hr style="color: ${divColor}; border-color: ${divColor}">`;
  }
  if (index !== undefined) {
    output += `<div style="font-size: ${fontSize}; font-weight: 700; font-family: '${fontFamily}'">${getLocalizedText(config.meetings[index].meetingHeader, config.currentLanguage, "")}</div>`;
  }
  output += `
      <div style="${tdStyles}">
        <span
          style="font-size: ${fontSize}; font-family: '${fontFamily}';color: ${fontColor};">
          <a
            aria-label="${localizedStrings.linkToMeeting}"
            title="${localizedStrings.linkToMeeting}"
            style="text-decoration: none;"
            href="${jitsiUrl}">`;
  if (config.useGraphics !== undefined && config.useGraphics == true) {
    output +=
      `
            <img style="vertical-align: middle;" width="18" height="18" src="` +
      (config.userGraphics ? config.userGraphics : videoCameraURI) +
      `">`;
  }
  output += `
            <span
              style="font-size: ${fontSize}; font-family: '${fontFamily}'">
                &rarr;
            </span>
            ${localizedStrings.connectToMeeting}
          </a>
        <br>
        </span>
      <div>`;
  output += getMeetingAdditionalLinks(config, jitsiUrl, index);
  output += getMeetingAdditionalTexts(config, index);
  output += `<br>`;
  if (config.useDiv !== undefined && config.useDiv == true) {
    output += `<hr>`;
  }
  output += `<div>`;

  return output;
};
