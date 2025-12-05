// SPDX-FileCopyrightText: 2025 Försäkringskassan
//
// SPDX-License-Identifier: MIT

import officeAddins from "eslint-plugin-office-addins";
import tsParser from "@typescript-eslint/parser";
import tsEsLint from "typescript-eslint";
import jest from "eslint-plugin-jest";
import json from "eslint-plugin-json";

export default [
  ...tsEsLint.configs.recommended,
  ...officeAddins.configs.recommended,
  {
    plugins: {
      "office-addins": officeAddins,
      json,
    },
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    files: ["**/*.test.ts"],
    ...jest.configs["flat/recommended"],
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/prefer-expect-assertions": "off",
    },
  },
  {
    files: ["**/*.json"],
    language: "json/json",
    rules: {
      "json/no-duplicate-keys": "error",
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: "script",
      parserOptions: {
        project: ["tsconfig.json"],
      },
      globals: {
        Office: "readonly",
      },
    },
  },
];
