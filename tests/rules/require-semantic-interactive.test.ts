import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/rules/require-semantic-interactive";
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

ruleTester.run("require-semantic-interactive", rule, {
  valid: [
    // Native interactive elements are fine
    {
      code: "<button onClick={handleClick}>Submit</button>",
    },
    {
      code: '<a href="/page" onClick={handleNav}>Link</a>',
    },
    {
      code: "<input onChange={handleChange} />",
    },
    // Non-semantic element with role attribute
    {
      code: '<div onClick={handleClick} role="button">Click me</div>',
    },
    {
      code: '<span onClick={handleClick} role="link">Link text</span>',
    },
    // Non-interactive elements (no handlers)
    {
      code: "<div>Just text</div>",
    },
    {
      code: '<span className="label">Label</span>',
    },
    // Non-semantic elements without interactive handlers
    {
      code: '<div className="container"><button>Click</button></div>',
    },
  ],
  invalid: [
    // div with onClick and no role
    {
      code: "<div onClick={handleClick}>Click me</div>",
      output:
        '<div onClick={handleClick} role="button" tabIndex={0}>Click me</div>',
      errors: [{ messageId: "nonSemanticInteractive" }],
    },
    // span with onClick and no role
    {
      code: "<span onClick={handleClick}>Click me</span>",
      output:
        '<span onClick={handleClick} role="button" tabIndex={0}>Click me</span>',
      errors: [{ messageId: "nonSemanticInteractive" }],
    },
    // div with onKeyDown and no role
    {
      code: "<div onKeyDown={handleKey}>Press me</div>",
      output:
        '<div onKeyDown={handleKey} role="button" tabIndex={0}>Press me</div>',
      errors: [{ messageId: "nonSemanticInteractive" }],
    },
    // li with onClick and no role
    {
      code: "<li onClick={handleSelect}>Item</li>",
      output:
        '<li onClick={handleSelect} role="button" tabIndex={0}>Item</li>',
      errors: [{ messageId: "nonSemanticInteractive" }],
    },
    // td with onClick and no role
    {
      code: "<td onClick={handleCellClick}>Cell</td>",
      output:
        '<td onClick={handleCellClick} role="button" tabIndex={0}>Cell</td>',
      errors: [{ messageId: "nonSemanticInteractive" }],
    },
    // p with onClick and no role
    {
      code: "<p onClick={handleClick}>Clickable paragraph</p>",
      output:
        '<p onClick={handleClick} role="button" tabIndex={0}>Clickable paragraph</p>',
      errors: [{ messageId: "nonSemanticInteractive" }],
    },
    // div with onKeyUp
    {
      code: "<div onKeyUp={handleKeyUp}>Element</div>",
      output:
        '<div onKeyUp={handleKeyUp} role="button" tabIndex={0}>Element</div>',
      errors: [{ messageId: "nonSemanticInteractive" }],
    },
    // div with multiple attributes but no role
    {
      code: '<div onClick={handleClick} className="card" id="my-card">Card</div>',
      output:
        '<div onClick={handleClick} className="card" id="my-card" role="button" tabIndex={0}>Card</div>',
      errors: [{ messageId: "nonSemanticInteractive" }],
    },
  ],
});
