# agent/no-css-only-state

Disallow communicating element state only through CSS classes.

## Rule Details

This rule flags elements where `className` contains common state indicators without a corresponding ARIA or HTML attribute. AI agents cannot interpret visual CSS styles — they need queryable attributes to understand element state.

The following CSS class patterns are detected and mapped to ARIA attributes:

| CSS class pattern | Expected ARIA attribute |
| --- | --- |
| `disabled` | `aria-disabled` |
| `active` | `aria-pressed` |
| `selected` | `aria-selected` |
| `loading` | `aria-busy` |
| `hidden` | `aria-hidden` |
| `collapsed` | `aria-expanded="false"` |
| `expanded` | `aria-expanded` |
| `checked` | `aria-checked` |
| `open` | `aria-expanded` |
| `closed` | `aria-expanded="false"` |

### Examples of **incorrect** code:

```jsx
<button className="btn disabled">Submit</button>

<div className="tab selected">Tab 1</div>

<div className="spinner loading">Loading...</div>

<div className="panel collapsed">Content</div>
```

### Examples of **correct** code:

```jsx
<button className="btn disabled" aria-disabled="true">Submit</button>

<div className="tab selected" aria-selected="true">Tab 1</div>

<div className="spinner loading" aria-busy="true">Loading...</div>

<div className="panel collapsed" aria-expanded="false">Content</div>
```

## Options

This rule has no options.

## Auto-fix

Adds the corresponding ARIA attribute. For inverse states like `collapsed` and `closed`, the fix sets `aria-expanded="false"`. For all other patterns, the fix sets the ARIA attribute to `"true"`.

## When Not To Use It

If the CSS class names in your project do not correspond to actual UI state (e.g., they are used purely for styling unrelated to element state), you may disable this rule.
