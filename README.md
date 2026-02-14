# eslint-plugin-agentlint

Static AST checker for AI agent accessibility rules on JSX and HTML elements.

<p align="center">
  <a href="https://github.com/ratikkoka/agentlint/actions">
    <img src="https://img.shields.io/github/check-runs/ratikkoka/eslint-plugin-agentlint/main"
         alt="CI status" />
  </a>
  <a href="https://npmjs.org/package/eslint-plugin-agentlint">
    <img src="https://img.shields.io/npm/v/eslint-plugin-agentlint.svg"
         alt="npm version" />
  </a>
  <a href="https://github.com/ratikkoka/agentlint/blob/HEAD/LICENSE">
    <img src="https://img.shields.io/npm/l/eslint-plugin-agentlint.svg"
         alt="license" />
  </a>
  <a href="https://coveralls.io/github/ratikkoka/eslint-plugin-agentlint?branch=main">
    <img src="https://coveralls.io/repos/github/ratikkoka/eslint-plugin-agentlint/badge.svg?branch=main"
         alt="Coverage Status" />
  </a>
  <a href="https://npmjs.org/package/eslint-plugin-agentlint">
    <img src="https://img.shields.io/npm/dt/eslint-plugin-agentlint.svg"
         alt="Total npm downloads" />
  </a>
</p>

## Why?

AI agents (browser automation, LLM-driven tools, RPA bots) interact with your UI through the DOM — not through pixels. When your components lack stable selectors, use hover-only interactions, or communicate state only through CSS classes, agents fail silently.

**eslint-plugin-agentlint** catches these patterns at build time, the same way [`eslint-plugin-jsx-a11y`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) catches human accessibility issues.

The same principles that make UIs work for screen readers make them work for AI agents. If you already care about a11y, you're halfway there.

## Installation

First, install [ESLint](https://www.eslint.org):

```bash
npm install --save-dev eslint
```

Then install `eslint-plugin-agentlint`:

```bash
npm install --save-dev eslint-plugin-agentlint
```

**Note:** This plugin requires ESLint 9+ and supports flat config (`eslint.config.js`) only.

## Usage

### Flat Config (`eslint.config.js`)

Use the `recommended` shareable config:

```js
import agentlint from "eslint-plugin-agentlint";

export default [
  agentlint.configs.recommended,
  // ... your other config
];
```

Or the `strict` config (all rules set to `error`):

```js
import agentlint from "eslint-plugin-agentlint";

export default [
  agentlint.configs.strict,
];
```

### Manual Configuration

To configure rules individually:

```js
import agentlint from "eslint-plugin-agentlint";

export default [
  {
    plugins: { agent: agentlint },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "agent/require-stable-selector": "warn",
      "agent/no-hover-only-action": "warn",
      "agent/no-css-only-state": "warn",
      "agent/require-semantic-interactive": "error",
      "agent/no-dynamic-position-instability": "warn",
      "agent/require-action-context": "warn",
      "agent/require-modal-dismiss": "warn",
    },
  },
];
```

## Supported Rules

<!-- begin auto-generated rules list -->

| Rule | Description | Recommended | Strict | Fixable |
|------|-------------|:-----------:|:------:|:-------:|
| [require-stable-selector](docs/rules/require-stable-selector.md) | Interactive elements must have a stable selector (`data-testid`, `data-agent-id`, or `id`) | warn | error | wrench |
| [no-hover-only-action](docs/rules/no-hover-only-action.md) | Actions must not be gated behind hover-only interactions | warn | error | wrench |
| [no-css-only-state](docs/rules/no-css-only-state.md) | Component state must be exposed via attributes, not just CSS classes | warn | error | wrench |
| [require-semantic-interactive](docs/rules/require-semantic-interactive.md) | Interactive elements must use semantic HTML, not `<div onClick>` | error | error | wrench |
| [no-dynamic-position-instability](docs/rules/no-dynamic-position-instability.md) | Conditionally rendered interactive elements need stable identifiers | warn | error | wrench |
| [require-action-context](docs/rules/require-action-context.md) | Forms must have accessible names so agents can distinguish them | warn | error | wrench |
| [require-modal-dismiss](docs/rules/require-modal-dismiss.md) | Modals must have `aria-modal` so agents know how to dismiss them | warn | error | wrench |

<!-- end auto-generated rules list -->

### Rule Options

#### `require-stable-selector`

Accepts additional attribute names to treat as stable selectors:

```js
"agent/require-stable-selector": ["warn", {
  additionalAttributes: ["data-cy", "data-qa"]
}]
```

## Configs

| Config | Description |
|--------|-------------|
| `recommended` | All rules enabled at their default severity (mostly `warn`) |
| `strict` | All rules set to `error` |

## Philosophy

1. **Agent accessibility ~ Human accessibility.** If screen readers can use it, agents probably can too. This plugin extends that principle.
2. **Build-time, not runtime.** Catch issues before they ship, in the workflow you already have.
3. **Fix, don't just complain.** Every rule provides an auto-fix. Fixes are conservative — only applied when intent is unambiguous.
4. **Explain the why.** Error messages tell you *why* agents care, not just what's wrong.

## Complementary Tools

This plugin works alongside, not instead of:

- [`eslint-plugin-jsx-a11y`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) — Human accessibility linting
- [axe-core](https://github.com/dequelabs/axe-core) — Runtime accessibility testing
- [Playwright](https://playwright.dev/) / [Puppeteer](https://pptr.dev/) — Browser automation that benefits from agent-accessible UIs

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

`eslint-plugin-agentlint` is licensed under the [MIT License](LICENSE).
