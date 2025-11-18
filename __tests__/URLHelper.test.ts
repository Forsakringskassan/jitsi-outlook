// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
//
// SPDX-License-Identifier: MIT

import { Config, defaultMeetJitsiUrl } from "../src/models/Config";
import { getRandomRoomName, getConfigUrl, getJitsiUrl } from "../src/utils/URLHelper";

describe("getRandomRoomName", () => {
  it("should return a string of length 16", () => {
    const roomName = getRandomRoomName();
    expect(roomName).toHaveLength(16);
  });
});

describe("getConfigUrl", () => {
  it("should return concatinated link", () => {
    const config: Config = {
      meetings: [
        {
          additionalConfig: {
            "config.toolbarButtons": "[%22microphone%22,%22camera%22,%22desktop%22,%22hangup%22]",
            "config.startWithAudioMuted": true,
            "config.startWithVideoMuted": false
          }
        }
      ]
    };
    const jitsiUrl = getJitsiUrl(config, 0);
    expect(jitsiUrl).toContain("#config.toolbarButtons=[%22microphone%22,%22camera%22,%22desktop%22,%22hangup%22]&config.startWithAudioMuted=true&config.startWithVideoMuted=false")
  });

  it("should return an empty string if config.meetingUrl is not provided", () => {
    const config: Config = {};
    const configUrl = getConfigUrl(config);
    expect(configUrl).toBe("");
  });

  it("should return the correct config URL if config.meetingUrl is provided", () => {
    const config: Config = {
      meetings: [
        {
          additionalConfig: {
            "config.startWithAudioMuted": true,
            "config.startWithVideoMuted": true
          }
        }
      ],
    };
    const configUrl = getConfigUrl(config.meetings[0].additionalConfig);
    expect(configUrl).toBe("#config.startWithAudioMuted=true&config.startWithVideoMuted=true");
  });

  it("should return the correct config URL if config.meetingUrl is provided", () => {
    const config: Config = {
      meetings: [
        {
          type: "StandardMeeting",
          additionalConfig: {
            "config.startWithAudioMuted": true,
            "config.startWithVideoMuted": true
          }
        }
      ],
    };
    const configUrl = getConfigUrl(config.meetings[0].additionalConfig);
    expect(configUrl).toBe("#config.startWithAudioMuted=true&config.startWithVideoMuted=true");
  });
});

describe("getJitsiUrl", () => {
  it("should use defaultMeetJitsiUrl if config.baseUrl is not provided", () => {
    const config: Config = {};
    const jitsiUrl = getJitsiUrl(config);
    expect(jitsiUrl).toContain(defaultMeetJitsiUrl);
  });

  it("should use config.baseUrl if provided", () => {
    const config: Config = {
      baseUrl: "https://my-custom-base-url.com/",
    };
    const jitsiUrl = getJitsiUrl(config);
    expect(jitsiUrl).toContain(config.baseUrl);
  });

  it("should append the random room name and config URL", () => {
    const config: Config = {
      baseUrl: "https://my-custom-base-url.com/",
      meetings: [
        {
          type: "StandardMeeting",
          additionalConfig: {
            "config.startWithAudioMuted": true,
            "config.startWithVideoMuted": true,
          }
        }
      ]
    };
    const jitsiUrl = getJitsiUrl(config, 0);
    expect(jitsiUrl).toContain(config.baseUrl);
    expect(jitsiUrl).toContain(getConfigUrl(config.meetings[0].additionalConfig));
  });

  it("should add suffix and prefix to string", () => {
    const config: Config = {
      baseUrl: "https://my-custom-base-url.com/",
      meetings: [
        {
          type: "StandardMeeting",
          meetingSuffix: "_authx",
          meetingPrefix: "comp_",
          additionalConfig: {
            "config.startWithAudioMuted": true,
            "config.startWithVideoMuted": true,
          }
        }
      ]
    };
    const jitsiUrl = getJitsiUrl(config, 0);
    expect(jitsiUrl).toContain(config.baseUrl);
    expect(jitsiUrl).toContain(getConfigUrl(config.meetings[0].additionalConfig));
    expect(jitsiUrl).toContain("comp_");
    expect(jitsiUrl).toContain("_authx");
  });
});
