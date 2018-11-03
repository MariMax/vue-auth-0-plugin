import {Subscription} from './subscription';
export class Subject<T = any> {
  private subscribers: Array<((value: T) => void)> = [];

  constructor() {
    this.unsubscribeFn = this.unsubscribeFn.bind(this);
  }

  public next(value: T) {
    this.subscribers.forEach((i) => i(value));
  }

  public subscribe(fn: (value: T) => void) {
    this.subscribers.push(fn);
    return new Subscription(() => this.unsubscribeFn(fn));
  }

  private unsubscribeFn(fn: (value: T) => void) {
    this.subscribers = this.subscribers.filter((i) => i !== fn);
  }
}
