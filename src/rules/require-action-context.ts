import { ESLintUtils } from "@typescript-eslint/utils";
import { getElementType, hasAttribute } from "../utils/ast-helpers";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/ratikkoka/agentlint/blob/main/docs/rules/${name}.md`
);

export default createRule({
  name: "require-action-context",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Forms and standalone buttons must have an accessible name so AI agents can identify their purpose.",
    },
    fixable: "code",
    schema: [],
    messages: {
      formMissingName:
        "<form> has no accessible name. AI agents need to distinguish between forms — add `aria-label` or `aria-labelledby`.",
      // Future: orphan button detection
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        const elementType = getElementType(node);

        if (elementType === "form") {
          const hasName =
            hasAttribute(node, "aria-label") ||
            hasAttribute(node, "aria-labelledby") ||
            hasAttribute(node, "name");

          if (!hasName) {
            context.report({
              node,
              messageId: "formMissingName",
              fix(fixer) {
                const lastAttr =
                  node.attributes[node.attributes.length - 1];
                const insertPoint = lastAttr ?? node.name;
                return fixer.insertTextAfter(
                  insertPoint,
                  ` aria-label="TODO: describe this form"`
                );
              },
            });
          }
        }
      },
    };
  },
});
