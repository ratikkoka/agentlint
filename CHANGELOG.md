# Changelog

All notable changes to `eslint-plugin-agentlint` will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/).

## v0.1.0 - 2026-02-13

### New

- [New] Initial release of `eslint-plugin-agentlint`
- [New] `require-stable-selector`: flag interactive elements missing `data-testid`, `data-agent-id`, or `id`
- [New] `no-hover-only-action`: flag hover-only interactions without focus alternatives
- [New] `no-css-only-state`: flag CSS-only state indicators missing ARIA attributes
- [New] `require-semantic-interactive`: flag non-semantic elements (`<div>`, `<span>`) used as interactive controls
- [New] `no-dynamic-position-instability`: flag conditionally rendered interactive elements without stable identifiers
- [New] `require-action-context`: flag `<form>` elements without accessible names
- [New] `require-modal-dismiss`: flag modal/dialog elements missing `aria-modal`
- [New] `recommended` config preset (all rules at default severity)
- [New] `strict` config preset (all rules set to `error`)
- [New] ESLint 9+ flat config support with self-referencing plugin configs
- [New] Auto-fixers for all rules (conservative — unambiguous fixes only)
