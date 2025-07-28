// SPDX-FileCopyrightText: 2025 Försäkringskassan
//
// SPDX-License-Identifier: MIT

import { defineConfig } from "eslint/config";
import officeAddins from "eslint-plugin-office-addins";
import tsParser from "@typescript-eslint/parser";
import jest from "eslint-plugin-jest";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    plugins: {
        "office-addins": officeAddins,
    },

    languageOptions: {
        parser: tsParser,
    },
}, {
    files: ["**/*.ts"],

    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: ["tsconfig.json"],
        },
    },
}, {
    files: ["**/*.test.ts"],

    plugins: {
        jest,
    },

    languageOptions: {
        globals: {
            ...globals.jest,
        },
    },
}]);
