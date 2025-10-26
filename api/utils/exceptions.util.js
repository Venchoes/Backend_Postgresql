"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnprocessableEntityException = exports.NotFoundException = exports.ForbiddenException = exports.UnauthorizedException = exports.BadRequestException = exports.ConflictException = void 0;
class ConflictException extends Error {
    constructor(message) {
        super(message);
        this.status = 409;
        this.name = 'ConflictException';
    }
}
exports.ConflictException = ConflictException;
class BadRequestException extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
        this.name = 'BadRequestException';
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends Error {
    constructor(message) {
        super(message);
        this.status = 401;
        this.name = 'UnauthorizedException';
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends Error {
    constructor(message) {
        super(message);
        this.status = 403;
        this.name = 'ForbiddenException';
    }
}
exports.ForbiddenException = ForbiddenException;
class NotFoundException extends Error {
    constructor(message) {
        super(message);
        this.status = 404;
        this.name = 'NotFoundException';
    }
}
exports.NotFoundException = NotFoundException;
class UnprocessableEntityException extends Error {
    constructor(message) {
        super(message);
        this.status = 422;
        this.name = 'UnprocessableEntityException';
    }
}
exports.UnprocessableEntityException = UnprocessableEntityException;
