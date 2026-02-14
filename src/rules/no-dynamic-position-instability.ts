import { ESLintUtils } from "@typescript-eslint/utils";
import type { TSESTree } from "@typescript-eslint/utils";
import { hasAnyAttribute, hasEventHandler } from "../utils/ast-helpers";
import {
  STABLE_SELECTOR_ATTRIBUTES,
  INTERACTIVE_ELEMENTS,
  INTERACTIVE_HANDLERS,
} from "../utils/constants";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/ratikkoka/eslint-plugin-agentlint/blob/main/docs/rules/${name}.md`
);

export default createRule({
  name: "no-dynamic-position-instability",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Conditionally rendered interactive elements should have stable identifiers so AI agents can find them regardless of render order.",
    },
    fixable: "code",
    schema: [],
    messages: {
      unstableDynamicElement:
        "Conditionally rendered interactive element lacks a stable identifier. AI agents may not find this element reliably when its position shifts. Add a `data-agent-id` or `data-testid`.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      // Detect {condition && <Element>} patterns
      LogicalExpression(node: TSESTree.LogicalExpression) {
        if (node.operator !== "&&") return;

        const right = node.right;
        if (right.type !== "JSXElement") return;

        const openingElement = right.openingElement;

        // Check if the element is interactive
        const tagName =
          openingElement.name.type === "JSXIdentifier"
            ? openingElement.name.name
            : "";
        const isInteractive =
          INTERACTIVE_ELEMENTS.includes(
            tagName as (typeof INTERACTIVE_ELEMENTS)[number]
          ) || hasEventHandler(openingElement, INTERACTIVE_HANDLERS);

        if (!isInteractive) return;

        // Check if it has a stable selector
        if (hasAnyAttribute(openingElement, [...STABLE_SELECTOR_ATTRIBUTES])) {
          return;
        }

        context.report({
          node: openingElement,
          messageId: "unstableDynamicElement",
          fix(fixer) {
            const lastAttr =
              openingElement.attributes[
                openingElement.attributes.length - 1
              ];
            const insertPoint = lastAttr ?? openingElement.name;
            return fixer.insertTextAfter(
              insertPoint,
              ` data-agent-id="${tagName || "dynamic-element"}"`
            );
          },
        });
      },
    };
  },
});
