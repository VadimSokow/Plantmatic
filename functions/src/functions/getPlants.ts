import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions"
import {CosmosClient} from "@azure/cosmos"
import {getUser} from "./user";

const cosmosEndpoint = process.env.CosmosDBEndpoint;
const cosmosKey = process.env.CosmosDBKey;

export async function getPlants(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const cosmosConnection = process.env.CosmosDBConnection

    const header = request.headers.get("authorization")
    const email = getUser(header)
    console.log("E-mail: ", email)

    if (!email) {
        return {
            status: 401,
        }
    }


    try {
        const client = new CosmosClient({
            endpoint: cosmosEndpoint,
            key: cosmosKey,
        })
        const dbName = "Plantmatic"
        const plantConName = "plants"
        const plantTypeConName = "plantType"
        const database = client.database(dbName)
        const plantContainer = database.container(plantConName)
        const plantTypeContainer = database.container(plantTypeConName)


        const result = [];
        const plantQuery = {
            query: "SELECT c.id, c.plantId, c.userId, c.deviceId, c.name, c.latName, c.currentSensorData FROM c where c.userId = @owner",
            parameters: [
                {name: "@owner", value: email}
            ]
        }
        const {resources: plants} = await plantContainer.items.query(plantQuery).fetchAll()

        for (const plantNr in plants) {
            const plant = plants[plantNr]
            console.log("DeviceModelID: ", plant.plantTypeId)
            const plantTypeQuery = {
                query: "SELECT c.comName, c.description, c.configFields FROM c where c.latName = @id",
                parameters: [
                    {name: "@id", value: plant.latName}
                ],
            }
            const {resources: types} = await plantTypeContainer.items.query(plantTypeQuery).fetchAll()

            const type = types[0]


            plant.plantTypeId = undefined
            plant.type = type


            result.push(plant);

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

app.http('plants', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getPlants
})