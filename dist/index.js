"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

// src/rules/require-stable-selector.ts
var import_utils = require("@typescript-eslint/utils");

// src/utils/ast-helpers.ts
function getElementType(node) {
  if (node.name.type === "JSXIdentifier") {
    return node.name.name;
  }
  if (node.name.type === "JSXMemberExpression") {
    return `${getJSXMemberExpressionName(node.name)}`;
  }
  return "";
}
function getJSXMemberExpressionName(node) {
  if (node.object.type === "JSXIdentifier") {
    return `${node.object.name}.${node.property.name}`;
  }
  if (node.object.type === "JSXMemberExpression") {
    return `${getJSXMemberExpressionName(node.object)}.${node.property.name}`;
  }
  return node.property.name;
}
function hasAttribute(node, name) {
  return node.attributes.some(
    (attr) => attr.type === "JSXAttribute" && attr.name.name === name
  );
}
function hasAnyAttribute(node, names) {
  return names.some((name) => hasAttribute(node, name));
}
function getAttributeValue(node, name) {
  const attr = node.attributes.find(
    (a) => a.type === "JSXAttribute" && a.name.name === name
  );
  if (!attr || !attr.value) return null;
  if (attr.value.type === "Literal" && typeof attr.value.value === "string") {
    return attr.value.value;
  }
  return null;
}
function hasEventHandler(node, handlers) {
  return node.attributes.some(
    (attr) => attr.type === "JSXAttribute" && typeof attr.name.name === "string" && handlers.includes(attr.name.name)
  );
}
function hasRole(node) {
  return hasAttribute(node, "role");
}
function getRoleValue(node) {
  return getAttributeValue(node, "role");
}
function classNameContains(node, pattern) {
  const classAttr = node.attributes.find(
    (a) => a.type === "JSXAttribute" && a.name.name === "className"
  );
  if (!classAttr || !classAttr.value) return false;
  if (classAttr.value.type === "Literal" && typeof classAttr.value.value === "string") {
    return classAttr.value.value.toLowerCase().includes(pattern.toLowerCase());
  }
  if (classAttr.value.type === "JSXExpressionContainer") {
    const expr = classAttr.value.expression;
    if (expr.type === "TemplateLiteral") {
      return expr.quasis.some(
        (quasi) => quasi.value.raw.toLowerCase().includes(pattern.toLowerCase())
      );
    }
  }
  return false;
}

// src/utils/constants.ts
var INTERACTIVE_ELEMENTS = [
  "button",
  "a",
  "input",
  "select",
  "textarea",
  "details",
  "summary"
];
var INTERACTIVE_HANDLERS = [
  "onClick",
  "onSubmit",
  "onChange",
  "onKeyDown",
  "onKeyUp",
  "onKeyPress",
  "onDoubleClick"
];
var HOVER_HANDLERS = [
  "onMouseEnter",
  "onMouseOver",
  "onMouseLeave",
  "onMouseOut"
];
var FOCUS_HANDLERS = ["onFocus", "onBlur"];
var STABLE_SELECTOR_ATTRIBUTES = [
  "data-testid",
  "data-agent-id",
  "id"
];
var CSS_STATE_TO_ARIA = {
  disabled: "aria-disabled",
  active: "aria-pressed",
  selected: "aria-selected",
  loading: "aria-busy",
  hidden: "aria-hidden",
  collapsed: "aria-expanded",
  // inverse: collapsed = expanded=false
  expanded: "aria-expanded",
  checked: "aria-checked",
  open: "aria-expanded",
  closed: "aria-expanded"
  // inverse
};
var MODAL_INDICATORS = {
  roles: ["dialog", "alertdialog"],
  classPatterns: ["modal", "dialog", "overlay", "popup", "lightbox"],
  attributes: ["aria-modal"]
};

