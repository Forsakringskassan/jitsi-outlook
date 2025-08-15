// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
//
// SPDX-License-Identifier: MIT

module.exports = {
    moduleNameMapper: {
      "uuid": require.resolve('uuid'),
    },
    testEnvironment: "jest-environment-jsdom",
}
