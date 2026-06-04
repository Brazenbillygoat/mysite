// Helps VS Code autocomplete Prettier options and catch typos while editing.
/** @type {import("prettier").Config} */
module.exports = {
  // Spaces per indent. Common: 2 or 4.
  tabWidth: 2,

  // Use spaces instead of tab characters.
  useTabs: false,

  // Wrap lines near this length. Common: 80, 100, 120.
  printWidth: 100,

  // Use double quotes unless this is true.
  singleQuote: false,

  // Add semicolons in JavaScript.
  semi: true,

  // Keep closing HTML/JSX bracket behavior explicit.
  bracketSameLine: false,

  // "css" respects CSS display rules. "ignore" makes HTML wrapping less fussy.
  htmlWhitespaceSensitivity: "css",

  // Add trailing commas where valid in ES5: objects, arrays, etc.
  trailingComma: "es5",
};