export class Subscription {
  constructor(private unsubscribeFn: () => void) {
  }

  public unsubscribe() {
    this.unsubscribeFn();
  }
}