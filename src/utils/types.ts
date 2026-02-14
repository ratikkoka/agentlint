import type { TSESTree } from "@typescript-eslint/utils";

/**
 * A JSX element node (opening element of a JSX component)
 */
export type JSXOpeningElement = TSESTree.JSXOpeningElement;

/**
 * A JSX attribute (name=value pair)
 */
export type JSXAttribute = TSESTree.JSXAttribute;

/**
 * Represents a rule's configuration options for stable selector attributes
 */
export interface StableSelectorOptions {
  /** Additional attribute names to accept as stable selectors */
  additionalAttributes?: string[];
}

/**
 * Represents a rule's configuration for CSS state patterns
 */
export interface CssStateOptions {
  /** Additional CSS class patterns to check */
  additionalPatterns?: Record<string, string>;
  /** Patterns to ignore */
  ignorePatterns?: string[];
}
