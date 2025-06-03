import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions"
import {CosmosClient} from "@azure/cosmos"
import {getUser} from "./user";


const cosmosEndpoint = process.env.CosmosDBEndpoint;
const cosmosKey = process.env.CosmosDBKey;


export async function getDevices(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const cosmosConnection = process.env.CosmosDBConnection


    const header = request.headers.get("authorization")
    const email = getUser(header)
    console.log("E-mail: ", email)

    if (!email) {
        return {
            status: 401,
        }
    }


    if (!cosmosEndpoint || !cosmosKey) {
        context.error("CosmosDBEndpoint or CosmosDBKey was not set!")
        return {
            status: 500,
        }
    }


    try {
        const client = new CosmosClient({
            endpoint: cosmosEndpoint,
            key: cosmosKey,
        })
        const dbName = "Plantmatic"
        const deviceConName = "devices"
        const modelConName = "models"
        const database = client.database(dbName)
        const deviceContainer = database.container(deviceConName)
        const modelContainer = database.container(modelConName)

        const result = [];
        const deviceQuery = {
            query: "SELECT c.id, c.name, c.userId, c.location, c.modelId, c.plantSlots, c.config FROM c where c.userId = @owner",
            parameters: [{name: "@owner", value: email}
            ]
        }
        const {resources: devices} = await deviceContainer.items.query(deviceQuery).fetchAll()

        for (const deviceNr in devices) {
            const device = devices[deviceNr]
            const modelQuery = {
                query: "SELECT c.id, c.name, c.slotCount, c.sensors FROM c where c.modelId = @id",
                parameters: [
                    {name: "@id", value: device.modelId}
                ],
            }
            const {resources: models} = await modelContainer.items.query(modelQuery).fetchAll()

            const model = models[0]

            device.modelId = undefined
            device.model = model


            result.push(device);

        }

        return {
            status: 200,
            headers: {"Content-Type": "application/json"},
            //body: items
            body: JSON.stringify(result)
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
