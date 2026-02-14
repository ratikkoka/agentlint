import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/rules/require-action-context";
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

ruleTester.run("require-action-context", rule, {
  valid: [
    // Form with aria-label
    {
      code: '<form aria-label="Login form"><input /><button>Submit</button></form>',
    },
    // Form with aria-labelledby
    {
      code: '<form aria-labelledby="form-title"><input /></form>',
    },
    // Form with name attribute
    {
      code: '<form name="search"><input /></form>',
    },
    // Non-form elements are fine
    {
      code: "<div><button>Click me</button></div>",
    },
    {
      code: '<nav><a href="/home">Home</a></nav>',
    },
    // Other elements don't trigger the rule
    {
      code: "<section><p>Content</p></section>",
    },
  ],
  invalid: [
    // Form without any accessible name
    {
      code: "<form><input /><button>Submit</button></form>",
      output:
        '<form aria-label="TODO: describe this form"><input /><button>Submit</button></form>',
      errors: [{ messageId: "formMissingName" }],
    },
    // Form with only an action attribute (not an accessible name)
    {
      code: '<form action="/api/submit"><input /></form>',
      output:
        '<form action="/api/submit" aria-label="TODO: describe this form"><input /></form>',
      errors: [{ messageId: "formMissingName" }],
    },
    // Form with className but no accessible name
    {
      code: '<form className="login-form"><input type="email" /><button>Login</button></form>',
      output:
        '<form className="login-form" aria-label="TODO: describe this form"><input type="email" /><button>Login</button></form>',
      errors: [{ messageId: "formMissingName" }],
    },
    // Form with onSubmit but no accessible name
    {
      code: "<form onSubmit={handleSubmit}><input /></form>",
      output:
        '<form onSubmit={handleSubmit} aria-label="TODO: describe this form"><input /></form>',
      errors: [{ messageId: "formMissingName" }],
    },
    // Form with method but no accessible name
    {
      code: '<form method="post"><input /><button>Send</button></form>',
      output:
        '<form method="post" aria-label="TODO: describe this form"><input /><button>Send</button></form>',
      errors: [{ messageId: "formMissingName" }],
    },
  ],
});
