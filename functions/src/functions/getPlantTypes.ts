import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {PagingParameters} from "../types/paging";
import {extractPagingParameters} from "../helper/parameter";
import {InvalidQueryParameterError} from "../error/invalidQuery";
import {getCosmosBundle} from "../helper/cosmos";

export async function getPlantTypesForSearch(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // extract and validate query parameters
    let params: PagingParameters;
    try {
        params = extractPagingParameters(request);
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

    // prepare query for CosmosDB
    const offset = params.page * params.pageSize;
    const plantTypesQuery = {
        query: "SELECT c.latName, c.commonName FROM c OFFSET @offset LIMIT @limit",
        parameters: [
            {name: "@offset", value: offset},
            {name: "@limit", value: params.pageSize}
        ]
    };
    // execute query against CosmosDB
    try {
        const cosmos = getCosmosBundle()
        if (!cosmos) {
            return {status: 500, body: "Database not available"}
        }

        const iterator = cosmos.query("plantType", plantTypesQuery)
        const {resources: plantTypes} = await iterator.fetchAll()
        if (!plantTypes || plantTypes.length === 0) {
            return {
                status: 200,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify([])
            }
        }
        return {
            status: 200,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                plantTypes: plantTypes,
                pagination: {
                    page: params.page,
                    pageSize: params.pageSize,
                    isEnd: plantTypes.length < params.pageSize
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

app.http('getPlantTypesForSearch', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'plantTypes/searchData',
    handler: getPlantTypesForSearch
})
