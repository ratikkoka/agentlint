import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/rules/no-css-only-state";
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

ruleTester.run("no-css-only-state", rule, {
  valid: [
    // No state classes
    {
      code: '<div className="container">Content</div>',
    },
    // State class with corresponding ARIA attribute
    {
      code: '<button className="btn disabled" aria-disabled="true">Save</button>',
    },
    {
      code: '<div className="panel expanded" aria-expanded="true">Content</div>',
    },
    {
      code: '<div className="spinner loading" aria-busy="true">Loading...</div>',
    },
    {
      code: '<div className="item selected" aria-selected="true">Item</div>',
    },
    {
      code: '<div className="sidebar hidden" aria-hidden="true">Sidebar</div>',
    },
    {
      code: '<input className="checkbox checked" aria-checked="true" />',
    },
    // disabled class with native disabled attribute
    {
      code: '<button className="btn disabled" disabled>Save</button>',
    },
    // No className at all
    {
      code: "<div>Plain element</div>",
    },
  ],
  invalid: [
    // disabled class without aria-disabled
    {
      code: '<button className="btn disabled">Save</button>',
      output:
        '<button className="btn disabled" aria-disabled="true">Save</button>',
      errors: [{ messageId: "cssOnlyState" }],
    },
    // loading class without aria-busy
    {
      code: '<div className="spinner loading">Loading...</div>',
      output:
        '<div className="spinner loading" aria-busy="true">Loading...</div>',
      errors: [{ messageId: "cssOnlyState" }],
    },
    // selected class without aria-selected
    {
      code: '<li className="item selected">Item 1</li>',
      output:
        '<li className="item selected" aria-selected="true">Item 1</li>',
      errors: [{ messageId: "cssOnlyState" }],
    },
    // hidden class without aria-hidden
    {
      code: '<div className="sidebar hidden">Sidebar</div>',
      output:
        '<div className="sidebar hidden" aria-hidden="true">Sidebar</div>',
      errors: [{ messageId: "cssOnlyState" }],
    },
    // expanded class without aria-expanded
    {
      code: '<div className="panel expanded">Content</div>',
      output:
        '<div className="panel expanded" aria-expanded="true">Content</div>',
      errors: [{ messageId: "cssOnlyState" }],
    },
    // collapsed class should map to aria-expanded="false"
    {
      code: '<div className="panel collapsed">Content</div>',
      output:
        '<div className="panel collapsed" aria-expanded="false">Content</div>',
      errors: [{ messageId: "cssOnlyState" }],
    },
    // checked class without aria-checked
    {
      code: '<div className="toggle checked">On</div>',
      output: '<div className="toggle checked" aria-checked="true">On</div>',
      errors: [{ messageId: "cssOnlyState" }],
    },
    // active class without aria-pressed
    {
      code: '<button className="tab active">Tab 1</button>',
      output:
        '<button className="tab active" aria-pressed="true">Tab 1</button>',
      errors: [{ messageId: "cssOnlyState" }],
    },
  ],
});
