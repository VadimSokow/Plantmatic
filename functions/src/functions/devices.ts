import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions"
import {handleExtractUserEmail} from "../helper/auth";
import {getCosmosBundle} from "../helper/cosmos";

export async function getDevices(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // resolve user
    let email = handleExtractUserEmail(request)
    if (typeof email !== 'string') {
        return email;
    }

    const deviceQuery = {
        query: "SELECT c.id, c.name, c.userId, c.location, c.modelId, c.plantSlots, c.config FROM c where c.userId = @owner",
        parameters: [{name: "@owner", value: email}]
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


app.http('devices', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getDevices
})
