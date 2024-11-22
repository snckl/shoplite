export class NotAuthorizedException extends Error {
  constructor(message: string = "Not Authorized") {
    super(message);
    this.name = "NotAuthorizedException";
    Object.setPrototypeOf(this, NotAuthorizedException.prototype);
  }
}
