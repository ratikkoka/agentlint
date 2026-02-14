import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/rules/no-dynamic-position-instability";
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

ruleTester.run("no-dynamic-position-instability", rule, {
  valid: [
    // Conditionally rendered interactive element with stable selector
    {
      code: '<div>{isVisible && <button data-testid="save-btn">Save</button>}</div>',
    },
    {
      code: '<div>{show && <button data-agent-id="toggle">Toggle</button>}</div>',
    },
    {
      code: '<div>{active && <button id="action-btn">Action</button>}</div>',
    },
    // Non-interactive element conditionally rendered (no issue)
    {
      code: "<div>{loading && <span>Loading...</span>}</div>",
    },
    {
      code: "<div>{error && <p>Error occurred</p>}</div>",
    },
    // Static interactive elements (not conditional)
    {
      code: "<div><button>Always here</button></div>",
    },
  ],
  invalid: [
    // Conditionally rendered button without stable selector
    {
      code: "<div>{isVisible && <button>Save</button>}</div>",
      output:
        '<div>{isVisible && <button data-agent-id="button">Save</button>}</div>',
      errors: [{ messageId: "unstableDynamicElement" }],
    },
    // Conditionally rendered input without stable selector
    {
      code: '<div>{showInput && <input type="text" />}</div>',
      output:
        '<div>{showInput && <input type="text" data-agent-id="input" />}</div>',
      errors: [{ messageId: "unstableDynamicElement" }],
    },
    // Conditionally rendered link without stable selector
    {
      code: '<div>{isLoggedIn && <a href="/dashboard">Dashboard</a>}</div>',
      output:
        '<div>{isLoggedIn && <a href="/dashboard" data-agent-id="a">Dashboard</a>}</div>',
      errors: [{ messageId: "unstableDynamicElement" }],
    },
    // Conditionally rendered select without stable selector
    {
      code: "<div>{hasOptions && <select><option>A</option></select>}</div>",
      output:
        '<div>{hasOptions && <select data-agent-id="select"><option>A</option></select>}</div>',
      errors: [{ messageId: "unstableDynamicElement" }],
    },
    // Conditionally rendered element with onClick but no stable selector
    {
      code: "<div>{ready && <div onClick={handle}>Click</div>}</div>",
      output:
        '<div>{ready && <div onClick={handle} data-agent-id="div">Click</div>}</div>',
      errors: [{ messageId: "unstableDynamicElement" }],
    },
  ],
});
