import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {handleExtractUserEmail} from "../helper/auth";
import {getCosmosBundle} from "../helper/cosmos";
import {hasReadPermForPlant, PermissionState} from "../helper/permission";
import {InvalidQueryParameterError} from "../error/invalidQuery";

app.http('measurementsHistory', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'measurements',
    handler: measurements,
})

interface MeasurementHistoryQueryParameters {
    plantId: string
    fieldName: string
    startTime: number
    endTime: number
    page: number
    pageSize: number
}

async function measurements(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // resolve user
    let email = handleExtractUserEmail(request)
    if (typeof email !== 'string') {
        return email;
    }

    // extract query parameters
    let queryParams: MeasurementHistoryQueryParameters;
    try {
        queryParams = validateMeasurementQueryParams(request);
        context.log("Validierte Query-Parameter:", queryParams);
    } catch (error) {
        if (error instanceof InvalidQueryParameterError) {
            context.warn(`Bad Request: ${error.message}`);
            const body = {
                error: error.name,
                message: error.message,
                code: 400,
            }
            return {
                status: 400,
                body: JSON.stringify(body),
            }
        }
        context.error("Unexpected error during query parameter validation:", error);
        return {
            status: 500,
            body: "An internal server error occurred while processing parameters."
        };
    }

    // connect to CosmosDB
    const cosmos = getCosmosBundle()
    if (!cosmos) {
        context.error("Failed to connect to CosmosDB");
        return {
            status: 500,
        }
    }

    // check if user is allowed to access the plant
    switch (await hasReadPermForPlant(queryParams.plantId, email)) {
        case PermissionState.NotFound:
            context.warn(`Plant ${queryParams.plantId} not found for user ${email}`);
            return {
                status: 404,
                body: JSON.stringify({
                    error: "Not Found",
                    message: `Plant with ID ${queryParams.plantId} not found.`
                }),
            };
        case PermissionState.NoPermission:
            context.warn(`User ${email} does not have permission to access plant ${queryParams.plantId}`);
            return {
                status: 403,
                body: JSON.stringify({
                    error: "Forbidden",
                    message: "You do not have permission to access this plant."
                }),
            };
        default:
            context.log(`User ${email} has permission to access plant ${queryParams.plantId}`);
    }

    const offset = queryParams.page * queryParams.pageSize;

    const query = {
        query: `SELECT c.deviceId, c.plantId, c.fieldName, c.timestamp, c["value"]
                FROM c 
                WHERE c.plantId = @plantId AND c.fieldName = @fieldName
                    AND c.timestamp >= @startTime AND c.timestamp <= @endTime
                    ORDER BY c.timestamp ASC
                    OFFSET @offset LIMIT @limit`,
        parameters: [
            { name: "@plantId", value: queryParams.plantId },
            { name: "@fieldName", value: queryParams.fieldName },
            { name: "@startTime", value: queryParams.startTime },
            { name: "@endTime", value: queryParams.endTime },
            { name: "@offset", value: offset },
            { name: "@limit", value: queryParams.pageSize },
        ]
    };
    const iterator = cosmos.query("measurements", query);
    const { resources } = await iterator.fetchAll();
    context.log("Data fetched successfully:", resources.length, "measurements found.");
    return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            measurements: resources,
            pagination: {
                page: queryParams.page,
                pageSize: queryParams.pageSize,
                isEnd: resources.length < queryParams.pageSize,
            },
        })
    }
}

/**
 * Validiert und konvertiert Query-Parameter aus einem HttpRequest-Objekt.
 *
 * @param request Das HttpRequest-Objekt von Azure Functions.
 * @returns Ein Objekt vom Typ MeasurementQueryParameters, wenn die Validierung erfolgreich ist.
 * @throws {InvalidQueryParameterError} Wenn ein Parameter fehlt, das falsche Format hat oder ungültig ist.
 */
export function validateMeasurementQueryParams(request: HttpRequest): MeasurementHistoryQueryParameters {
    const rawParams = request.query;
    console.log("rawParams: ", rawParams);
    const errors: string[] = [];

    // Lokale Variablen, die undefined sein KÖNNTEN, aber später geprüft werden
    let plantId: string | undefined = rawParams.get('plantId');
    let fieldName: string | undefined = rawParams.get('fieldName');
    let startTime: number | undefined;
    let endTime: number | undefined;
    let page: number | undefined;
    let pageSize: number | undefined;

    if (typeof plantId !== 'string' || plantId.trim() === '') {
        errors.push("Query parameter 'plantId' is required and must be a non-empty string.");
    }

    if (typeof fieldName !== 'string' || fieldName.trim() === '') {
        errors.push("Query parameter 'fieldName' is required and must be a non-empty string.");
    }

    const parseNumberParam = (paramName: string, value: string | undefined, required: boolean = true): number | undefined => {
        if (value === undefined || value.trim() === '') {
            if (required) {
                errors.push(`Query parameter '${paramName}' is required.`);
                return undefined;
            }
            return undefined;
        }
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) {
            errors.push(`Query parameter '${paramName}' must be a valid number.`);
            return undefined;
        }
        return parsed;
    };

    startTime = parseNumberParam('startTime', rawParams.get('startTime'));
    endTime = parseNumberParam('endTime', rawParams.get('endTime'));
    page = parseNumberParam('page', rawParams.get('page'));
    pageSize = parseNumberParam('pageSize', rawParams.get('pageSize'));

    // Zusätzliche Validierungen für numerische Parameter
    // Diese Prüfungen können nur durchgeführt werden, wenn die Werte nicht undefined sind.
    // Deshalb ist es wichtig, sie erst nach der Initialisierung von startTime/endTime zu machen.
    if (startTime !== undefined && endTime !== undefined) {
        if (startTime >= endTime) {
            errors.push("'startTime' must be less than 'endTime'.");
        }
    }
    if (page !== undefined && page < 0) {
        errors.push("'page' cannot be negative.");
    }
    if (pageSize !== undefined && pageSize <= 0) {
        errors.push("'pageSize' must be a positive number.");
    }

    // --- Kritischer Block: Wirf den Fehler, wenn Probleme gefunden wurden ---
    if (errors.length > 0) {
        throw new InvalidQueryParameterError(errors.join(' '));
    }

    // --- Wenn wir diesen Punkt erreichen, wissen wir, dass alle erforderlichen Felder gültig sind ---
    // Hier ist es sicher, die Werte zu verwenden und zu type-asserten,
    // da der 'throw'-Block darüber sicherstellt, dass sie nicht undefined sein können.
    return {
        plantId: plantId as string,      // Type-Asserts sind hier "sicher", da der Fehler geworfen wurde
        fieldName: fieldName as string,  // wenn sie undefined wären.
        startTime: startTime as number,
        endTime: endTime as number,
        page: page as number,
        pageSize: pageSize as number,
    };
}