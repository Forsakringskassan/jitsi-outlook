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

interface EmailUserResult {
  value: [{
    displayName: string;
    emailAddress: string;
  }];
}

const mockDataServer = {
  host: "outlook",
  CoercionType,
  AsyncResultStatus: 0,
  context: {
    displayLanguage: "sv-SE",
    mailbox: {
      diagnostics: {
        OWAView: undefined
      },
      item: {
        requiredAttendees: {
          attendees: {value:[
            {
              displayName: "Jane Doe",
              emailAddress: "jane.doe@controll.test"
            }
          ]},
          addAsync: async function (user: {displayName: string, emailAddress: string}[], callback: (r: Office.AsyncResultStatus) => void) {
            user.forEach(u => {
              this.attendees.value.push({"displayName": u.displayName, "emailAddress": u.emailAddress})
            });
            callback(0)
          },
          getAsync: async function (callback: (r: EmailUserResult[]) => void) {
            let r: EmailUserResult[] = this.attendees
            callback(r)
          },
          setAsync: async function (value, callback: (r: Office.AsyncResultStatus, res: EmailUserResult[]) => void) {
            this.attendees.value = value;
            callback(0, this.attendees)
          }
        },
        organizer: {
          value: {
            displayName: "John Doe",
            emailAddress: "john.doe@controll.test",
          },
          getAsync: async function (callback: (r: EmailUserResult) => void) {
            let r: EmailUserResult = { value: this.value } as EmailUserResult;
            callback(r)
          }
        },
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
    let attendees: {value:{displayName: string, emailAddress: string}[]} = {value:[]};
    let opt: Office.CoercionType = Office.CoercionType.Html;

    await addMeeting("StandardMeeting", config, "");

    Office.context.mailbox.item.location.getAsync((r) => { location = r.value });
    Office.context.mailbox.item.body.getAsync(opt, (r) => { body = r.value });
    Office.context.mailbox.item.requiredAttendees.getAsync((r) => { r.value.forEach(u =>{attendees.value.push({"displayName": u.displayName, "emailAddress": u.emailAddress})})});
    let testAttende: {displayName: string, emailAddress: string}[] = [{"displayName": "Jane Doe", "emailAddress": "jane.doe@controll.test"}]
    expect(location).toBe("Jitsi meeting");
    expect(body).toContain('div id="jitsi-link"');
    expect(attendees.value).toStrictEqual(testAttende);
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
            "config.startWithAudioMuted": true
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
    expect(body).toContain('#config.startWithAudioMuted=true');
  });

  it("Test if client is used or OWA web", async () => {
    const owaMock = new OfficeMockObject(mockDataServer) as any;
    global.Office = owaMock;
    const config: Config = {
      baseUrl: "https://my-custom-base-url.com/",
      meetings: [
        {
          type: "StandardMeeting",
          additionalConfig: {
            "config.startWithAudioMuted": true
          }
        }
      ]
    } as Config;
    let attendees: {value:{displayName: string, emailAddress: string}[]} = {value:[]};
    let e: string = "";
    await addMeeting("StandardMeeting", config, e);
    Office.context.mailbox.item.requiredAttendees.getAsync((r) => {r.value.forEach(e => {attendees.value.push({"displayName": e.displayName, "emailAddress": e.emailAddress})})})
    let testAttende: {displayName: string, emailAddress: string}[] = [{"displayName": "Jane Doe", "emailAddress": "jane.doe@controll.test"}]
    expect(attendees.value).toStrictEqual(testAttende);

    attendees = {value:[]};
    Office.context.mailbox.diagnostics.OWAView = "OneColumn";
    Office.context.mailbox.item.requiredAttendees.addAsync([{displayName: "John Doe", emailAddress: "john.doe@controll.test"}], (_) => {});
    await addMeeting("StandardMeeting", config, e);
    let testAttendeNo: {displayName: string, emailAddress: string}[] = [{"displayName": "Jane Doe", "emailAddress": "jane.doe@controll.test"},{"displayName": "John Doe", "emailAddress": "john.doe@controll.test"}]
    Office.context.mailbox.item.requiredAttendees.getAsync((r) => {r.value.forEach(e => {attendees.value.push({"displayName": e.displayName, "emailAddress": e.emailAddress})})})
    expect(attendees.value).toStrictEqual(testAttendeNo);
  });
});
