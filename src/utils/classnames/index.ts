/**
 * Copyright (c) 2024 jian lan
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Type definition for classNames function arguments
 * 
 * Supports multiple input types:
 * - string: Direct class name string
 * - string[]: Array of class name strings
 * - Record<string, boolean | undefined>: Object where keys are class names and values determine inclusion
 * - undefined: Ignored values
 */
type ClassValue = string | string[] | Record<string, boolean | undefined> | undefined;

/**
 * Processes a single class value and returns an array of class names
 * 
 * This is a pure function that processes different input types:
 * - string: Returns array with the string
 * - string[]: Returns the array after filtering empty values
 * - Record: Returns keys where values are truthy
 * - undefined/null: Returns empty array
 * 
 * @param value - The class value to process
 * @returns Array of class name strings
 */
function processClassValue(value: ClassValue): string[] {
  // Handle undefined or null
  if (value === undefined || value === null) {
    return [];
  }

  // Handle string type
  if (typeof value === 'string') {
    return value.trim() ? [value] : [];
  }

  // Handle array type
  if (Array.isArray(value)) {
    return value
      .flatMap(item => processClassValue(item))
      .filter(Boolean);
  }

  // Handle object type (Record<string, boolean | undefined>)
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([_, condition]) => Boolean(condition))
      .map(([className]) => className)
      .filter(Boolean);
  }

  return [];
}

/**
 * Combines multiple class name arguments into a single space-separated string
 * 
 * This function processes multiple class name inputs and combines them into a single string.
 * Each component using this function gets its own independent result string, ensuring
 * no cross-component pollution.
 * 
 * @param args - Variable number of class name arguments
 * @returns Space-separated string of class names
 * 
 * @example
 * ```ts
 * // Basic usage with strings
 * classNames('btn', 'btn-primary'); // "btn btn-primary"
 * 
 * // With arrays
 * classNames(['btn', 'btn-primary']); // "btn btn-primary"
 * 
 * // With conditional objects
 * const selected = true;
 * classNames({
 *   'btn': true,
 *   'btn-selected': selected,
 *   'btn-disabled': false
 * }); // "btn btn-selected"
 * 
 * // Mixed arguments
 * classNames('btn', ['btn-primary'], {
 *   'btn-selected': true
 * }); // "btn btn-primary btn-selected"
 * 
 * // With undefined values (ignored)
 * classNames('btn', undefined, 'btn-primary'); // "btn btn-primary"
 * ```
 */
export function classNames(...args: ClassValue[]): string {
  // Process all arguments and flatten into a single array
  const classNamesArray = args
    .flatMap(arg => processClassValue(arg))
    .filter(Boolean) // Remove any empty strings
    .filter((className, index, array) => array.indexOf(className) === index); // Remove duplicates

  // Join with spaces and return
  return classNamesArray.join(' ');
}

export default classNames;
