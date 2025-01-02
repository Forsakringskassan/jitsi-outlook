// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
//
// SPDX-License-Identifier: MIT

import getLocalizedStrings from "../src/localization";
import { Config, defaultFontFamily } from "../src/models/Config";
import { bodyHasJitsiLink, getJitsiLinkDiv, overwriteJitsiLinkDiv } from "../src/utils/DOMHelper";
import * as URLHelper from "../src/utils/URLHelper";

describe("getJitsiLinkDOM", () => {
  it("should return a string that contains the correct Jitsi URL", () => {
    const config: Config = {};
    const jitsiUrl = URLHelper.getJitsiUrl(config);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).toContain(jitsiUrl);
  });

  it("should return a string that contains the localized strings", () => {
    const config: Config = {};
    const jitsiUrl = URLHelper.getJitsiUrl(config);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);
    const localizedStrings = getLocalizedStrings();

    expect(jitsiLinkDOM).toContain(localizedStrings.linkToMeeting);
    expect(jitsiLinkDOM).toContain(localizedStrings.connectToMeeting);
  });

  it("should include the additionalText if provided in config", () => {
    const config: Config = {
      additionalText: "This is additional text",
    };
    const jitsiUrl = URLHelper.getJitsiUrl(config);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).toContain(config.additionalText);
  });

  it("should not include the additionalText if not provided in config", () => {
    const config: Config = {};
    const jitsiUrl = URLHelper.getJitsiUrl(config);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).not.toContain("additionalText");
  });

  it("should include the specified font if fontFamily is provided in config", () => {
    const config: Config = {
      fontFamily: "Times New Roman",
    };
    const jitsiUrl = URLHelper.getJitsiUrl(config);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).toContain(config.fontFamily);
    expect(jitsiLinkDOM).not.toContain(defaultFontFamily);
  });

  it("should include the default font if fontFamily is not provided in config", () => {
    const config: Config = {};
    const jitsiUrl = URLHelper.getJitsiUrl(config);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).toContain(defaultFontFamily);
  });

  it("should return a room containing subject line", () => {
    const config: Config = {}
    const testSubject: string = 'Test Meeting:;for +?"!new¤%€${€$[{]£$@£$£employee.,-.-...,,,,.-.-,.---.-,,.,._++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++';
    const JitsiMeetingUrlProperties: string = URLHelper.getJitsiUrl(config, 0, testSubject);
    expect(JitsiMeetingUrlProperties).toContain("Test-Meeting-for-new-employee-");
  });

  it("should return a room containing subject line", () => {
    const config: Config = {}
    const testSubject: string = 'Möte angående:;nästa +?"!sprint¤%€${€$[{]£$@£$£.,-.-...,,,,.-.-,.---.-,,.,._++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++';
    const JitsiMeetingUrlProperties: string = URLHelper.getJitsiUrl(config, 0, testSubject);
    expect(JitsiMeetingUrlProperties).toContain("Mote-angaende-nasta-sprint-");
  });

  it("should return a room containing only meeting id", () => {
    const config: Config = {}
    const testSubject: string = '';
    const secureSubjectUrl: string = URLHelper.secureSubjectUrl(testSubject);
    expect(secureSubjectUrl).toContain("");
  });

  it("should return a room containing only 30 characters", () => {
    const config: Config = {}
    const testSubject: string = "Möte angående nästa sprint sen i fredags";
    const secureSubjectUrl: string = URLHelper.secureSubjectUrl(testSubject);
    expect(secureSubjectUrl).toHaveLength(31)
  });

  it("Should return empty string", () => {
    const testSubject: string = ':; +?"!¤%€${€$[{]£$@£$£.,-.-...,,,,.-.-,.---.-,,.,._++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++';
    const secureSubjectUrl: string = URLHelper.secureSubjectUrl(testSubject);
    expect(secureSubjectUrl).toEqual("");
  });

  it("Should return -a-_ where - is collection of unsupported chars", () => {
    const testSubject: string = ':a; +?"!¤%€${€$[{]£$@£$£.,-.-...,,,,.-.-,.---.-,,.,._++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++';
    const secureSubjectUrl: string = URLHelper.secureSubjectUrl(testSubject);
    expect(secureSubjectUrl).toEqual("-a-_");
  });
});

describe("bodyHasJitsiLink", () => {
  it("should return true if body contains Jitsi link", () => {
    const body = "Join my Jitsi Meet at https://meet.jit.si/mymeeting";
    const config: Config = {
      baseUrl: "https://meet.jit.si/",
    };

    expect(bodyHasJitsiLink(body, config)).toBe(true);
  });

  it("should return false if body does not contain Jitsi link", () => {
    const body = "Join my meeting at https://zoom.us/mymeeting";
    const config: Config = { baseUrl: "https://meet.jit.si/" };

    expect(bodyHasJitsiLink(body, config)).toBe(false);
  });

  it("should use default Jitsi URL if baseUrl is not provided in config", () => {
    const body = "Join my Jitsi Meet at https://meet.jit.si/mymeeting";
    const config: Config = {};

    expect(bodyHasJitsiLink(body, config)).toBe(true);
  });
});

describe("overwriteJitsiLinkDiv", () => {
  it("should replace the existing jisti div with a new one", () => {
    const config: Config = {
      baseUrl: "https://meet.jit.si",
    };
    const oldRoomName = config.baseUrl + "/room-name";
    const newRoomName = config.baseUrl + "/new-room-name";
    // Mock the return value of getJitsiUrl
    jest.spyOn(URLHelper, "getJitsiUrl").mockReturnValue(newRoomName);

    const dom = `
    <div id="jitsi-link">
        <a style="font-size: 1.5em;" href="${oldRoomName}">
            link
        </a>
    </div>
    `;

    const body = new DOMParser().parseFromString(dom, "text/html");
    expect(body.body.innerHTML).toContain(oldRoomName);

    const result = overwriteJitsiLinkDiv(body, config, 0);
    expect(result).toContain(newRoomName);
    expect(result).not.toContain(oldRoomName);
  });
});
