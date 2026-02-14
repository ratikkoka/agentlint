import requireStableSelector from "./rules/require-stable-selector";
import noHoverOnlyAction from "./rules/no-hover-only-action";
import noCssOnlyState from "./rules/no-css-only-state";
import requireSemanticInteractive from "./rules/require-semantic-interactive";
import noDynamicPositionInstability from "./rules/no-dynamic-position-instability";
import requireActionContext from "./rules/require-action-context";
import requireModalDismiss from "./rules/require-modal-dismiss";

const rules = {
  "require-stable-selector": requireStableSelector,
  "no-hover-only-action": noHoverOnlyAction,
  "no-css-only-state": noCssOnlyState,
  "require-semantic-interactive": requireSemanticInteractive,
  "no-dynamic-position-instability": noDynamicPositionInstability,
  "require-action-context": requireActionContext,
  "require-modal-dismiss": requireModalDismiss,
};

const recommendedRules = {
  "agent/require-stable-selector": "warn",
  "agent/no-hover-only-action": "warn",
  "agent/no-css-only-state": "warn",
  "agent/require-semantic-interactive": "error",
  "agent/no-dynamic-position-instability": "warn",
  "agent/require-action-context": "warn",
  "agent/require-modal-dismiss": "warn",
} as const;

const strictRules = {
  "agent/require-stable-selector": "error",
  "agent/no-hover-only-action": "error",
  "agent/no-css-only-state": "error",
  "agent/require-semantic-interactive": "error",
  "agent/no-dynamic-position-instability": "error",
  "agent/require-action-context": "error",
  "agent/require-modal-dismiss": "error",
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugin: any = {
  meta: {
    name: "eslint-plugin-agentlint",
    version: "0.1.0",
  },
  rules,
  configs: {} as Record<string, unknown>,
};

// Self-referencing configs for ESLint 9+ flat config
plugin.configs.recommended = {
  plugins: { agent: plugin },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
  rules: recommendedRules,
};

plugin.configs.strict = {
  plugins: { agent: plugin },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
  rules: strictRules,
};

export default plugin;
