import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions"
import {CosmosClient} from "@azure/cosmos"
import {getUser} from "./user";
import {handleExtractUserEmail} from "../helper/auth";
import {getCosmosBundle} from "../helper/cosmos";

const cosmosEndpoint = process.env.CosmosDBEndpoint;
const cosmosKey = process.env.CosmosDBKey;

export async function getPlants(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    let email = handleExtractUserEmail(request)
    if (typeof email !== 'string') {
        return email;
    }
    const plantQuery = {
        query: "SELECT c.id, c.plantId, c.userId, c.deviceId, c.name, c.latName, c.currentSensorData FROM c where c.userId = @owner",
        parameters: [
            {name: "@owner", value: email}
        ]
    }

    try {
        const cosmos = getCosmosBundle()
        if (!cosmos) {
            return {status: 500, body: "Database not available"}
        }

        const {resources: plants} = await cosmos.query("plants", plantQuery).fetchAll()
        if (!plants || plants.length === 0) {
            return {
                status: 200,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify([])
            }
        }

        // get all model ids
        const typeIds = plants.map(plant => plant.latName);
        // remove duplicates
        const uniqueTypeIds = Array.from(new Set(typeIds));

        // fetch models for unique model ids
        const plantTypes = [];
        for (let uniqueTypeId of uniqueTypeIds) {
            const modelQuery = {
                query: "SELECT c.latName, c.comName, c.description, c.configFields FROM c where c.latName = @id",
                parameters: [{name: "@id", value: uniqueTypeId}],
            }
            const {resources: types} = await cosmos.query("models", modelQuery).fetchAll()
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

app.http('plants', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getPlants
})