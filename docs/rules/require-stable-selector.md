# agent/require-stable-selector

Require interactive elements to have a stable selector for AI agent interaction.

## Rule Details

This rule flags interactive elements (`button`, `a`, `input`, `select`, `textarea`, `details`, `summary`, and elements with `onClick`, `onSubmit`, `onChange`, etc.) that have no `data-testid`, `data-agent-id`, or stable `id` attribute.

AI agents need reliable selectors that survive builds. CSS-module hashed classes break between deploys, making it impossible for agents to consistently find and interact with elements.

### Examples of **incorrect** code:

```jsx
<button onClick={handleSubmit}>Submit</button>

<input type="text" placeholder="Search" />

<a href="/dashboard">Go to Dashboard</a>

<div onClick={handleClick}>Click me</div>
```

### Examples of **correct** code:

```jsx
<button onClick={handleSubmit} data-agent-id="submit-button">Submit</button>

<input type="text" placeholder="Search" id="search-input" />

<a href="/dashboard" data-testid="dashboard-link">Go to Dashboard</a>

<div onClick={handleClick} data-agent-id="click-target">Click me</div>
```

## Options

### `additionalAttributes`

An array of additional attribute names to accept as stable selectors beyond the defaults (`data-testid`, `data-agent-id`, `id`).

```json
{
  "agent/require-stable-selector": ["warn", {
    "additionalAttributes": ["data-cy", "data-test"]
  }]
}
```

## Auto-fix

Adds `data-agent-id` based on the element tag name. For example, a `<button>` without a stable selector gets `data-agent-id="button"`.

## When Not To Use It

If your application is not intended to be operated by AI agents or browser automation tools, you may not need this rule.

## Further Reading

- [Testing Library - data-testid](https://testing-library.com/docs/queries/bytestid/)
