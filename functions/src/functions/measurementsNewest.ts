import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {handleExtractUserEmail} from "../helper/auth";
import {InvalidQueryParameterError} from "../error/invalidQuery";
import {getCosmosBundle} from "../helper/cosmos";
import {hasReadPermForPlant} from "../helper/permission";

app.http('measurementsNewestForPlant', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'measurements/newest',
    handler: newestMeasurementsForPlant,
})

interface MeasurementsNewestQueryParameters {
    plantId: string,
    fieldNames: Array<string>,
}

async function newestMeasurementsForPlant(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let userMail = handleExtractUserEmail(request)
    if (typeof userMail !== 'string') {
        return userMail;
    }

    // extract query parameters
    let queryParams: MeasurementsNewestQueryParameters;
    try {
        queryParams = parseQuery(request);
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

    const cosmos = getCosmosBundle()
    if (!cosmos) {
        context.error("Failed to connect to CosmosDB");
        return {
            status: 500,
        }
    }

    if (!await hasReadPermForPlant(queryParams.plantId, userMail)) {
        context.warn(`User ${userMail} does not have permission to access plant ${queryParams.plantId}`);
        return {
            status: 403,
            body: JSON.stringify({
                error: "Forbidden",
                message: "You do not have permission to access this plant."
            }),
        };
    } else {
        context.log(`User ${userMail} has permission to access plant ${queryParams.plantId}`);
    }

    const lastMeasurements: Record<string, Record<string, any>> = queryParams.fieldNames.reduce((acc, field) => {
        acc[field] = null;
        return acc;
    }, {})

    for (const field of queryParams.fieldNames) {
        const query = {
            query: `SELECT TOP 1 c.deviceId, c.plantId, c.fieldName, c.timestamp, c["value"] 
                    FROM c 
                    WHERE c.plantId = @plantId AND c.fieldName = @fieldName 
                    ORDER BY c.timestamp DESC`,
            parameters: [
                {name: "@plantId", value: queryParams.plantId},
                {name: "@fieldName", value: field},
            ]
        };

        try {
            const {resources: measurements} = await cosmos.query("measurements", query).fetchAll();
            if (measurements.length > 0) {
                lastMeasurements[field] = measurements[0];
            }
        } catch (error) {
            context.error(`Error fetching measurements for field ${field}:`, error);
            return {
                status: 500,
                body: `Error fetching measurements for field ${field}: ${error.message}`,
            };
        }
    }

    return {
        status: 200,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(lastMeasurements),
    }
}

function parseQuery(request: HttpRequest): MeasurementsNewestQueryParameters {
    const errors: string[] = [];

    const plantId = request.query.get('plantId');
    const fieldName = request.query.getAll('fieldName');

    if (typeof plantId !== 'string' || plantId.trim() === '') {
        errors.push("Query parameter 'plantId' is required and must be a non-empty string.");
    }

    if (fieldName.length === 0) {
        errors.push("Query parameter 'fieldName' is required and must contain at least one field.");
    }

    if (errors.length > 0) {
        throw new InvalidQueryParameterError(`Invalid query parameters: ${errors.join(' ')}`);
    }

    return {
        plantId,
        fieldNames: fieldName,
    };
}
