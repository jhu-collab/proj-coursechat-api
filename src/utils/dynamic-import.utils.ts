/**
 * Dynamic Import Utility
 *
 * Problem:
 * --------
 * When using ES Modules (ESM) in a primarily CommonJS (CJS) environment, there can
 * be interoperability issues. Some packages might be published exclusively as ESM
 * and cannot be directly `require`d in a CJS environment. This is particularly
 * problematic when using TypeScript, which might transpile dynamic `import()`
 * statements into `require` calls, leading to runtime errors.
 *
 * Solution:
 * ---------
 * This utility provides a way to dynamically import ESM packages into a CJS
 * environment without running into the aforementioned issues. By using the
 * Function constructor, we bypass TypeScript's transpilation and ensure that
 * the import is done natively by Node.js.
 *
 * This utility is based on the following article:
 * https://dev.to/wolfejw86/the-commonjs-vs-es-modules-war-is-taxing-for-us-regular-folks-out-here-one-way-to-interop-55e
 *
 * Usage:
 * ------
 * Simply call the `dynamicImport` function with the package or module path as
 * an argument:
 *
 * const { SomeExport } = await dynamicImport('some-esm-only-package');
 *
 * @param packageName - The name or path of the package/module to be imported.
 * @returns - A promise that resolves to the imported module.
 */
export const dynamicImport = async (packageName: string) => {
  return new Function(`return import('${packageName}')`)();
};
