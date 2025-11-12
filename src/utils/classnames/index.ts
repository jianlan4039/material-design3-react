/**
 * 1. 混合多个class名到一起
 * 3. 设置默认class名
 * 4. 移除或添加一个或多个class名
 */
export default class ClassNames {
  // 缓存单个class名，每子项是一个单独的class名
  buffer: Set<string> = new Set<string>()

  constructor(name: string | string[]) {
    if (name instanceof Array) {
      name.forEach(item => {
        this.buffer.add(item)
      })
    } else {
      this.buffer.add(name)
    }
  }

  add(name: string) {
    this.buffer.add(name)
  }

  addWithCondition(condition: Record<string, boolean>) {
    Object.entries(condition).map(([key, value]) => {
      if (value) {
        this.buffer.add(key)
      } else {
        this.buffer.delete(key)
      }
    })
  }

  remove(name: string) {
    this.buffer.delete(name)
  }

  toggle(name: string) {
    if (this.buffer.has(name)) {
      this.buffer.delete(name)
    } else {
      this.buffer.add(name)
    }
  }

  toString() {
    return Array.from(this.buffer).join(' ')
  }
}