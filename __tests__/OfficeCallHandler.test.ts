// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
//
// SPDX-License-Identifier: MIT

/**
 * @jest-environment jsdom
 */

import { Config } from "../src/models/Config";
import { OfficeMockObject } from "office-addin-mock";
import { setLocationTest, setDataTest, addMeeting } from "../src/utils/OfficeCallHandler";
const { setLocation } = setLocationTest;
const { setData } = setDataTest;

/* global Office */

enum CoercionType {
  Html,
}
interface result {
  value?: string;
}
const mockDataServer = {
  host: "outlook",
  CoercionType,
  context: {
    displayLanguage: "sv-SE",
    mailbox: {
      item: {
        location: {
          location: "",
          setAsync: async function (location: string) {
            this.location = location;
          },
          getAsync: async function (callback: (r: result) => void) {
            let r: result = { value: this.location } as result;
            callback(r);
          },
        },
        body: {
          data: "",
          opt: {},
          setAsync(str: string, opt?: Office.CoercionTypeOptions) {
            this.data = str;
            if (opt) {
              this.opt = opt;
            }
          },
          getAsync(opt: CoercionType, callback: (data: result) => void) {
            if (opt == CoercionType.Html) {
              let r: result = { value: this.data } as result;
              callback(r);
            } else {
              let er: result = { value: "error" } as result;
              callback(er);
            }
          },
        },
        subject: {
          subject: "",
          getAsync(callback: (subject: result) => void) {
            const re = { value: this.subject } as result;
            callback(re);
          },
        },
      },
    },
  },
};

describe("Connection test to server", () => {
  it("Set location", async () => {
    const setLocationMock = new OfficeMockObject(mockDataServer) as any;
    global.Office = setLocationMock;
    const config: Config = { locationString: {"default": "test"} } as Config;
    let location: string = "";

    await setLocation(config);
    Office.context.mailbox.item?.location.getAsync((r) => { location = r.value });

    expect(setLocationMock.context.mailbox.item.location.location).toBe(config.locationString["default"]);
    expect(location).toBe(config.locationString["default"]);
  });

  it("Set location default", async () => {
    const setLocationMock = new OfficeMockObject(mockDataServer) as any;
    global.Office = setLocationMock;
    const config: Config = {};
    let location: string = "";

    await setLocation(config);
    Office.context.mailbox.item?.location.getAsync((r) => { location = r.value });

    expect(setLocationMock.context.mailbox.item.location.location).toBe("Jitsi meeting");
    expect(location).toBe("Jitsi meeting");
  });

  it("Set location default, duplication and whitespace test", async () => {
    const setLocationMock = new OfficeMockObject(mockDataServer) as any;
    global.Office = setLocationMock;
    const config: Config = {};
    let location: string = "";

    await setLocation(config);
    await setLocation(config);
    Office.context.mailbox.item?.location.getAsync((r) => { location = r.value });

    expect(setLocationMock.context.mailbox.item.location.location).toBe("Jitsi meeting");
    expect(location).toBe("Jitsi meeting");

    setLocationMock.context.mailbox.item.location.location = "RoomA; RoomB;";
    await setLocation(config);
    Office.context.mailbox.item?.location.getAsync((r) => { location = r.value });

    expect(setLocationMock.context.mailbox.item.location.location).toBe("RoomA; RoomB; Jitsi meeting");
    expect(location).toBe("RoomA; RoomB; Jitsi meeting");

    setLocationMock.context.mailbox.item.location.location = "RoomA; RoomB";
    await setLocation(config);
    Office.context.mailbox.item?.location.getAsync((r) => { location = r.value });

    expect(setLocationMock.context.mailbox.item.location.location).toBe("RoomA; RoomB; Jitsi meeting");
    expect(location).toBe("RoomA; RoomB; Jitsi meeting");

    setLocationMock.context.mailbox.item.location.location = "RoomA; RoomB;                          ";
    await setLocation(config);
    Office.context.mailbox.item?.location.getAsync((r) => { location = r.value });

    expect(setLocationMock.context.mailbox.item.location.location).toBe("RoomA; RoomB; Jitsi meeting");
    expect(location).toBe("RoomA; RoomB; Jitsi meeting");
  });

  it("Set html body information", async () => {
    const setDataMock = new OfficeMockObject(mockDataServer) as any;
    global.Office = setDataMock;

    await setData("Hello");

    expect(setDataMock.context.mailbox.item.body.data).toBe("Hello");
    expect(setDataMock.context.mailbox.item.body.opt.coercionType).toBe(CoercionType.Html);
  });

  it("Add meeting test, no config", async () => {
    const addMeetingMock = new OfficeMockObject(mockDataServer) as any;
    global.Office = addMeetingMock;
    const config: Config = {} as Config;
    let location: string = "";
    let body: string = "";
    let opt: Office.CoercionType = Office.CoercionType.Html;

    await addMeeting("StandardMeeting", config, "");

    Office.context.mailbox.item.location.getAsync((r) => { location = r.value });
    Office.context.mailbox.item.body.getAsync(opt, (r) => { body = r.value });
    expect(location).toBe("Jitsi meeting");
    expect(body).toContain('div id="jitsi-link"');
  });

  it("Add meeting test, with config", async () => {
    const addMeetingMock = new OfficeMockObject(mockDataServer) as any;
    global.Office = addMeetingMock;
    const config: Config = {
      baseUrl: "https://my-custom-base-url.com/",
      meetings: [
        {
          type: "StandardMeeting",
          additionalConfig: {
            startWithAudioMuted: true,
          }
        }
      ]
    } as Config;
    let location: string = "";
    let body: string = "";
    let opt: Office.CoercionType = Office.CoercionType.Html;

    await addMeeting("StandardMeeting", config, "");

    Office.context.mailbox.item.location.getAsync((r) => { location = r.value });
    Office.context.mailbox.item.body.getAsync(opt, (r) => { body = r.value });
    expect(location).toBe("Jitsi meeting");
    expect(body).toContain('div id="jitsi-link"');
    expect(body).toContain('#config.startWithAudioMuted=true')
  });
});
