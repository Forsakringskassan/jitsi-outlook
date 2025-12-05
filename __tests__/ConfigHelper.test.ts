// SPDX-FileCopyrightText: 2025 Försäkringskassan
//
// SPDX-License-Identifier: MIT

/**
 * @jest-environment jsdom
 */

/* global global */

import mock from "xhr-mock";
import { OfficeMockObject } from "office-addin-mock";
import { getConfigXHR, getMeetingConfig, getDomain } from "../src/utils/ConfigHelper";
import { Config } from "../src/models/Config";
import testConfig from "./controll.test.json";

enum CoercionType {
  Html,
}

const mockDataServer = {
  host: "outlook",
  CoercionType,
  context: {
    mailbox: {
      userProfile: {
        emailAddress: "test@controLL.test",
      },
    },
  },
};

const mockDataUndefinedServer = {
  host: "outlook",
  CoercionType,
  context: {
    mailbox: {
      userProfile: {
        emailAddress: undefined,
      },
    },
  },
};

const mockDataServerError = {
  host: "outlook",
  CoercionType,
  context: {
    mailbox: {
      userProfile: {
        emailAddress: "test@controoll.test",
      },
    },
  },
};

const nullConfig: Config = {
  baseUrl: "null",
  meetings: [],
};

describe("Test ConfigHelper", () => {
  beforeEach(() => mock.setup());

  afterEach(() => mock.teardown());
  it("should get mock config", async () => {
    const userProfile = new OfficeMockObject(mockDataServer);
    global.Office = userProfile as never;
    mock.get("/controll.test/config.json", {
      body: JSON.stringify(testConfig),
    });
    let l_config: Config = nullConfig;
    let error: string = "";
    getConfigXHR((config, e) => {
      l_config = config;
      error = e;
    }, "");
    expect(l_config).toEqual(testConfig);
    expect(error).toEqual("");
  });

  it("should get empty config", async () => {
    const userProfile = new OfficeMockObject(mockDataServer);
    global.Office = userProfile as never;
    mock.get("/controll.test/config.json", {
      body: JSON.stringify(testConfig),
    });
    let l_config: Config = nullConfig;
    let error: string = "";
    getConfigXHR((config, e) => {
      l_config = config;
      error = e;
    });
    expect(l_config).toEqual({});
    expect(error).toEqual("");
  });

  it("should get empty config, error", async () => {
    const userProfile = new OfficeMockObject(mockDataServerError);
    global.Office = userProfile as never;
    mock.get("/controoll.test/config.json", {
      body: "Error file not found",
      status: 404,
      reason: "Not found",
    });
    let l_config: Config = nullConfig;
    let error: string = "";
    getConfigXHR((config, e) => {
      l_config = config;
      error = e;
    }, "");
    expect(l_config).toEqual({});
    expect(error).toEqual("Error fetching config: /controoll.test/config.json<br><br>Error code: 404<br>Error message: Error file not found<br>");
  });

  it("fetch meeting information", async () => {
    const index: number = getMeetingConfig(testConfig, "StandardMeeting");
    expect(index).toBe(0);
    expect(testConfig.meetings[index]?.type).toBe("StandardMeeting");
  });

  it("fetch meeting information 2", async () => {
    const index: number = getMeetingConfig(testConfig, "InformationMeeting");
    expect(index).toBe(1);
    expect(testConfig.meetings[index]?.type).toBe("InformationMeeting");
  });

  it("test getDomain()", async () => {
    const userProfile = new OfficeMockObject(mockDataServer);
    global.Office = userProfile as never;
    let email = getDomain();
    expect(email).toBe("controll.test");

    const undefinedProfile = new OfficeMockObject(mockDataUndefinedServer);
    global.Office = undefinedProfile as never;
    email = getDomain();
    expect(email).toBe(null);
  });
});
