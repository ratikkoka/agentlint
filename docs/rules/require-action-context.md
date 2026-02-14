# agent/require-action-context

Forms must have an accessible name so AI agents can identify their purpose.

## Rule Details

This rule flags `<form>` elements that lack an accessible name — no `aria-label`, `aria-labelledby`, or `name` attribute.

AI agents need to distinguish between different forms on a page (e.g., "the search form" vs. "the checkout form"). Without an accessible name, forms are ambiguous and agents cannot reliably determine which form to interact with.

### Examples of **incorrect** code:

```jsx
<form onSubmit={handleSubmit}>
  <input type="text" />
  <button type="submit">Submit</button>
</form>

<form>
  <input type="email" />
</form>
```

### Examples of **correct** code:

```jsx
<form onSubmit={handleSubmit} aria-label="Contact form">
  <input type="text" />
  <button type="submit">Submit</button>
</form>

<form aria-labelledby="search-heading">
  <h2 id="search-heading">Search</h2>
  <input type="text" />
</form>

<form name="login">
  <input type="email" />
  <input type="password" />
</form>
```

## Options

This rule has no options.

## Auto-fix

Adds `aria-label="TODO: describe this form"` to forms missing an accessible name. You should replace the TODO placeholder with a meaningful description.

## When Not To Use It

If your application has only a single form per page and there is no ambiguity, you may disable this rule. However, it is still good practice to label forms for agent comprehension.
