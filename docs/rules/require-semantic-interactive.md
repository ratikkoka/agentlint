# agent/require-semantic-interactive

Require interactive elements to use semantic HTML.

## Rule Details

This rule flags non-semantic elements (`div`, `span`, `li`, `td`, `p`) that have interactive event handlers (`onClick`, `onSubmit`, `onChange`, `onKeyDown`, `onKeyUp`, `onKeyPress`, `onDoubleClick`) but lack a `role` attribute.

A `<div onClick>` is semantically meaningless to an AI agent. Native `<button>`, `<a>`, and `<input>` elements provide reliable signals about what an element does. When native elements can't be used, a `role` attribute is the minimum for agent comprehension.

**Severity: error** — This is considered a problem, not just a suggestion.

### Examples of **incorrect** code:

```jsx
<div onClick={handleClick}>Click me</div>

<span onClick={handleSelect}>Select item</span>

<li onClick={handleNav}>Navigate</li>

<td onKeyDown={handleKey}>Cell</td>
```

### Examples of **correct** code:

```jsx
<button onClick={handleClick}>Click me</button>

<button onClick={handleSelect}>Select item</button>

<div onClick={handleClick} role="button" tabIndex={0}>Click me</div>

<span onClick={handleSelect} role="option">Select item</span>

<a href="/page" onClick={handleNav}>Navigate</a>
```

## Options

This rule has no options.

## Auto-fix

Adds `role="button"` and `tabIndex={0}` to the element to make it semantically meaningful and keyboard-accessible. For a more thorough fix, consider replacing the element with a native `<button>` manually.

## When Not To Use It

If you have non-semantic elements with click handlers that are intentionally non-interactive (e.g., analytics-only click tracking on a container), you may disable this rule for those elements.
