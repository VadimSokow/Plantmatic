import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions"
import {handleExtractUserEmail} from "../helper/auth";
import {getCosmosBundle} from "../helper/cosmos";


interface DeviceQueryParameters {
    id: string
    name: string
    userId: string
    location: string
    modelId: string
    plantSlots: {}
    config: {}
    page: number
    pageSize: number
}


class InvalidQueryParameterError extends Error {
    constructor(message: string = 'One or more query parameters are invalid or missing.', parameterName?: string) {
        super(message);
        this.name = 'InvalidQueryParameterError';
        if (parameterName) {
            this.message = `Invalid or missing query parameter: '${parameterName}'. ${message}`;
        }
        Object.setPrototypeOf(this, InvalidQueryParameterError.prototype);
    }
}

export async function getDevices(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // resolve user
    let email = handleExtractUserEmail(request)
    if (typeof email !== 'string') {
        return email;
    }

    let queryParams: DeviceQueryParameters

    try {
        queryParams = validateDeviceQueryParameters(request)
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
    const deviceQuery = {
        query: "SELECT c.id, c.name, c.userId, c.location, c.modelId, c.plantSlots, c.config FROM c where c.userId = @owner OFFSET @offset LIMIT @limit",
        parameters: [
            {name: "@owner", value: email},
            {name: "@offset", value: offset},
            {name: "@limt", value: queryParams.pageSize}
        ]
    }
    try {
        const cosmos = getCosmosBundle()
        if (!cosmos) {
            return {status: 500, body: "Database not available"}
        }

        const {resources: devices} = await cosmos.query("devices", deviceQuery).fetchAll()
        if (!devices || devices.length === 0) {
            return {
                status: 200,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify([])
            }
        }

        // get all model ids
        const modelIds = devices.map(device => device.modelId);
        // remove duplicates
        const uniqueModelIds = Array.from(new Set(modelIds));

        // fetch models for unique model ids
        const deviceModels = [];
        for (let uniqueModelId of uniqueModelIds) {
            const modelQuery = {
                query: "SELECT c.id, c.name, c.slotCount, c.sensors FROM c where c.id = @id",
                parameters: [{name: "@id", value: uniqueModelId}],
            }
            const {resources: models} = await cosmos.query("models", modelQuery).fetchAll()
            if (models && models.length > 0) {
                deviceModels.push(models[0]);
            } else {
                console.warn(`Model with ID ${uniqueModelId} not found.`);
            }
        }

        return {
            status: 200,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                devices: devices,
                models: deviceModels,
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

export function validateDeviceQueryParameters(request: HttpRequest) {
    const rawParams = request.query;
    console.log("rawParams: ", rawParams);
    const errors: string[] = [];

    let id: string | undefined = rawParams.get('id')
    let name: string | undefined = rawParams.get('name')
    let userId: string | undefined = rawParams.get("userId")
    let location: string | undefined = rawParams.get("location")
    let modelId: string | undefined = rawParams.get("modelId")
    let plantSlots: {} | undefined = rawParams.get("plantSlots")
    let config: {} | undefined = rawParams.get("config")
    let page: number | undefined
    let pageSize: number | undefined


    const checkStringParam = (paramName: string, value: string) => {
        if (typeof value != 'string' || value.trim() === '') {
            errors.push("Query paramater " + paramName + " is required and must be a non-empyt string")
        }
    }

    checkStringParam('id', id)
    checkStringParam('userId', userId)
    checkStringParam('location', location)
    checkStringParam('modelId', modelId)


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

    if (errors.length > 0) {
        throw new InvalidQueryParameterError(errors.join(' '));
    }

    return {
        id: id as string,
        name: name as string,
        userId: userId as string,
        location: location as string,
        modelId: modelId as string,
        plantSlots: JSON.stringify(plantSlots),
        config: JSON.stringify(config),
        page: page as number,
        pageSize: pageSize as number
    }

}


app.http('devices', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getDevices
})
