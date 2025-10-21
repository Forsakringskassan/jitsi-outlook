// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
//
// SPDX-License-Identifier: MIT

import getLocalizedStrings from "../src/localization";
import { Config, defaultFontFamily } from "../src/models/Config";
import { bodyHasJitsiLink, getJitsiLinkDiv, overwriteJitsiLinkDiv, getMeetingAdditionalTexts, getMeetingAdditionalLinks, getLocalizedText, combineBodyWithJitsiDiv } from "../src/utils/DOMHelper";
import * as URLHelper from "../src/utils/URLHelper";

describe("getJitsiLinkDOM", () => {
  it("should return alternativ links", () => {
    const config: Config = {
      meetings: [
        {
          additionalConfig: {
            toolbarButtons: "[%22microphone%22,%22camera%22,%22desktop%22,%22hangup%22]",
            startWithAudioMuted: true,
            startWithVideoMuted: false
          },
          additionalLinks: [
            {
              text: {"default": "link without camera"},
              config: {
                toolbarButtons: "[%22microphone%22,%22desktop%22,%22hangup%22]"
              }
            },
            {
              text: {"default": "link with more settings"},
              config: {
                toolbarButtons: "[%22microphone%22,%22desktop%22,%22hangup%22,%22settings%22]",
                startWithAudioMuted: false,
                startWithVideoMuted: true
              }
            }
          ]
        }
      ]
    };
    const linksText = getMeetingAdditionalLinks(config, URLHelper.getJitsiUrl(config, 0), 0);
    expect(linksText).toContain("title=\"link without camera\"");
    expect(linksText).toContain("title=\"link with more settings\"");
    expect(linksText).toContain("#config.toolbarButtons=[%22microphone%22,%22desktop%22,%22hangup%22]");
    expect(linksText).toContain("#config.toolbarButtons=[%22microphone%22,%22desktop%22,%22hangup%22,%22settings%22]&config.startWithAudioMuted=false&config.startWithVideoMuted=true");
  });

  it("test localizedText", () => {
    const config: Config = {
      meetings: [
        {
          additionalConfig: {
            toolbarButtons: "[%22microphone%22,%22camera%22,%22desktop%22,%22hangup%22]",
            startWithAudioMuted: true,
            startWithVideoMuted: false
          },
          additionalLinks: [
            {
              text: {"en-GB": "LINK WITHOUT CAMERA", "default": "link without camera"},
              config: {
                toolbarButtons: "[%22microphone%22,%22desktop%22,%22hangup%22]"
              }
            }
          ],
          additionalTexts: [
            {
              fontSize: "12px",
              texts: [
                {
                  addNewLine: true,
                  text: {"en-GB": "Wiki", "default": "Wikipedia"},
                  url: {"default": "https://wikipedia.com"}
                }
              ]
            }
          ]
        }
      ]
    };
    expect(getLocalizedText(config.meetings[0].additionalLinks[0].text, "en-GB", "")).toEqual("LINK WITHOUT CAMERA");
    expect(getLocalizedText(config.meetings[0].additionalLinks[0].text, "def", "")).toEqual("link without camera");
    expect(getLocalizedText(null, "en", "")).toEqual("");
    expect(getLocalizedText(config.meetings[0].additionalTexts[0].texts[0].text, "en-GB", "")).toEqual("Wiki");
    expect(getLocalizedText(config.meetings[0].additionalTexts[0].texts[0].text, "default", "")).toEqual("Wikipedia");
    expect(getLocalizedText(config.meetings[0].additionalTexts[0].texts[0].url, "def", "")).toEqual("https://wikipedia.com");
    expect(getLocalizedText(undefined, "en", "")).toEqual("");
  });

  it("should return additional texts", () => {
    const config: Config = {
      meetings: [
        {
          additionalTexts: [
            {
              fontSize: "12px",
              texts: [
                {
                  addNewLine: false,
                  text: {"default": "created by Outlook Plugin"}
                },
                {
                  addNewLine: true,
                  text: {"default": "Wikipedia"},
                  url: {"default": "https://wikipedia.com"}
                }
              ]
            }
          ]
        }
      ]
    };

    const textsText = getMeetingAdditionalTexts(config, 0);
    expect(textsText).toContain("<span style=\"font-size: 12px; font-family: 'Arial'; color: #000000;\">");
    expect(textsText).toContain("created by Outlook Plugin");
    expect(textsText).toContain("title=\"Wikipedia\"");
    expect(textsText).toContain("href=\"https://wikipedia.com\"");
  });

  it("should return additional texts, with different fonts and color", () => {
    const config: Config = {
      globalAdditionalTexts: [
        {
          fontSize: "12px",
          fontFamily: "Segoe UI",
          fontColor: "#0b12f4",
          texts: [
            {
              addNewLine: true,
              text: {"default": "sponsored by Outlook Plugin GLOBAL"}
            }
          ]
        }
      ],
      meetings: [
        {
          additionalTexts: [
            {
              fontSize: "12px",
              fontFamily: "Segoe UI",
              fontColor: "#0b12f4",
              texts: [
                {
                  addNewLine: false,
                  text: {"default": "created by Outlook Plugin"}
                }
              ]
            }
          ]
        }
      ]
    };

    const textsText = getMeetingAdditionalTexts(config, 0);
    expect(textsText).toContain("<span style=\"font-size: 12px; font-family: 'Segoe UI'; color: #0b12f4;\">");
    expect(textsText).toContain(config.meetings[0].additionalTexts[0].texts[0].text["default"]);
    expect(textsText).toContain(config.globalAdditionalTexts[0].texts[0].text["default"]);
  });

  it("should return additional texts, with different fonts and color, multiple", () => {
    const config: Config = {
      meetings: [
        {
          additionalTexts: [
            {
              fontSize: "12px",
              fontFamily: "Segoe UI",
              fontColor: "#0b12f4",
              texts: [
                {
                  addNewLine: false,
                  text: {"default": "created by Outlook Plugin"}
                }
              ]
            },
            {
              fontSize: "16px",
              fontFamily: "Arial",
              fontColor: "#13b6f7",
              texts: [
                {
                  addNewLine: false,
                  text: {"default": "Wikipedia"},
                  url: {"default": "http://wikipedia.com"}
                }
              ]
            }
          ]
        }
      ]
    };

    const textsText = getMeetingAdditionalTexts(config, 0);
    expect(textsText).toContain("<span style=\"font-size: 12px; font-family: 'Segoe UI'; color: #0b12f4;\">");
    expect(textsText).toContain("<span style=\"font-size: 16px; font-family: 'Arial'; color: #13b6f7;\">");
    expect(textsText).toContain(config.meetings[0].additionalTexts[0].texts[0].text["default"]);
    expect(textsText).toContain(config.meetings[0].additionalTexts[1].texts[0].text["default"]);
  });

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
      globalAdditionalTexts: [
        {
          texts: [
            {
              text: {"default": "Testa"},
              addNewLine: true
            }
          ]
        }
      ],
      meetings: [
        {
          type: "StandardMeeting",
          meetingHeader: {"default": "Header line"},
          additionalTexts: [
            {
              texts: [
                {
                  text: {"default": "This is additional text"},
                  addNewLine: false
                }
              ]
            }
          ]
        }
      ],
    };
    const jitsiUrl = URLHelper.getJitsiUrl(config, 0);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config, 0);
    expect(jitsiLinkDOM).toContain(config.meetings[0].additionalTexts[0].texts[0].text["default"]);
    expect(jitsiLinkDOM).not.toContain("undefined");
    expect(jitsiLinkDOM).toContain("Header line");

    const combineJitsiBody = combineBodyWithJitsiDiv("", config, 0);
    expect(combineJitsiBody).toContain("Header line");
    config.meetings[0].meetingHeader = {"default": "Header Line 2!"};
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(combineJitsiBody, "text/html");
    const overwriteLinkDiv = overwriteJitsiLinkDiv(htmlDoc, config, 0);
    expect(overwriteLinkDiv).toContain("Header Line 2!");
  });

  it("should include the additionalLink if provided in config", () => {
    const config: Config = {
      globalAdditionalLinks: [
        {
          fontSize: "12px",
          fontFamily: "Segoe UI",
          fontColor: "#0d85c7",
          text: {"default": "Join meeting as a moderator"},
          config: {}
        }
      ],
      meetings: [
        {
          type: "StandardMeeting",
          additionalTexts: [
            {
              texts: [
                {
                  text: {"default": "This is additional text"},
                  addNewLine: false
                }
              ]
            }
          ]
        }
      ],
    };
    const jitsiUrl = URLHelper.getJitsiUrl(config, 0);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config, 0);
    expect(jitsiLinkDOM).toContain(config.meetings[0].additionalTexts[0].texts[0].text["default"]);
    expect(jitsiLinkDOM).toContain(config.globalAdditionalLinks[0].text["default"]);
    expect(jitsiLinkDOM).not.toContain("undefined");
  });

  it("should not include the additionalText if not provided in config", () => {
    const config: Config = {};
    const jitsiUrl = URLHelper.getJitsiUrl(config);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).not.toContain("additionalText");
    expect(jitsiLinkDOM).not.toContain("undefined");
  });

  it("check that the div is present or not when set in config", () => {
    let config: Config = {useDiv: true};
    let jitsiUrl = URLHelper.getJitsiUrl(config);
    let jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).toContain("<hr style=\"color: #ffffff; border-color: #ffffff\">");
    expect(jitsiLinkDOM).not.toContain("undefined");

    config = {};
    jitsiUrl = URLHelper.getJitsiUrl(config);
    jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).not.toContain("<hr style=\"color: #ffffff; border-color: #ffffff\">");
    expect(jitsiLinkDOM).not.toContain("undefined");

    config = {useDiv: false};
    jitsiUrl = URLHelper.getJitsiUrl(config);
    jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).not.toContain("<hr style=\"color: #ffffff; border-color: #ffffff\">");
    expect(jitsiLinkDOM).not.toContain("undefined");
  });

  it("check that the img is present or not when set in config", () => {
    let config: Config = {useGraphics: true};
    let jitsiUrl = URLHelper.getJitsiUrl(config);
    let jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).toContain(`<img style="vertical-align: middle;" width="18" height="18"`);
    expect(jitsiLinkDOM).not.toContain("undefined");

    config = {};
    jitsiUrl = URLHelper.getJitsiUrl(config);
    jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).not.toContain(`<img style="vertical-align: middle;" width="18" height="18"`);
    expect(jitsiLinkDOM).not.toContain("undefined");

    config = {useGraphics: false};
    jitsiUrl = URLHelper.getJitsiUrl(config);
    jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).not.toContain(`<img style="vertical-align: middle;" width="18" height="18"`);
    expect(jitsiLinkDOM).not.toContain("undefined");
  });

  it("should include the specified font if fontFamily is provided in config", () => {
    const config: Config = {
      fontFamily: "Times New Roman",
    };
    const jitsiUrl = URLHelper.getJitsiUrl(config);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).toContain(config.fontFamily);
    expect(jitsiLinkDOM).not.toContain(defaultFontFamily);
    expect(jitsiLinkDOM).not.toContain("undefined");
  });

  it("should include the default font if fontFamily is not provided in config", () => {
    const config: Config = {};
    const jitsiUrl = URLHelper.getJitsiUrl(config);
    const jitsiLinkDOM = getJitsiLinkDiv(jitsiUrl, config);

    expect(jitsiLinkDOM).toContain(defaultFontFamily);
    expect(jitsiLinkDOM).not.toContain("undefined");
  });

  it("should return a room containing subject line", () => {
    const config: Config = {}
    const testSubject: string = 'Test Meeting:;for +?"!new¤%€${€$[{]£$@£$£employee.,-.-...,,,,.-.-,.---.-,,.,._++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++';
    const JitsiMeetingUrlProperties: string = URLHelper.getJitsiUrl(config, undefined, testSubject);
    expect(JitsiMeetingUrlProperties).toContain("Test-Meeting-for-new-employee-");
  });

  it("should return a room containing subject line", () => {
    const config: Config = {}
    const testSubject: string = 'Möte angående:;nästa +?"!sprint¤%€${€$[{]£$@£$£.,-.-...,,,,.-.-,.---.-,,.,._++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++';
    const JitsiMeetingUrlProperties: string = URLHelper.getJitsiUrl(config, undefined, testSubject);
    expect(JitsiMeetingUrlProperties).toContain("Mote-angaende-nasta-sprint-");
  });

  it("should return a room containing only meeting id", () => {
    const testSubject: string = '';
    const secureSubjectUrl: string = URLHelper.secureSubjectUrl(testSubject);
    expect(secureSubjectUrl).toContain("");
  });

  it("should return a room containing only 30 characters", () => {
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

    const result = overwriteJitsiLinkDiv(body, config);
    expect(result).toContain(newRoomName);
    expect(result).not.toContain(oldRoomName);
  });
});

describe("overwriteJitsiLinkDiv", () => {
  it("should override the localizedlink for the meeting", () => {
    let config: Config = {
      baseUrl: "https://meet.jit.si",
      currentLanguage: "sv"
    };
    let output = getJitsiLinkDiv(config.baseUrl, config);
    expect(output).toContain("Länk till mötet");

    config = {
      baseUrl: "https://meet.jit.si",
      currentLanguage: "sv",
      overrideLinkToMeeting: {"sv": "TEST LINK"},
      overrideConnectToMeeting: {"sv": "Anslut till mötet"}
    };
    output = getJitsiLinkDiv(config.baseUrl, config);
    expect(output).toContain("TEST LINK");
    expect(output).toContain("Anslut till mötet");

    config = {
      baseUrl: "https://meet.jit.si",
      currentLanguage: "en",
      overrideLinkToMeeting: {"sv": "TEST LINK"}
    };
    output = getJitsiLinkDiv(config.baseUrl, config);
    expect(output).toContain("Link to meeting");
  });
});
