import { ESLintUtils } from "@typescript-eslint/utils";
import { hasAttribute, hasEventHandler } from "../utils/ast-helpers";
import { HOVER_HANDLERS, FOCUS_HANDLERS } from "../utils/constants";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/ratikkoka/eslint-plugin-agentlint/blob/main/docs/rules/${name}.md`
);

export default createRule({
  name: "no-hover-only-action",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow actions that are only accessible via hover. AI agents cannot hover — provide focus or click alternatives.",
    },
    fixable: "code",
    schema: [],
    messages: {
      hoverOnlyAction:
        "This element uses hover handlers ({{handlers}}) without focus alternatives. AI agents cannot hover — add onFocus/onBlur handlers or a click-based toggle.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        const hasHover = hasEventHandler(node, HOVER_HANDLERS);
        const hasFocus = hasEventHandler(node, FOCUS_HANDLERS);

        if (hasHover && !hasFocus) {
          const hoverAttrs = node.attributes
            .filter(
              (attr) =>
                attr.type === "JSXAttribute" &&
                typeof attr.name.name === "string" &&
                (HOVER_HANDLERS as readonly string[]).includes(attr.name.name)
            )
            .map((attr) =>
              attr.type === "JSXAttribute" ? attr.name.name : ""
            );

          context.report({
            node,
            messageId: "hoverOnlyAction",
            data: { handlers: hoverAttrs.join(", ") },
            fix(fixer) {
              // Only add tabIndex if not already present
              if (hasAttribute(node, "tabIndex")) {
                return null;
              }
              const lastAttr = node.attributes[node.attributes.length - 1];
              const insertPoint = lastAttr ?? node.name;
              return fixer.insertTextAfter(insertPoint, ` tabIndex={0}`);
            },
          });
        }
      },
    };
  },
});
