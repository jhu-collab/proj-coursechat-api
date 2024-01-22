/**
 * Boolean String Transformation Utility
 *
 * Problem:
 * --------
 * When dealing with query parameters in web applications, especially in APIs,
 * boolean values are often passed as strings ('true' or 'false'). However, for
 * proper handling within the application, it's essential to convert these string
 * representations to actual boolean values. This conversion needs to be robust
 * to account for various cases, including the presence or absence of the expected
 * boolean field in the query object, and handling values other than 'true' or 'false'.
 *
 * Solution:
 * ---------
 * The `booleanStringTransform` function addresses this issue by providing a
 * consistent way to transform string representations of boolean values into
 * actual boolean types. It checks if the specified key exists in the given object
 * and then converts 'true' to `true` and 'false' to `false`. If the key is not
 * found or the value is neither 'true' nor 'false', it returns `undefined`.
 * This function is particularly useful in the context of DTOs (Data Transfer Objects)
 * with the Nest.js framework, especially when used with the `@Transform` decorator
 * from the `class-transformer` package. If you don't use this transformer function,
 * the `class-transformer` package will content 'false' to `true` becasue it treats
 * any non-empty string as `true`. This is just one of the many ways in which this
 * transformation can go wrong.
 *
 * Usage:
 * ------
 * The function can be used within DTOs to handle boolean string transformations.
 * Here's an example of using it in a DTO with the `@Transform` decorator:
 *
 * @Transform(({ obj }) => booleanStringTransform(obj, 'isActive'))
 * isActive?: boolean;
 *
 * This will transform the 'isActive' string field in the `obj` object to a boolean
 * value, if present.
 *
 * @param obj - The object containing the key to be transformed.
 * @param key - The key in the object whose value needs to be transformed.
 * @returns - A boolean value if the key exists and is either 'true' or 'false',
 *            or `undefined` if the key doesn't exist or the value is not 'true'/'false'.
 */
export function booleanStringTransform(
  obj: any,
  key: string,
): boolean | undefined {
  if (key in obj) {
    return obj[key] === 'true'
      ? true
      : obj[key] === 'false'
      ? false
      : undefined;
  }
  return undefined;
}
