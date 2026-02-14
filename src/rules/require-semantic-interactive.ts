import { ESLintUtils } from "@typescript-eslint/utils";
import { getElementType, hasEventHandler, hasRole } from "../utils/ast-helpers";
import { INTERACTIVE_HANDLERS } from "../utils/constants";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/ratikkoka/agentlint/blob/main/docs/rules/${name}.md`
);

const NON_SEMANTIC_ELEMENTS = ["div", "span", "li", "td", "p"];

export default createRule({
  name: "require-semantic-interactive",
  meta: {
    type: "problem",
    docs: {
      description:
        "Require interactive elements to use semantic HTML. A <div onClick> is invisible to AI agents — use <button>, <a>, or add a role.",
    },
    fixable: "code",
    schema: [],
    messages: {
      nonSemanticInteractive:
        "<{{element}}> with {{handler}} is not a semantic interactive element. AI agents rely on semantic HTML to understand what elements do. Use <button>, <a>, or add an appropriate `role` attribute.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        const elementType = getElementType(node);

        // Only flag non-semantic elements
        if (!NON_SEMANTIC_ELEMENTS.includes(elementType)) {
          return;
        }

        // Check if it has interactive handlers
        if (!hasEventHandler(node, INTERACTIVE_HANDLERS)) {
          return;
        }

        // If it already has a role, it's at least partially accessible
        if (hasRole(node)) {
          return;
        }

        const handler = node.attributes.find(
          (attr) =>
            attr.type === "JSXAttribute" &&
            typeof attr.name.name === "string" &&
            (INTERACTIVE_HANDLERS as readonly string[]).includes(
              attr.name.name
            )
        );
        const handlerName =
          handler?.type === "JSXAttribute" ? handler.name.name : "handler";

        context.report({
          node,
          messageId: "nonSemanticInteractive",
          data: {
            element: elementType,
            handler: String(handlerName),
          },
          // Note: auto-fixing element tag replacement is complex in ESLint
          // Using a suggestion instead for safety
          fix(fixer) {
            const lastAttr = node.attributes[node.attributes.length - 1];
            const insertPoint = lastAttr ?? node.name;
            return fixer.insertTextAfter(
              insertPoint,
              ` role="button" tabIndex={0}`
            );
          },
        });
      },
    };
  },
});
