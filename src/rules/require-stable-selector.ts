import { ESLintUtils } from "@typescript-eslint/utils";
import {
  getElementType,
  hasAnyAttribute,
  hasEventHandler,
} from "../utils/ast-helpers";
import {
  INTERACTIVE_ELEMENTS,
  INTERACTIVE_HANDLERS,
  STABLE_SELECTOR_ATTRIBUTES,
} from "../utils/constants";
import type { StableSelectorOptions } from "../utils/types";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/ratikkoka/agentlint/blob/main/docs/rules/${name}.md`
);

type Options = [StableSelectorOptions];
type MessageIds = "missingStableSelector";

export default createRule<Options, MessageIds>({
  name: "require-stable-selector",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Require interactive elements to have a stable selector for AI agent interaction",
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          additionalAttributes: {
            type: "array",
            items: { type: "string" },
            description:
              "Additional attribute names to accept as stable selectors",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingStableSelector:
        "Interactive element <{{element}}> has no stable selector. AI agents need a reliable way to find this element across builds. Add a `data-agent-id`, `data-testid`, or `id` attribute.",
    },
  },
  defaultOptions: [{}],
  create(context, [options]) {
    const additionalAttrs = options.additionalAttributes ?? [];
    const allStableAttrs = [
      ...STABLE_SELECTOR_ATTRIBUTES,
      ...additionalAttrs,
    ];

    return {
      JSXOpeningElement(node) {
        const elementType = getElementType(node);

        // Check if element is interactive
        const isInteractiveElement = INTERACTIVE_ELEMENTS.includes(
          elementType as (typeof INTERACTIVE_ELEMENTS)[number]
        );
        const hasInteractiveHandler = hasEventHandler(
          node,
          INTERACTIVE_HANDLERS
        );

        if (!isInteractiveElement && !hasInteractiveHandler) {
          return;
        }

        // Check if it already has a stable selector
        if (hasAnyAttribute(node, allStableAttrs)) {
          return;
        }

        context.report({
          node,
          messageId: "missingStableSelector",
          data: { element: elementType || "unknown" },
          fix(fixer) {
            // Generate a reasonable default agent ID
            const agentId = elementType || "element";
            const lastAttr = node.attributes[node.attributes.length - 1];
            const insertPoint = lastAttr ?? node.name;

            return fixer.insertTextAfter(
              insertPoint,
              ` data-agent-id="${agentId}"`
            );
          },
        });
      },
    };
  },
});
