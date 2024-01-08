/**
 * Enumeration representing the possible sort orders in queries.
 *
 * This enum defines constants for specifying the order in which results should be sorted:
 * either ascending (ASC) or descending (DESC).
 */
export enum SortOrder {
  /**
   * Represents ascending order.
   * Used to sort results from the lowest/highest or earliest value to the highest/latest.
   */
  ASC = 'ASC',

  /**
   * Represents descending order.
   * Used to sort results from the highest/latest value to the lowest/earliest.
   */
  DESC = 'DESC',
}
