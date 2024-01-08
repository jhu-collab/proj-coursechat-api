/**
 * Enumeration representing the possible environments in which an application can run.
 *
 * This enum defines constants for different types of environments, each signifying a specific stage or configuration
 * in the application's lifecycle, such as development, production, testing, or provisioning.
 */
export enum Environment {
  /**
   * Represents the development environment.
   * This environment is typically used for development and debugging, where changes are made and tested.
   */
  Development = 'development',

  /**
   * Represents the production environment.
   * This is the live environment where the application runs after being fully developed and deployed.
   * It is used by end-users and is expected to be stable and optimized.
   */
  Production = 'production',

  /**
   * Represents the test environment.
   * Used primarily for running automated tests, ensuring code changes meet quality and functionality standards.
   */
  Test = 'test',

  /**
   * Represents the provision environment.
   * This can refer to a staging or a pre-production environment used for final testing and configurations
   * before moving to the production stage.
   */
  Provision = 'provision',
}
