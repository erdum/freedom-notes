export class ServerSyncAPIInterface {
  pull() {
    throw new Error('Method "pull()" must be implemented by subclass.');
  }

  push() {
    throw new Error('Method "push()" must be implemented by subclass.');
  }
}
