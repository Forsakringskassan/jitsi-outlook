// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
// SPDX-FileCopyrightText: 2025 Försäkringskassan
//
// SPDX-License-Identifier: MIT

/* eslint-disable no-undef */
module.exports = {
  moduleNameMapper: {
    uuid: require.resolve("uuid"),
  },
  testEnvironment: "jest-environment-jsdom",
};
