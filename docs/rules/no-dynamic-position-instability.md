# agent/no-dynamic-position-instability

Conditionally rendered interactive elements should have stable identifiers.

## Rule Details

This rule flags conditional rendering patterns (`{condition && <Element>}`) where the rendered element is interactive (`button`, `a`, `input`, `select`, `textarea`, `details`, `summary`, or has event handlers) but lacks a stable selector (`data-testid`, `data-agent-id`, or `id`).

When interactive elements appear or disappear based on state, their position in the DOM shifts. AI agents relying on element order get confused when elements move. Stable identifiers let agents find elements regardless of render order.

### Examples of **incorrect** code:

```jsx
{isLoggedIn && <button onClick={logout}>Logout</button>}

{showSearch && <input type="text" placeholder="Search" />}

{hasPermission && <a href="/admin">Admin Panel</a>}
```

### Examples of **correct** code:

```jsx
{isLoggedIn && <button onClick={logout} data-agent-id="logout-button">Logout</button>}

{showSearch && <input type="text" placeholder="Search" data-testid="search-input" />}

{hasPermission && <a href="/admin" id="admin-link">Admin Panel</a>}
```

## Options

This rule has no options.

## Auto-fix

Adds `data-agent-id` to the conditionally rendered element, using the element's tag name as the identifier value (e.g., `data-agent-id="button"`).

## When Not To Use It

If your conditionally rendered elements are non-interactive or your AI agents use strategies other than DOM position to locate elements, you may disable this rule.
