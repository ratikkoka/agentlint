import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/rules/require-modal-dismiss";
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

ruleTester.run("require-modal-dismiss", rule, {
  valid: [
    // Dialog with aria-modal already set
    {
      code: '<div role="dialog" aria-modal="true"><button>Close</button></div>',
    },
    // AlertDialog with aria-modal
    {
      code: '<div role="alertdialog" aria-modal="true"><button>OK</button></div>',
    },
    // Modal class with aria-modal
    {
      code: '<div className="modal" aria-modal="true"><button>Close</button></div>',
    },
    // Dialog class with aria-modal
    {
      code: '<div className="dialog-container" aria-modal="true">Content</div>',
    },
    // Overlay class with aria-modal
    {
      code: '<div className="overlay" aria-modal="true">Content</div>',
    },
    // Non-modal elements
    {
      code: "<div>Regular content</div>",
    },
    {
      code: '<div className="container">Not a modal</div>',
    },
    {
      code: '<div role="navigation">Nav</div>',
    },
  ],
  invalid: [
    // Dialog role without aria-modal
    {
      code: '<div role="dialog"><button>Close</button></div>',
      output:
        '<div role="dialog" aria-modal="true"><button>Close</button></div>',
      errors: [{ messageId: "modalMissingDismiss" }],
    },
    // AlertDialog role without aria-modal
    {
      code: '<div role="alertdialog"><button>OK</button></div>',
      output:
        '<div role="alertdialog" aria-modal="true"><button>OK</button></div>',
      errors: [{ messageId: "modalMissingDismiss" }],
    },
    // Modal className without aria-modal
    {
      code: '<div className="modal"><button>Close</button></div>',
      output:
        '<div className="modal" aria-modal="true"><button>Close</button></div>',
      errors: [{ messageId: "modalMissingDismiss" }],
    },
    // Dialog className without aria-modal
    {
      code: '<div className="dialog-wrapper">Content</div>',
      output:
        '<div className="dialog-wrapper" aria-modal="true">Content</div>',
      errors: [{ messageId: "modalMissingDismiss" }],
    },
    // Overlay className without aria-modal
    {
      code: '<div className="overlay">Content</div>',
      output: '<div className="overlay" aria-modal="true">Content</div>',
      errors: [{ messageId: "modalMissingDismiss" }],
    },
    // Popup className without aria-modal
    {
      code: '<div className="popup">Content</div>',
      output: '<div className="popup" aria-modal="true">Content</div>',
      errors: [{ messageId: "modalMissingDismiss" }],
    },
    // Lightbox className without aria-modal
    {
      code: '<div className="lightbox"><img src="photo.jpg" /></div>',
      output:
        '<div className="lightbox" aria-modal="true"><img src="photo.jpg" /></div>',
      errors: [{ messageId: "modalMissingDismiss" }],
    },
    // Dialog role with other attributes but no aria-modal
    {
      code: '<div role="dialog" id="confirm-dialog" onKeyDown={handleKey}><button>Close</button></div>',
      output:
        '<div role="dialog" id="confirm-dialog" onKeyDown={handleKey} aria-modal="true"><button>Close</button></div>',
      errors: [{ messageId: "modalMissingDismiss" }],
    },
  ],
});
