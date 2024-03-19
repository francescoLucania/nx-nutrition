export default class ApiError extends Error {
  status: number;
  errors: any;

  constructor(status: number, message: string, errors = []) {
    super(message);

    this.status = status
    this.errors = errors
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Пользователь не авторизован')
  }

  static BedRequest(message, errors) {
    return new ApiError(400, message, errors);
  }
}
