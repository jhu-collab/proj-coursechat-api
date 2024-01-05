/**
 * Enumeration representing the possible roles associated with an API key.
 *
 * This enum defines constants for different roles that can be assigned to API keys,
 * indicating the level of access or permissions associated with each key.
 */
export enum ApiKeyRoles {
  /**
   * Represents the 'admin' role.
   * This role typically implies higher-level access or administrative privileges.
   */
  ADMIN = 'admin',

  /**
   * Represents the 'client' role.
   * This role is usually for regular users or clients with standard access rights.
   */
  CLIENT = 'client',
}
