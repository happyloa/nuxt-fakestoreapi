/**
 * Accepts only same-site relative paths for post-login redirects, rejecting
 * protocol-relative URLs, backslashes and control characters (open redirect).
 */
export function safeRedirectPath(value: unknown): string | null {
  return typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !/[\\\u0000-\u001f\u007f]/.test(value)
    ? value
    : null;
}
