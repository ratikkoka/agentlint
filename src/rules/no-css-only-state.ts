import { ESLintUtils } from "@typescript-eslint/utils";
import { classNameContains, hasAttribute } from "../utils/ast-helpers";
import { CSS_STATE_TO_ARIA } from "../utils/constants";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/ratikkoka/agentlint/blob/main/docs/rules/${name}.md`
);

export default createRule({
  name: "no-css-only-state",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow communicating element state only through CSS classes. AI agents need queryable attributes like ARIA to understand state.",
    },
    fixable: "code",
    schema: [],
    messages: {
      cssOnlyState:
        'Element state "{{state}}" is only communicated via CSS class. AI agents cannot interpret visual styles — add `{{ariaAttr}}` to expose this state programmatically.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        for (const [pattern, ariaAttr] of Object.entries(CSS_STATE_TO_ARIA)) {
          if (classNameContains(node, pattern)) {
            // Check if the corresponding ARIA attribute is already present
            const hasAriaEquivalent =
              hasAttribute(node, ariaAttr) ||
              (pattern === "disabled" && hasAttribute(node, "disabled"));

            if (!hasAriaEquivalent) {
              const isInverse = pattern === "collapsed" || pattern === "closed";
              const ariaValue = isInverse ? "false" : "true";

              context.report({
                node,
                messageId: "cssOnlyState",
                data: { state: pattern, ariaAttr },
                fix(fixer) {
                  const lastAttr =
                    node.attributes[node.attributes.length - 1];
                  const insertPoint = lastAttr ?? node.name;
                  return fixer.insertTextAfter(
                    insertPoint,
                    ` ${ariaAttr}="${ariaValue}"`
                  );
                },
              });
              break; // Only report the first match per element
            }
          }
        }
      },
    };
  },
});
