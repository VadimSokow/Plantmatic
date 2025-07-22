import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions"
import {handleExtractUserEmail} from "../helper/auth";
import {getCosmosBundle} from "../helper/cosmos";
import {InvalidQueryParameterError} from "../error/invalidQuery";

interface PalntQueryParameters {
    page: number
    pageSize: number
}

export async function getPlants(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // let email = handleExtractUserEmail(request)
    let email = "u38079@hs-harz.de"
    if (typeof email !== 'string') {
        return email;
    }

    let queryParams: PalntQueryParameters

    try {
        queryParams = validatePlantQueryParameters(request)
    } catch (error) {
        if (error instanceof InvalidQueryParameterError) {
            const body = {
                error: error.name,
                message: error.message
            }
            return {
                status: 403,
                body: JSON.stringify(body)
            }
        }
        return {
            status: 500,
            body: "An internal server error occurred while processing parameters."
        }
    }
    const offset = queryParams.page * queryParams.pageSize;
    const plantQuery = {
        query: "SELECT c.id, c.userId, c.name, c.latName FROM c where c.userId = @owner OFFSET @offset LIMIT @limit",
        parameters: [
            {name: "@owner", value: email},
            {name: "@offset", value: offset},
            {name: "@limit", value: queryParams.pageSize}
        ]
    }

    try {
        const cosmos = getCosmosBundle()
        if (!cosmos) {
            return {status: 500, body: "Database not available"}
        }

        const iterator = cosmos.query("plants", plantQuery)
        const {resources: plants} = await iterator.fetchAll()
        if (!plants || plants.length === 0) {
            return {
                status: 200,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify([])
            }
        }

        // get all plantType ids
        const typeIds = plants.map(plant => plant.latName);
        // remove duplicates
        const uniqueTypeIds = Array.from(new Set(typeIds));

        // fetch models for unique type ids
        const plantTypes = [];
        for (let uniqueTypeId of uniqueTypeIds) {
            const typeQuery = {
                query: "SELECT c.latName, c.commonName, c.description, c.configFields FROM c where c.latName = @id",
                parameters: [{name: "@id", value: uniqueTypeId}],
            }
            const {resources: types} = await cosmos.query("plantType", typeQuery).fetchAll()
            if (types && types.length > 0) {
                plantTypes.push(types[0]);
            } else {
                console.warn(`Type with ID ${uniqueTypeId} not found.`);
            }
        }

        return {
            status: 200,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                plants: plants,
                types: plantTypes,
                pagination: {
                    page: queryParams.page,
                    pageSize: queryParams.pageSize,
                    isEnd: plants.length < queryParams.pageSize
                }
            })
        }
    } catch (error) {
        context.log("Error1 querying Cosmos DB:", error)
        return {
            status: 500,
            body: `Error: ${error.message}`
        }
    }

}

export function validatePlantQueryParameters(request: HttpRequest) {
    const rawParams = request.query;
    console.log("rawParams: ", rawParams);
    const errors: string[] = [];

    let page: number | undefined
    let pageSize: number | undefined

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

    page = parseNumberParam('page', rawParams.get('page'));
    pageSize = parseNumberParam('pageSize', rawParams.get('pageSize'));

    if (page !== undefined && page < 0) {
        errors.push("'page' cannot be negative.");
    }
    if (pageSize !== undefined && pageSize <= 0) {
        errors.push("'pageSize' must be a positive number.");
    }

    if (errors.length > 0) {
        throw new InvalidQueryParameterError(errors.join(' '));
    }

    return {
        page: page as number,
        pageSize: pageSize as number
    }

}

app.http('plants', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getPlants
})