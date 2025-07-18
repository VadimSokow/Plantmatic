import {HttpRequest} from "@azure/functions";
import {PagingParameters} from "../types/paging";
import {InvalidQueryParameterError} from "../error/invalidQuery";

export function extractPagingParameters(request: HttpRequest): PagingParameters {
    const query = request.query;
    const errors: string[] = [];

    let page = parseNumberParam('page', query.get('page'), errors, true);
    let pageSize = parseNumberParam('pageSize', query.get('pageSize'), errors, true);

    if (page !== undefined && page < 0) {
        errors.push("'page' cannot be negative.");
    }
    if (pageSize !== undefined && pageSize <= 0) {
        errors.push("'pageSize' must be a positive number.");
    }

    if (errors.length > 0) {
        throw new InvalidQueryParameterError(errors.join(' '));
    }

    return {page, pageSize};
}

function parseNumberParam(
    paramName: string,
    value: string | undefined,
    errors: Array<string>,
    required: boolean = true,
    radix: number = 10
): number | undefined {
    if (value === undefined || value.trim() === '') {
        if (required) {
            errors.push(`Query parameter '${paramName}' is required.`);
            return undefined;
        }
        return undefined;
    }
    const parsed = parseInt(value, radix);
    if (isNaN(parsed)) {
        errors.push(`Query parameter '${paramName}' must be a valid number.`);
        return undefined;
    }
    return parsed;
}
