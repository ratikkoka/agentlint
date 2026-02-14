# agent/require-modal-dismiss

Modal dialogs must have a programmatic dismiss mechanism.

## Rule Details

This rule flags elements that appear to be modals — elements with `role="dialog"`, `role="alertdialog"`, or className containing `modal`, `dialog`, `overlay`, `popup`, `lightbox` — that lack the `aria-modal` attribute.

Modals trap AI agents if there is no programmatic way to identify and dismiss them. The `aria-modal` attribute signals to agents that the element is a modal overlay and that they should look for a dismiss mechanism.

### Examples of **incorrect** code:

```jsx
<div role="dialog">
  <h2>Confirm</h2>
  <p>Are you sure?</p>
  <button>OK</button>
</div>

<div className="modal-overlay">
  <div className="modal-content">
    <p>Modal body</p>
  </div>
</div>
```

### Examples of **correct** code:

```jsx
<div role="dialog" aria-modal="true">
  <h2>Confirm</h2>
  <p>Are you sure?</p>
  <button>OK</button>
  <button aria-label="Close">X</button>
</div>

<div className="modal-overlay" aria-modal="true" onKeyDown={handleEscape}>
  <div className="modal-content">
    <p>Modal body</p>
    <button onClick={closeModal}>Close</button>
  </div>
</div>
```

## Options

This rule has no options.

## Auto-fix

Adds `aria-modal="true"` to the element. You should also ensure a close button and Escape key handler are present — the rule flags missing `aria-modal` as the primary programmatic signal.

## When Not To Use It

If your modals are implemented using the native `<dialog>` element (which has built-in modal semantics), this rule may not be necessary. However, it can still catch className-based modal patterns.
