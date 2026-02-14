import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/rules/require-stable-selector";
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

ruleTester.run("require-stable-selector", rule, {
  valid: [
    // Native interactive elements with stable selectors
    {
      code: '<button data-testid="submit-btn">Submit</button>',
    },
    {
      code: '<button data-agent-id="login-submit">Login</button>',
    },
    {
      code: '<button id="save-button">Save</button>',
    },
    {
      code: '<a href="/home" data-testid="home-link">Home</a>',
    },
    {
      code: '<input type="text" data-testid="email-input" />',
    },
    {
      code: '<select id="country-select"><option>US</option></select>',
    },
    {
      code: '<textarea data-agent-id="comment-box" />',
    },
    // Non-interactive elements without selectors are fine
    {
      code: "<div>Just a container</div>",
    },
    {
      code: '<span className="label">Text</span>',
    },
    {
      code: "<p>Paragraph text</p>",
    },
    // Custom attributes via options
    {
      code: '<button data-cy="submit">Submit</button>',
      options: [{ additionalAttributes: ["data-cy"] }],
    },
    {
      code: '<input data-qa="email" type="email" />',
      options: [{ additionalAttributes: ["data-qa"] }],
    },
    // Elements with onClick but already having a stable selector
    {
      code: '<div onClick={handleClick} data-testid="clickable">Click</div>',
    },
  ],
  invalid: [
    // Native interactive elements missing stable selectors
    {
      code: "<button>Submit</button>",
      output: '<button data-agent-id="button">Submit</button>',
      errors: [{ messageId: "missingStableSelector" }],
    },
    {
      code: '<a href="/home">Home</a>',
      output: '<a href="/home" data-agent-id="a">Home</a>',
      errors: [{ messageId: "missingStableSelector" }],
    },
    {
      code: '<input type="text" placeholder="Email" />',
      output: '<input type="text" placeholder="Email" data-agent-id="input" />',
      errors: [{ messageId: "missingStableSelector" }],
    },
    {
      code: "<select><option>A</option></select>",
      output: '<select data-agent-id="select"><option>A</option></select>',
      errors: [{ messageId: "missingStableSelector" }],
    },
    {
      code: "<textarea />",
      output: '<textarea data-agent-id="textarea" />',
      errors: [{ messageId: "missingStableSelector" }],
    },
    // Elements with onClick but no stable selector
    {
      code: '<div onClick={handleClick} className="card">Click me</div>',
      output:
        '<div onClick={handleClick} className="card" data-agent-id="div">Click me</div>',
      errors: [{ messageId: "missingStableSelector" }],
    },
    // Elements with onChange
    {
      code: "<textarea onChange={handleChange} />",
      output: '<textarea onChange={handleChange} data-agent-id="textarea" />',
      errors: [{ messageId: "missingStableSelector" }],
    },
    // Elements with onSubmit — form and input both need selectors
    {
      code: "<form onSubmit={handleSubmit}><input /></form>",
      output:
        '<form onSubmit={handleSubmit} data-agent-id="form"><input data-agent-id="input" /></form>',
      errors: [
        { messageId: "missingStableSelector" },
        { messageId: "missingStableSelector" },
      ],
    },
  ],
});
