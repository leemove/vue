/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives su bscribing to it.
 */
export default class Dep {
  static target: ?Watcher; // watcher 新的类型,观察者
  id: number; // id
  subs: Array<Watcher>; // 订阅列表

  constructor () {
    this.id = uid++
    // subs是存放watcher的数组
    this.subs = []
  }

  // 新增一个订阅
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  // 移除一个订阅
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  // 依赖
  depend () {
    // 在当前watcher中添加自己作为依赖
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  // 通知,通知所有订阅者我已经更新了!
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = []

export function pushTarget (_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}
