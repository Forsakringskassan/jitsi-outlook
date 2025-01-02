// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
//
// SPDX-License-Identifier: MIT

/**
 * @jest-environment jsdom
 */

import mock from "xhr-mock";
import { OfficeMockObject } from "office-addin-mock";
import { getConfigXHR, getMeetingConfig } from "../src/utils/ConfigHelper";
import { Config } from "../src/models/Config";

enum CoercionType {
  Html,
}

const mockDataServer = {
  host: "outlook",
  CoercionType,
  context: {
    mailbox: {
      userProfile: {
        emailAddress: "test@controll.test",
      },
    },
  },
};

const testConfig: Config = { baseUrl: "https://meet.sgit.se/", meetings: [{ type: "StandardMeeting", startWithAudioMuted: true, startWithVideoMuted: true }] };

const nullConfig: Config = {
  baseUrl: "null",
  meetings: [],
};

describe('Test ConfigHelper', () => {

  beforeEach(() => mock.setup());

  afterEach(() => mock.teardown());
  it('should get mock config', async () => {
    const userProfile = new OfficeMockObject(mockDataServer);
    global.Office = userProfile as any;
    mock.get('controll.test/config.json', {
      body: JSON.stringify(testConfig)
    });
    let l_config: Config = nullConfig;
    getConfigXHR((config) => {
      l_config = config;
    }, "");
    expect(l_config).toEqual(testConfig);
  });

  it('should get empty config', async () => {
    const userProfile = new OfficeMockObject(mockDataServer);
    global.Office = userProfile as any;
    mock.get('controll.test/config.json', {
      body: JSON.stringify(testConfig)
    });
    let l_config: Config = nullConfig;
    getConfigXHR((config) => {
      l_config = config;
    });
    expect(l_config).toEqual({});
  });

  it('fetch meeting information', async () => {
    const index: number = getMeetingConfig(testConfig, 'StandardMeeting');
    expect(index).toBe(0);
    expect(testConfig.meetings[index]?.type).toBe('StandardMeeting');
  });
});
