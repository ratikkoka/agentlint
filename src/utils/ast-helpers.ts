import type { TSESTree } from "@typescript-eslint/utils";

/**
 * Get the tag name from a JSX opening element
 */
export function getElementType(node: TSESTree.JSXOpeningElement): string {
  if (node.name.type === "JSXIdentifier") {
    return node.name.name;
  }
  if (node.name.type === "JSXMemberExpression") {
    return `${getJSXMemberExpressionName(node.name)}`;
  }
  return "";
}

function getJSXMemberExpressionName(
  node: TSESTree.JSXMemberExpression
): string {
  if (node.object.type === "JSXIdentifier") {
    return `${node.object.name}.${node.property.name}`;
  }
  if (node.object.type === "JSXMemberExpression") {
    return `${getJSXMemberExpressionName(node.object)}.${node.property.name}`;
  }
  return node.property.name;
}

/**
 * Check if a JSX element has a specific attribute
 */
export function hasAttribute(
  node: TSESTree.JSXOpeningElement,
  name: string
): boolean {
  return node.attributes.some(
    (attr) => attr.type === "JSXAttribute" && attr.name.name === name
  );
}

/**
 * Check if a JSX element has any of the specified attributes
 */
export function hasAnyAttribute(
  node: TSESTree.JSXOpeningElement,
  names: readonly string[]
): boolean {
  return names.some((name) => hasAttribute(node, name));
}

/**
 * Get the value of a JSX attribute as a string (if it's a string literal)
 */
export function getAttributeValue(
  node: TSESTree.JSXOpeningElement,
  name: string
): string | null {
  const attr = node.attributes.find(
    (a) => a.type === "JSXAttribute" && a.name.name === name
  ) as TSESTree.JSXAttribute | undefined;

  if (!attr || !attr.value) return null;

  if (attr.value.type === "Literal" && typeof attr.value.value === "string") {
    return attr.value.value;
  }

  return null;
}

/**
 * Check if a JSX element has any event handler props from a given list
 */
export function hasEventHandler(
  node: TSESTree.JSXOpeningElement,
  handlers: readonly string[]
): boolean {
  return node.attributes.some(
    (attr) =>
      attr.type === "JSXAttribute" &&
      typeof attr.name.name === "string" &&
      handlers.includes(attr.name.name)
  );
}

/**
 * Check if a JSX element has a `role` attribute
 */
export function hasRole(node: TSESTree.JSXOpeningElement): boolean {
  return hasAttribute(node, "role");
}

/**
 * Get the `role` attribute value
 */
export function getRoleValue(
  node: TSESTree.JSXOpeningElement
): string | null {
  return getAttributeValue(node, "role");
}

/**
 * Check if an element is a native HTML element (lowercase tag)
 */
export function isHTMLElement(node: TSESTree.JSXOpeningElement): boolean {
  const tag = getElementType(node);
  return tag.length > 0 && tag[0] === tag[0].toLowerCase();
}

/**
 * Check if the className prop contains a specific pattern
 */
export function classNameContains(
  node: TSESTree.JSXOpeningElement,
  pattern: string
): boolean {
  const classAttr = node.attributes.find(
    (a) => a.type === "JSXAttribute" && a.name.name === "className"
  ) as TSESTree.JSXAttribute | undefined;

  if (!classAttr || !classAttr.value) return false;

  // String literal className
  if (
    classAttr.value.type === "Literal" &&
    typeof classAttr.value.value === "string"
  ) {
    return classAttr.value.value
      .toLowerCase()
      .includes(pattern.toLowerCase());
  }

  // Template literal or expression — check for string patterns
  if (classAttr.value.type === "JSXExpressionContainer") {
    const expr = classAttr.value.expression;
    if (expr.type === "TemplateLiteral") {
      return expr.quasis.some((quasi) =>
        quasi.value.raw.toLowerCase().includes(pattern.toLowerCase())
      );
    }
  }

  return false;
}
