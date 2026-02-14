# agentlint

## What This Project Is

`eslint-plugin-agentlint` is an ESLint plugin that lints React (JSX/TSX) and HTML for patterns that make UIs difficult for AI agents to interact with. Think of it as `eslint-plugin-jsx-a11y` but for AI agent accessibility — detecting patterns where bots, browser agents, and automation tools would fail or struggle.

The insight: the same principles that make UIs accessible to screen readers (semantic HTML, ARIA attributes, stable selectors, programmatic state) also make them operable by AI agents. This tool bridges that gap.

## Tech Stack

- **Language:** TypeScript (strict mode)
- **Target:** ESLint 9+ flat config only (`eslint.config.js`)
- **Frameworks:** React (JSX/TSX) + HTML
- **Package name:** `eslint-plugin-agentlint`
- **License:** MIT
- **Node:** >= 18
- **Build:** tsup (for bundling)
- **Testing:** vitest + @typescript-eslint/rule-tester

## Project Structure

```
eslint-plugin-agentlint/
├── src/
│   ├── index.ts                    # Plugin entry — exports rules + configs
│   ├── rules/
│   │   ├── require-stable-selector.ts
│   │   ├── no-hover-only-action.ts
│   │   ├── no-css-only-state.ts
│   │   ├── require-semantic-interactive.ts
│   │   ├── no-dynamic-position-instability.ts
│   │   ├── require-action-context.ts
│   │   └── require-modal-dismiss.ts
│   └── utils/
│       ├── ast-helpers.ts          # Shared AST traversal utilities
│       ├── constants.ts            # Shared constants (generic labels, css state patterns, etc.)
│       └── types.ts                # Shared TypeScript types
├── tests/
│   └── rules/
│       ├── require-stable-selector.test.ts
│       ├── no-hover-only-action.test.ts
│       ├── no-css-only-state.test.ts
│       ├── require-semantic-interactive.test.ts
│       ├── no-dynamic-position-instability.test.ts
│       ├── require-action-context.test.ts
│       └── require-modal-dismiss.test.ts
├── docs/
│   └── rules/
│       ├── require-stable-selector.md
│       ├── no-hover-only-action.md
│       ├── no-css-only-state.md
│       ├── require-semantic-interactive.md
│       ├── no-dynamic-position-instability.md
│       ├── require-action-context.md
│       └── require-modal-dismiss.md
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── README.md
├── LICENSE
└── CLAUDE.md                       # This file
```

## Rules (v1)

All rules are prefixed with `agent/` in ESLint config.

### 1. `agent/require-stable-selector`
**What:** Flags interactive elements (button, a, input, select, textarea, elements with onClick/onSubmit/onChange) that have no `data-testid`, `data-agent-id`, or stable `id` attribute.
**Why:** AI agents need reliable selectors that survive builds. CSS-module hashed classes break between deploys.
**Auto-fix:** Adds `data-agent-id` based on inferred context — component name + element role + distinguishing text. E.g., `data-agent-id="submit-button"`.
**Severity:** warn

### 2. `agent/no-hover-only-action`
**What:** Flags content/actions gated behind CSS `:hover`, `onMouseEnter`, `onMouseOver` with no corresponding `onFocus`, `onKeyDown`, or click-toggle pattern.
**Why:** AI agents don't hover. Hover-only content is invisible to them.
**Auto-fix:** Where possible, add `onFocus`/`onBlur` mirroring the hover handlers. Add `tabIndex={0}` if missing. Add `aria-expanded` for toggle patterns.
**Severity:** warn

### 3. `agent/no-css-only-state`
**What:** Flags elements where className contains common state indicators (disabled, active, selected, loading, hidden, collapsed, expanded, checked) without a corresponding ARIA attribute or HTML attribute.
**Why:** Agents can't interpret visual CSS states. They need queryable attributes.
**Auto-fix:** Add the corresponding attribute. E.g., className includes "disabled" → add `aria-disabled="true"`. className includes "loading" → add `aria-busy="true"`.
**Severity:** warn