// src/rules/require-stable-selector.ts
var createRule = import_utils.ESLintUtils.RuleCreator(
  (name) => `https://github.com/ratikkoka/agentlint/blob/main/docs/rules/${name}.md`
);
var require_stable_selector_default = createRule({
  name: "require-stable-selector",
  meta: {
    type: "suggestion",
    docs: {
      description: "Require interactive elements to have a stable selector for AI agent interaction"
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          additionalAttributes: {
            type: "array",
            items: { type: "string" },
            description: "Additional attribute names to accept as stable selectors"
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      missingStableSelector: "Interactive element <{{element}}> has no stable selector. AI agents need a reliable way to find this element across builds. Add a `data-agent-id`, `data-testid`, or `id` attribute."
    }
  },
  defaultOptions: [{}],
  create(context, [options]) {
    const additionalAttrs = options.additionalAttributes ?? [];
    const allStableAttrs = [
      ...STABLE_SELECTOR_ATTRIBUTES,
      ...additionalAttrs
    ];
    return {
      JSXOpeningElement(node) {
        const elementType = getElementType(node);
        const isInteractiveElement = INTERACTIVE_ELEMENTS.includes(
          elementType
        );
        const hasInteractiveHandler = hasEventHandler(
          node,
          INTERACTIVE_HANDLERS
        );
        if (!isInteractiveElement && !hasInteractiveHandler) {
          return;
        }
        if (hasAnyAttribute(node, allStableAttrs)) {
          return;
        }
        context.report({
          node,
          messageId: "missingStableSelector",
          data: { element: elementType || "unknown" },
          fix(fixer) {
            const agentId = elementType || "element";
            const lastAttr = node.attributes[node.attributes.length - 1];
            const insertPoint = lastAttr ?? node.name;
            return fixer.insertTextAfter(
              insertPoint,
              ` data-agent-id="${agentId}"`
            );
          }
        });
      }
    };
  }
});

// src/rules/no-hover-only-action.ts
var import_utils2 = require("@typescript-eslint/utils");
var createRule2 = import_utils2.ESLintUtils.RuleCreator(
  (name) => `https://github.com/ratikkoka/agentlint/blob/main/docs/rules/${name}.md`
);
var no_hover_only_action_default = createRule2({
  name: "no-hover-only-action",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow actions that are only accessible via hover. AI agents cannot hover \u2014 provide focus or click alternatives."
    },
    fixable: "code",
    schema: [],
    messages: {
      hoverOnlyAction: "This element uses hover handlers ({{handlers}}) without focus alternatives. AI agents cannot hover \u2014 add onFocus/onBlur handlers or a click-based toggle."
    }
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        const hasHover = hasEventHandler(node, HOVER_HANDLERS);
        const hasFocus = hasEventHandler(node, FOCUS_HANDLERS);
        if (hasHover && !hasFocus) {
          const hoverAttrs = node.attributes.filter(
            (attr) => attr.type === "JSXAttribute" && typeof attr.name.name === "string" && HOVER_HANDLERS.includes(attr.name.name)
          ).map(
            (attr) => attr.type === "JSXAttribute" ? attr.name.name : ""
          );
          context.report({
            node,
            messageId: "hoverOnlyAction",
            data: { handlers: hoverAttrs.join(", ") },
            fix(fixer) {
              if (hasAttribute(node, "tabIndex")) {
                return null;
              }
              const lastAttr = node.attributes[node.attributes.length - 1];
              const insertPoint = lastAttr ?? node.name;
              return fixer.insertTextAfter(insertPoint, ` tabIndex={0}`);
            }
          });
        }
      }
    };
  }
});

// src/rules/no-css-only-state.ts
var import_utils3 = require("@typescript-eslint/utils");
var createRule3 = import_utils3.ESLintUtils.RuleCreator(
  (name) => `https://github.com/ratikkoka/agentlint/blob/main/docs/rules/${name}.md`
);
var no_css_only_state_default = createRule3({
  name: "no-css-only-state",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow communicating element state only through CSS classes. AI agents need queryable attributes like ARIA to understand state."
    },
    fixable: "code",
    schema: [],
    messages: {
      cssOnlyState: 'Element state "{{state}}" is only communicated via CSS class. AI agents cannot interpret visual styles \u2014 add `{{ariaAttr}}` to expose this state programmatically.'
    }
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        for (const [pattern, ariaAttr] of Object.entries(CSS_STATE_TO_ARIA)) {
          if (classNameContains(node, pattern)) {
            const hasAriaEquivalent = hasAttribute(node, ariaAttr) || pattern === "disabled" && hasAttribute(node, "disabled");
            if (!hasAriaEquivalent) {
              const isInverse = pattern === "collapsed" || pattern === "closed";
              const ariaValue = isInverse ? "false" : "true";
              context.report({
                node,
                messageId: "cssOnlyState",
                data: { state: pattern, ariaAttr },
                fix(fixer) {
                  const lastAttr = node.attributes[node.attributes.length - 1];
                  const insertPoint = lastAttr ?? node.name;
                  return fixer.insertTextAfter(
                    insertPoint,
                    ` ${ariaAttr}="${ariaValue}"`
                  );
                }
              });
              break;
            }
          }
        }
      }
    };
  }
});

