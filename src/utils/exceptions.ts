export class UserAlreadyExistsException extends Error {
  constructor() {
    super();
    this.name = "USER_ALREADY_EXISTS";
    this.message = "This user already exists";
  }
}