### 4. `agent/require-semantic-interactive`
**What:** Flags `<div>` or `<span>` elements with `onClick`, `onKeyDown`, `onKeyUp`, `onKeyPress` handlers that lack a `role` attribute and are not native interactive elements.
**Why:** A `<div onClick>` is semantically meaningless to an agent. Native `<button>`, `<a>`, `<input>` provide reliable signals.
**Auto-fix:** Replace `<div onClick={...}>` with `<button onClick={...}>`. Preserve all existing attributes and children. Add `type="button"` to prevent form submission. If there's already a `role="button"`, suggest replacing the element instead.
**Severity:** error

### 5. `agent/no-dynamic-position-instability`
**What:** Flags conditional rendering patterns (`{cond && <Element>}` or ternary) for interactive elements inside parent containers that lack a stable identifier (no `id`, `data-testid`, `data-agent-id`, `role`, or landmark element).
**Why:** If interactive elements shift position based on async state, agents relying on element order get confused.
**Auto-fix:** Add `data-agent-id` to the conditionally rendered element's nearest stable parent, or to the element itself.
**Severity:** warn

### 6. `agent/require-action-context`
**What:** Flags `<form>` elements without an accessible name (`aria-label`, `aria-labelledby`, or associated heading). Flags `<button>` elements that are not inside a `<form>`, `<nav>`, `<dialog>`, `<section>`, or other landmark/container with an accessible name.
**Why:** Agents need to distinguish between "the search form" and "the checkout form." Orphan buttons without context are ambiguous.
**Auto-fix:** Add `aria-label` with a TODO placeholder on forms. Suggest wrapping orphan buttons in a semantic container.
**Severity:** warn

### 7. `agent/require-modal-dismiss`
**What:** Flags elements with `role="dialog"`, `aria-modal`, or common modal patterns (className containing "modal", "dialog", "overlay") that lack: (a) a child button with close/dismiss semantics, AND (b) an `onKeyDown` handler (for Escape key).
**Why:** Modals trap agents if there's no programmatic way to dismiss them.
**Auto-fix:** Add `aria-modal="true"` if missing. Add a TODO comment for missing Escape handler and close button.
**Severity:** warn

## Coding Conventions

- Every rule must have valid/invalid test cases using `@typescript-eslint/rule-tester` with vitest
- Every rule must have a markdown doc in `docs/rules/`
- Rule files export a single rule using `ESLintUtils.RuleCreator`
- Use `@typescript-eslint/utils` for typed rule creation
- Auto-fixers should be conservative — only fix when the intent is unambiguous. Use `suggest` (suggestions) for ambiguous fixes so the developer chooses.
- Error messages should explain WHY this matters for agents, not just what's wrong. E.g., "AI agents cannot interact with elements that are only visible on hover. Add a focus or click-based alternative."
- All rules should be configurable where it makes sense (e.g., `require-stable-selector` should accept a list of custom attribute names to check)

## Exported Configs

The plugin exports two preset configs:

- **`recommended`**: All rules at their default severity (mostly warn)
- **`strict`**: All rules set to error

Usage:
```js
// eslint.config.js
import agentlint from "eslint-plugin-agentlint";

export default [
  agentlint.configs.recommended,
  // ... other config
];
```

## Build & Test Commands

```bash
npm run build        # tsup build
npm run test         # vitest run
npm run test:watch   # vitest watch
npm run lint         # eslint on src/
npm run typecheck    # tsc --noEmit
```

## Development Workflow

1. Create rule file in `src/rules/`
2. Write tests first in `tests/rules/`
3. Implement the rule until tests pass
4. Write the doc in `docs/rules/`
5. Export from `src/index.ts`
6. Run full suite before committing

## Key Dependencies

- `eslint` (>=9.0.0) — peer dependency
- `@typescript-eslint/utils` — typed rule creation utilities
- `@typescript-eslint/rule-tester` — test harness (dev)
- `vitest` — test runner (dev)
- `tsup` — bundler (dev)
- `typescript` (>=5.0) — (dev)

## What This Is NOT

- This is not a runtime tool — it's static analysis only
- This does not replace `eslint-plugin-jsx-a11y` — it complements it
- This does not guarantee agent compatibility — it catches common anti-patterns
- Phase 2 (CLI with manifest generation) is out of scope for initial build
