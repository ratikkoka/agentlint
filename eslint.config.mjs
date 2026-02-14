import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import n from "eslint-plugin-n";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  {
    ignores: ["dist/", "node_modules/"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPlugin.configs["flat/recommended"],
  n.configs["flat/recommended"],
  {
    files: ["src/**/*.ts", "tests/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir,
      },
    },
    rules: {
      // TypeScript handles module resolution; eslint-plugin-n cannot resolve
      // extensionless .ts imports
      "n/no-missing-import": "off",
      "n/no-unpublished-import": "off",
    },
  },
);
