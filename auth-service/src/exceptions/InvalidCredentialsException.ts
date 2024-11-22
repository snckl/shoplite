export class InvalidCredentialsException extends Error {
  constructor(message: string = "Invalid credentials provided") {
    super(message);
    this.name = "InvalidCredentialsException";
    Object.setPrototypeOf(this, InvalidCredentialsException.prototype);
  }
}
