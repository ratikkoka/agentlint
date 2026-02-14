# agent/no-hover-only-action

Disallow actions that are only accessible via hover.

## Rule Details

This rule flags elements that use hover handlers (`onMouseEnter`, `onMouseOver`, `onMouseLeave`, `onMouseOut`) without corresponding focus alternatives (`onFocus`, `onBlur`).

AI agents cannot hover. Content or actions gated behind hover events are invisible to them. Providing focus-based alternatives ensures agents (and keyboard users) can access the same functionality.

### Examples of **incorrect** code:

```jsx
<div onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
  Hover for info
</div>

<button onMouseOver={expandMenu}>
  Menu
</button>
```

### Examples of **correct** code:

```jsx
<div
  onMouseEnter={showTooltip}
  onMouseLeave={hideTooltip}
  onFocus={showTooltip}
  onBlur={hideTooltip}
  tabIndex={0}
>
  Hover for info
</div>

<button onMouseOver={expandMenu} onFocus={expandMenu}>
  Menu
</button>
```

## Options

This rule has no options.

## Auto-fix

Adds `tabIndex={0}` to the element if not already present, making it focusable as a first step toward focus-based interaction.

## When Not To Use It

If your hover interactions are purely decorative (e.g., visual-only animations) and do not gate content or actions, you may disable this rule for those elements.