// src/rules/require-semantic-interactive.ts
var import_utils4 = require("@typescript-eslint/utils");
var createRule4 = import_utils4.ESLintUtils.RuleCreator(
  (name) => `https://github.com/ratikkoka/agentlint/blob/main/docs/rules/${name}.md`
);
var NON_SEMANTIC_ELEMENTS = ["div", "span", "li", "td", "p"];
var require_semantic_interactive_default = createRule4({
  name: "require-semantic-interactive",
  meta: {
    type: "problem",
    docs: {
      description: "Require interactive elements to use semantic HTML. A <div onClick> is invisible to AI agents \u2014 use <button>, <a>, or add a role."
    },
    fixable: "code",
    schema: [],
    messages: {
      nonSemanticInteractive: "<{{element}}> with {{handler}} is not a semantic interactive element. AI agents rely on semantic HTML to understand what elements do. Use <button>, <a>, or add an appropriate `role` attribute."
    }
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        const elementType = getElementType(node);
        if (!NON_SEMANTIC_ELEMENTS.includes(elementType)) {
          return;
        }
        if (!hasEventHandler(node, INTERACTIVE_HANDLERS)) {
          return;
        }
        if (hasRole(node)) {
          return;
        }
        const handler = node.attributes.find(
          (attr) => attr.type === "JSXAttribute" && typeof attr.name.name === "string" && INTERACTIVE_HANDLERS.includes(
            attr.name.name
          )
        );
        const handlerName = handler?.type === "JSXAttribute" ? handler.name.name : "handler";
        context.report({
          node,
          messageId: "nonSemanticInteractive",
          data: {
            element: elementType,
            handler: String(handlerName)
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
          }
        });
      }
    };
  }
});

// src/rules/no-dynamic-position-instability.ts
var import_utils5 = require("@typescript-eslint/utils");
var createRule5 = import_utils5.ESLintUtils.RuleCreator(
  (name) => `https://github.com/ratikkoka/agentlint/blob/main/docs/rules/${name}.md`
);
var no_dynamic_position_instability_default = createRule5({
  name: "no-dynamic-position-instability",
  meta: {
    type: "suggestion",
    docs: {
      description: "Conditionally rendered interactive elements should have stable identifiers so AI agents can find them regardless of render order."
    },
    fixable: "code",
    schema: [],
    messages: {
      unstableDynamicElement: "Conditionally rendered interactive element lacks a stable identifier. AI agents may not find this element reliably when its position shifts. Add a `data-agent-id` or `data-testid`."
    }
  },
  defaultOptions: [],
  create(context) {
    return {
      // Detect {condition && <Element>} patterns
      LogicalExpression(node) {
        if (node.operator !== "&&") return;
        const right = node.right;
        if (right.type !== "JSXElement") return;
        const openingElement = right.openingElement;
        const tagName = openingElement.name.type === "JSXIdentifier" ? openingElement.name.name : "";
        const isInteractive = INTERACTIVE_ELEMENTS.includes(
          tagName
        ) || hasEventHandler(openingElement, INTERACTIVE_HANDLERS);
        if (!isInteractive) return;
        if (hasAnyAttribute(openingElement, [...STABLE_SELECTOR_ATTRIBUTES])) {
          return;
        }
        context.report({
          node: openingElement,
          messageId: "unstableDynamicElement",
          fix(fixer) {
            const lastAttr = openingElement.attributes[openingElement.attributes.length - 1];
            const insertPoint = lastAttr ?? openingElement.name;
            return fixer.insertTextAfter(
              insertPoint,
              ` data-agent-id="${tagName || "dynamic-element"}"`
            );
          }
        });
      }
    };
  }
});

