
export class CustomError extends Error {
    private reason: any;
    private statusCode: number;

    constructor(reason: any, statusCode: number) {
        super(reason);
        this.reason = reason;
        this.statusCode = statusCode;
    }

    public getReason(): any {
        return this.reason;
    }

    public getStatusCode(): number {
        return this.statusCode;
    }
}

export class InvalidParameterError extends CustomError {
    private extra: any;

    constructor(reason: any, extra: any) {
        super(reason.toString().split(','), 422);
        this.extra = extra;
    }

    public getExtra(): any {
        return this.extra;
    }
}

export class UnauthorizedError extends CustomError {

    constructor(reason: String) {
        super(reason, 401);
    }
}

export class InvalidTokenError extends CustomError {

    constructor() {
        super('User token is invalid', 401);
    }
}

export class ForbidenError extends CustomError {

    constructor(reason: String) {
        super(reason, 403);
    }
}

export class UsernameDuplicatedError extends CustomError {

    constructor(reason: String) {
        super(reason, 422);
    }
}

export class InvalidUsernameError extends CustomError {

    constructor(reason: String) {
        super(reason, 400);
    }
}

export class InvalidPasswordError extends CustomError {

    constructor(reason: String) {
        super(reason, 400);
    }
}

export class UserNotCreatedError extends CustomError {

    constructor(reason: String) {
        super(reason, 400);
    }
}