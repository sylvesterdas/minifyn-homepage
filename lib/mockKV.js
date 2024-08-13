class MockKV {
  constructor() {
    this.store = new Map();
  }

  async incr(key) {
    const value = (this.store.get(key) || 0) + 1;
    this.store.set(key, value);
    return value;
  }

  async expire(key, seconds) {
    setTimeout(() => {
      this.store.delete(key);
    }, seconds * 1000);
  }

  async del(key) {
    this.store.delete(key);
  }
}

export const mockKV = new MockKV();