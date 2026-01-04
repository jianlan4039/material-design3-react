type Condition = string | string[] | Record<string, boolean | undefined>

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