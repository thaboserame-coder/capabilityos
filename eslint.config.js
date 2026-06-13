import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import storybook from "eslint-plugin-storybook";
import prettierConfig from "eslint-config-prettier";

/**
 * Flat ESLint config (ESLint 9).
 *
 * Goals:
 *  - Zero warnings on `npm run lint` (CI runs with `--max-warnings=0`).
 *  - React 18 + hooks correctness via `eslint-plugin-react-hooks` v5.
 *  - Accessibility linting via `eslint-plugin-jsx-a11y` (WCAG 2.1 AA support).
 *  - Vite Fast Refresh constraints via `eslint-plugin-react-refresh`.
 *  - Formatting is owned entirely by Prettier — `eslint-config-prettier`
 *    disables any ESLint rules that would conflict with `prettier --check`.
 */
export default [
  {
    // Files/directories ESLint should never look at.
    ignores: [
      "dist/**",
      "coverage/**",
      "node_modules/**",
      "storybook-static/**",
      "cypress/videos/**",
      "cypress/screenshots/**",
      "cypress/downloads/**",
    ],
  },

  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"], // React 18 JSX transform: no `import React` required for JSX
  jsxA11y.flatConfigs.recommended,

  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // PropTypes are not used (JSDoc typedefs document props instead, per
      // docs/ARCHITECTURE.md "Type Safety") — disable the prop-types rule
      // rather than leave it silently failing.
      "react/prop-types": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },

  // Node-context files (Vite config, Vercel serverless functions, configs).
  {
    files: [
      "vite.config.js",
      "eslint.config.js",
      "api/**/*.js",
      "cypress.config.js",
      ".storybook/**/*.js",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Cypress E2E specs and support files: Mocha/Cypress test globals plus
  // Node (config/support files run under Node via the Cypress runner).
  {
    files: ["cypress/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        cy: "readonly",
        Cypress: "readonly",
        describe: "readonly",
        context: "readonly",
        it: "readonly",
        specify: "readonly",
        before: "readonly",
        beforeEach: "readonly",
        after: "readonly",
        afterEach: "readonly",
        expect: "readonly",
        assert: "readonly",
      },
    },
  },

  // Test files (Vitest globals: describe/it/expect/vi via `test.globals: true`).
  {
    files: ["src/**/*.test.{js,jsx}", "src/test/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
  },

  // Storybook story files: official storybook lint rules (story shape,
  // hierarchy separators, etc.) plus an exemption from the Fast Refresh
  // "only export components" rule, since CSF files export `meta` and
  // multiple named story objects alongside the default-exported component.
  //
  // Spread as-is: the first entry registers the `storybook` plugin with no
  // `files` restriction (so it's available to every config object below that
  // references `storybook/*` rules, including the `.storybook/main.js`
  // entry), while the remaining entries already carry the correct `files`
  // globs for story files and the Storybook config file respectively.
  ...storybook.configs["flat/recommended"],
  {
    files: ["src/**/*.stories.jsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  // Storybook configuration (main.js, preview.jsx): export shapes required
  // by Storybook (config objects, decorator functions) don't follow the
  // "only export components" convention.
  {
    files: [".storybook/**/*.{js,jsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  // Prettier MUST be last: it turns off stylistic rules that would
  // otherwise conflict with `prettier --check` / `prettier --write`.
  prettierConfig,
];
