/**
 * HTML elements that are natively interactive
 */
export const INTERACTIVE_ELEMENTS = [
  "button",
  "a",
  "input",
  "select",
  "textarea",
  "details",
  "summary",
] as const;

/**
 * JSX event handler props that indicate interactivity
 */
export const INTERACTIVE_HANDLERS = [
  "onClick",
  "onSubmit",
  "onChange",
  "onKeyDown",
  "onKeyUp",
  "onKeyPress",
  "onDoubleClick",
] as const;

/**
 * Hover-related event handlers
 */
export const HOVER_HANDLERS = [
  "onMouseEnter",
  "onMouseOver",
  "onMouseLeave",
  "onMouseOut",
] as const;

/**
 * Focus-related event handlers (the accessible alternative to hover)
 */
export const FOCUS_HANDLERS = ["onFocus", "onBlur"] as const;

/**
 * Attributes that provide stable selectors for agents
 */
export const STABLE_SELECTOR_ATTRIBUTES = [
  "data-testid",
  "data-agent-id",
  "id",
] as const;

/**
 * CSS class patterns that indicate state, mapped to their ARIA equivalents
 */
export const CSS_STATE_TO_ARIA: Record<string, string> = {
  disabled: "aria-disabled",
  active: "aria-pressed",
  selected: "aria-selected",
  loading: "aria-busy",
  hidden: "aria-hidden",
  collapsed: "aria-expanded", // inverse: collapsed = expanded=false
  expanded: "aria-expanded",
  checked: "aria-checked",
  open: "aria-expanded",
  closed: "aria-expanded", // inverse
};

/**
 * ARIA attributes that communicate state programmatically
 */
export const STATE_ARIA_ATTRIBUTES = [
  "aria-disabled",
  "aria-busy",
  "aria-selected",
  "aria-pressed",
  "aria-expanded",
  "aria-hidden",
  "aria-checked",
  "disabled",
] as const;

/**
 * Elements/attributes that indicate modal patterns
 */
export const MODAL_INDICATORS = {
  roles: ["dialog", "alertdialog"],
  classPatterns: ["modal", "dialog", "overlay", "popup", "lightbox"],
  attributes: ["aria-modal"],
} as const;

/**
 * Landmark and container elements that provide context
 */
export const LANDMARK_ELEMENTS = [
  "form",
  "nav",
  "main",
  "aside",
  "header",
  "footer",
  "section",
  "article",
  "dialog",
] as const;
