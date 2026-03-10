import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist/**"]
  },
  {
    files: ["**/*.{js,cjs,ts}"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ["eslint.config.mjs"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ["test/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.mocha
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.ts"]
  })),
  {
    files: ["**/*.ts"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-var": "error",
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];
