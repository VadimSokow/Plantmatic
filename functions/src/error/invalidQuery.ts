export class InvalidQueryParameterError extends Error {
    constructor(message: string = 'One or more query parameters are invalid or missing.', parameterName?: string) {
        super(message);
        this.name = 'InvalidQueryParameterError';
        if (parameterName) {
            this.message = `Invalid or missing query parameter: '${parameterName}'. ${message}`;
        }
        Object.setPrototypeOf(this, InvalidQueryParameterError.prototype);
    }
}