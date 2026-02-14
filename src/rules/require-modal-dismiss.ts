import { ESLintUtils } from "@typescript-eslint/utils";
import {
  getRoleValue,
  hasAttribute,
  classNameContains,
} from "../utils/ast-helpers";
import { MODAL_INDICATORS } from "../utils/constants";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/ratikkoka/eslint-plugin-agentlint/blob/main/docs/rules/${name}.md`
);

export default createRule({
  name: "require-modal-dismiss",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Modal dialogs must have a programmatic dismiss mechanism (close button, Escape key handler, aria-modal) so AI agents don't get trapped.",
    },
    fixable: "code",
    schema: [],
    messages: {
      modalMissingDismiss:
        "Modal/dialog element lacks `aria-modal` attribute. AI agents need to know this is a modal and how to dismiss it. Add `aria-modal=\"true\"` and ensure there is a close button and Escape key handler.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        const role = getRoleValue(node);
        const isModalRole =
          role !== null && (MODAL_INDICATORS.roles as readonly string[]).includes(role);
        const hasModalClass = MODAL_INDICATORS.classPatterns.some((pattern) =>
          classNameContains(node, pattern)
        );

        if (!isModalRole && !hasModalClass) {
          return;
        }

        // Check for aria-modal
        if (!hasAttribute(node, "aria-modal")) {
          context.report({
            node,
            messageId: "modalMissingDismiss",
            fix(fixer) {
              const lastAttr =
                node.attributes[node.attributes.length - 1];
              const insertPoint = lastAttr ?? node.name;
              return fixer.insertTextAfter(
                insertPoint,
                ` aria-modal="true"`
              );
            },
          });
        }
      },
    };
  },
});
