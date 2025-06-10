import {HttpRequest, HttpResponseInit} from "@azure/functions";
import {jwtDecode} from "jwt-decode";

export class AuthError extends Error {
    constructor(message: string, public readonly status: number) {
        super(message);
        this.name = "AuthError";
        Object.setPrototypeOf(this, AuthError.prototype);
    }

    toResponse(): HttpResponseInit {
        return {
            status: this.status,
            body: this.message,
        };
    }
}

export class ErrorMissingAuthHeader extends AuthError {
    constructor() {
        super("Missing or invalid Authorization header: Bearer <token>", 401);
        this.name = "ErrorMissingAuthHeader";
        Object.setPrototypeOf(this, ErrorMissingAuthHeader.prototype);
    }
}

export class ErrorJWTDecodeFailed extends AuthError {
    constructor() {
        super("Failed to decode JWT token", 401);
        this.name = "ErrorJWTDecodeFailed";
        Object.setPrototypeOf(this, ErrorJWTDecodeFailed.prototype);
    }
}

export class ErrorJWTExpired extends AuthError {
    constructor() {
        super("JWT token has expired", 401);
        this.name = "ErrorJWTExpired";
        Object.setPrototypeOf(this, ErrorJWTExpired.prototype);
    }
}

export function extractUserEmail(request: HttpRequest): string {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ErrorMissingAuthHeader()
    }

    const token = authHeader.substring(7)

    let decoded: Record<string, any> | null = null;
    try {
        decoded = jwtDecode(token)
    } catch (error) {
        console.error("Error decoding JWT token:", error);
        throw new ErrorJWTDecodeFailed();
    }
    // TODO: change preferred_username to something else (currently used by Azure AD)
    if (!decoded || typeof decoded.preferred_username !== 'string') {
        throw new ErrorJWTDecodeFailed()
    }
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        throw new ErrorJWTExpired()
    }
    return decoded.preferred_username
}

export function handleExtractUserEmail(request: HttpRequest): string | HttpResponseInit {
    let userMail = ""
    try {
        userMail = extractUserEmail(request)
    } catch (error) {
        if (error instanceof AuthError) {
            return error.toResponse()
        }
        return {
            status: 500,
        }
    }
    if (!userMail) {
        return {
            status: 401,
        }
    }
    return userMail
}
