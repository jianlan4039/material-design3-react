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

type Condition = string | string[] | Record<string, boolean | undefined> | undefined

interface ClassHandler {
  (...condition: Condition[]): string
  
  buffer: Set<string>
  
  add(name: string): void
  
  addByConditions(condition: Condition): void
  
  remove(name: string): void
  
  toggle(name: string): void
  
  toString(): string
}

const createClassNames = (): ClassHandler => {
  const buffer: Set<string> = new Set<string>()
  const addByConditions = (condition: Condition) => {
    // Ignore undefined values
    if (condition === undefined) {
      return
    }
    
    if (typeof condition === 'string') {
      buffer.add(condition)
    } else if (Array.isArray(condition)) {
      condition.forEach(item => buffer.add(item))
    } else {
      Object.entries(condition).forEach(([key, value]) => {
        if (value) {
          buffer.add(key)
        } else {
          buffer.delete(key)
        }
      })
    }
  }
  
  const classNames: ClassHandler = ((...condition: Condition[]): string => {
    condition.forEach(item => addByConditions(item))
    return Array.from(buffer).join(' ')
  }) as ClassHandler
  
  classNames.add = (name: string) => {
    buffer.add(name)
  }
  
  classNames.addByConditions = addByConditions
  
  classNames.remove = (name: string) => {
    buffer.delete(name)
  }
  
  classNames.toggle = (name: string) => {
    if (buffer.has(name)) {
      buffer.delete(name)
    } else {
      buffer.add(name)
    }
  }
  
  classNames.toString = () => {
    return Array.from(buffer).join(' ')
  }
  
  return classNames
}

const classNames: ClassHandler = createClassNames()

export default classNames