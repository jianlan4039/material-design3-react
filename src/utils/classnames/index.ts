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
export type ClassValue = string | string[] | Record<string, boolean | undefined> | undefined;

/**
 * Class name manager interface with methods for managing class names
 * 
 * Provides a fluent API for adding, removing, and checking class names
 * with efficient Set-based operations.
 */
export interface ClassNameManager {
  /**
   * Returns the class names as a space-separated string
   * 
   * This method enables the ClassNameManager to be used directly in string contexts,
   * such as string concatenation or template literals.
   * 
   * @returns Space-separated string of class names
   * 
   * @example
   * ```ts
   * const cn = classNames('btn', 'btn-primary');
   * cn.toString(); // "btn btn-primary"
   * 
   * // Can be used in string concatenation
   * const result = 'nd-button' + cn; // "nd-buttonbtn btn-primary"
   * 
   * // Or in template literals
   * const template = `class="${cn}"`; // 'class="btn btn-primary"'
   * ```
   */
  toString(): string;
  
  /**
   * Returns the class names as a space-separated string
   */
  valueOf(): string;
  
  /**
   * Symbol.toPrimitive for automatic string conversion
   */
  [Symbol.toPrimitive](hint: 'string' | 'number' | 'default'): string;
  
  /**
   * Adds one or more class names to the set
   * Automatically handles duplicates
   * 
   * @param args - Class name arguments to add
   * @returns The ClassNameManager instance for chaining
   * 
   * @example
   * ```ts
   * const cn = classNames('btn');
   * cn.add('btn-primary', 'btn-large');
   * cn.toString(); // "btn btn-primary btn-large"
   * ```
   */
  add(...args: ClassValue[]): ClassNameManager;
  
  /**
   * Removes one or more class names from the set
   * 
   * @param args - Class name arguments to remove
   * @returns The ClassNameManager instance for chaining
   * 
   * @example
   * ```ts
   * const cn = classNames('btn', 'btn-primary');
   * cn.remove('btn-primary');
   * cn.toString(); // "btn"
   * ```
   */
  remove(...args: ClassValue[]): ClassNameManager;
  
  /**
   * Checks if a class name exists in the set
   * 
   * @param className - The class name to check
   * @returns True if the class name exists, false otherwise
   * 
   * @example
   * ```ts
   * const cn = classNames('btn', 'btn-primary');
   * cn.check('btn-primary'); // true
   * cn.check('btn-large'); // false
   * ```
   */
  check(className: string): boolean;
}

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
 * Creates a ClassNameManager instance that manages class names using a Set for efficient operations
 * 
 * @param args - Variable number of class name arguments
 * @returns ClassNameManager with methods for managing class names
 * 
 * @example
 * ```ts
 * // Basic usage with strings (backward compatible)
 * const cn = classNames('btn', 'btn-primary');
 * cn.toString(); // "btn btn-primary"
 * 
 * // With arrays
 * const cn2 = classNames(['btn', 'btn-primary']);
 * 
 * // With conditional objects
 * const selected = true;
 * const cn3 = classNames({
 *   'btn': true,
 *   'btn-selected': selected,
 *   'btn-disabled': false
 * });
 * 
 * // Using methods
 * const cn4 = classNames('btn');
 * cn4.add('btn-primary').add('btn-large');
 * cn4.check('btn-primary'); // true
 * cn4.remove('btn-large');
 * cn4.toString(); // "btn btn-primary"
 * ```
 */
export function classNames(...args: ClassValue[]): ClassNameManager {
  // Use Set for efficient duplicate handling and operations
  const classNamesSet = new Set<string>();
  
  // Process initial arguments and add to Set
  args.forEach(arg => {
    const processed = processClassValue(arg);
    processed.forEach(className => {
      if (className) {
        classNamesSet.add(className);
      }
    });
  });

  // Helper function to get string representation
  const getString = (): string => Array.from(classNamesSet).join(' ');

  // Create instance with methods
  const instance: ClassNameManager = {
    toString(): string {
      return getString();
    },
    
    valueOf(): string {
      return getString();
    },
    
    [Symbol.toPrimitive](_hint: 'string' | 'number' | 'default'): string {
      return getString();
    },
    
    add(...addArgs: ClassValue[]): ClassNameManager {
      addArgs.forEach(arg => {
        const processed = processClassValue(arg);
        processed.forEach(className => {
          if (className) {
            classNamesSet.add(className);
          }
        });
      });
      return instance;
    },
    
    remove(...removeArgs: ClassValue[]): ClassNameManager {
      removeArgs.forEach(arg => {
        const processed = processClassValue(arg);
        processed.forEach(className => {
          if (className) {
            classNamesSet.delete(className);
          }
        });
      });
      return instance;
    },
    
    check(className: string): boolean {
      return classNamesSet.has(className);
    }
  };

  return instance;
}

export default classNames;
