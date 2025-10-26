export class ConflictException extends Error {
  status = 409;
  constructor(message: string) {
    super(message);
    this.name = 'ConflictException';
  }
}

export class BadRequestException extends Error {
  status = 400;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestException';
  }
}

export class UnauthorizedException extends Error {
  status = 401;
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedException';
  }
}

export class ForbiddenException extends Error {
  status = 403;
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenException';
  }
}

export class NotFoundException extends Error {
  status = 404;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundException';
  }
}

export class UnprocessableEntityException extends Error {
  status = 422;
  constructor(message: string) {
    super(message);
    this.name = 'UnprocessableEntityException';
  }
}
