export class NoStockException extends Error {
  constructor(message: string = "Not Enough Stock") {
    super(message);
    this.name = "NoStockException";
    Object.setPrototypeOf(this, NoStockException.prototype);
  }
}