// src/rules/require-action-context.ts
var import_utils6 = require("@typescript-eslint/utils");
var createRule6 = import_utils6.ESLintUtils.RuleCreator(
  (name) => `https://github.com/ratikkoka/agentlint/blob/main/docs/rules/${name}.md`
);
var require_action_context_default = createRule6({
  name: "require-action-context",
  meta: {
    type: "suggestion",
    docs: {
      description: "Forms and standalone buttons must have an accessible name so AI agents can identify their purpose."
    },
    fixable: "code",
    schema: [],
    messages: {
      formMissingName: "<form> has no accessible name. AI agents need to distinguish between forms \u2014 add `aria-label` or `aria-labelledby`."
      // Future: orphan button detection
    }
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        const elementType = getElementType(node);
        if (elementType === "form") {
          const hasName = hasAttribute(node, "aria-label") || hasAttribute(node, "aria-labelledby") || hasAttribute(node, "name");
          if (!hasName) {
            context.report({
              node,
              messageId: "formMissingName",
              fix(fixer) {
                const lastAttr = node.attributes[node.attributes.length - 1];
                const insertPoint = lastAttr ?? node.name;
                return fixer.insertTextAfter(
                  insertPoint,
                  ` aria-label="TODO: describe this form"`
                );
              }
            });
          }
        }
      }
    };
  }
});

// src/rules/require-modal-dismiss.ts
var import_utils7 = require("@typescript-eslint/utils");
var createRule7 = import_utils7.ESLintUtils.RuleCreator(
  (name) => `https://github.com/ratikkoka/agentlint/blob/main/docs/rules/${name}.md`
);
var require_modal_dismiss_default = createRule7({
  name: "require-modal-dismiss",
  meta: {
    type: "suggestion",
    docs: {
      description: "Modal dialogs must have a programmatic dismiss mechanism (close button, Escape key handler, aria-modal) so AI agents don't get trapped."
    },
    fixable: "code",
    schema: [],
    messages: {
      modalMissingDismiss: 'Modal/dialog element lacks `aria-modal` attribute. AI agents need to know this is a modal and how to dismiss it. Add `aria-modal="true"` and ensure there is a close button and Escape key handler.'
    }
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        const role = getRoleValue(node);
        const isModalRole = role !== null && MODAL_INDICATORS.roles.includes(role);
        const hasModalClass = MODAL_INDICATORS.classPatterns.some(
          (pattern) => classNameContains(node, pattern)
        );
        if (!isModalRole && !hasModalClass) {
          return;
        }
        if (!hasAttribute(node, "aria-modal")) {
          context.report({
            node,
            messageId: "modalMissingDismiss",
            fix(fixer) {
              const lastAttr = node.attributes[node.attributes.length - 1];
              const insertPoint = lastAttr ?? node.name;
              return fixer.insertTextAfter(
                insertPoint,
                ` aria-modal="true"`
              );
            }
          });
        }
      }
    };
  }
});

// src/index.ts
var rules = {
  "require-stable-selector": require_stable_selector_default,
  "no-hover-only-action": no_hover_only_action_default,
  "no-css-only-state": no_css_only_state_default,
  "require-semantic-interactive": require_semantic_interactive_default,
  "no-dynamic-position-instability": no_dynamic_position_instability_default,
  "require-action-context": require_action_context_default,
  "require-modal-dismiss": require_modal_dismiss_default
};
var recommendedRules = {
  "agent/require-stable-selector": "warn",
  "agent/no-hover-only-action": "warn",
  "agent/no-css-only-state": "warn",
  "agent/require-semantic-interactive": "error",
  "agent/no-dynamic-position-instability": "warn",
  "agent/require-action-context": "warn",
  "agent/require-modal-dismiss": "warn"
};
var strictRules = {
  "agent/require-stable-selector": "error",
  "agent/no-hover-only-action": "error",
  "agent/no-css-only-state": "error",
  "agent/require-semantic-interactive": "error",
  "agent/no-dynamic-position-instability": "error",
  "agent/require-action-context": "error",
  "agent/require-modal-dismiss": "error"
};
var plugin = {
  meta: {
    name: "eslint-plugin-agentlint",
    version: "0.1.0"
  },
  rules,
  configs: {}
};
plugin.configs.recommended = {
  plugins: { agent: plugin },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true }
    }
  },
  rules: recommendedRules
};
plugin.configs.strict = {
  plugins: { agent: plugin },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true }
    }
  },
  rules: strictRules
};
var index_default = plugin;
//# sourceMappingURL=index.js.map