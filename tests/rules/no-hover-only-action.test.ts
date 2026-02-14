import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/rules/no-hover-only-action";
import * as vitest from "vitest";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run("no-hover-only-action", rule, {
  valid: [
    // No hover handlers at all
    {
      code: '<button onClick={handleClick}>Click me</button>',
    },
    // Hover with focus alternative
    {
      code: "<div onMouseEnter={show} onFocus={show}>Tooltip</div>",
    },
    {
      code: "<div onMouseOver={show} onBlur={hide}>Content</div>",
    },
    // Only focus handlers
    {
      code: "<input onFocus={show} onBlur={hide} />",
    },
    // Both mouse and focus handlers
    {
      code: "<div onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>Menu</div>",
    },
  ],
  invalid: [
    // onMouseEnter without focus alternative
    {
      code: "<div onMouseEnter={show}>Tooltip</div>",
      output: "<div onMouseEnter={show} tabIndex={0}>Tooltip</div>",
      errors: [{ messageId: "hoverOnlyAction" }],
    },
    // onMouseOver without focus alternative
    {
      code: "<div onMouseOver={show}>Hover content</div>",
      output: "<div onMouseOver={show} tabIndex={0}>Hover content</div>",
      errors: [{ messageId: "hoverOnlyAction" }],
    },
    // onMouseEnter and onMouseLeave without focus
    {
      code: "<div onMouseEnter={show} onMouseLeave={hide}>Dropdown</div>",
      output:
        "<div onMouseEnter={show} onMouseLeave={hide} tabIndex={0}>Dropdown</div>",
      errors: [{ messageId: "hoverOnlyAction" }],
    },
    // Multiple hover handlers
    {
      code: '<span onMouseOver={handleHover} onMouseOut={handleOut} className="tooltip-trigger">Info</span>',
      output:
        '<span onMouseOver={handleHover} onMouseOut={handleOut} className="tooltip-trigger" tabIndex={0}>Info</span>',
      errors: [{ messageId: "hoverOnlyAction" }],
    },
  ],
});
