import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos"

const cosmosEndpoint = process.env.CosmosDBEndpoint;
const cosmosKey = process.env.CosmosDBKey;

export async function getPlants(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const cosmosConnection = process.env.CosmosDBConnection





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
        const testOwner = "u37952@hs-harz.de"
        /*
                const query = {
                    query : "SELECT * FROM c where c.owner = @owner",
                    parameters: [
                        {name : "owner", value: testOwner }
                    ]
                }



         */
        const result = [];
        const  plantQuery = "SELECT * FROM c where c.userid = 'u37952@hs-harz.de'"
        const { resources: plants } = await plantContainer.items.query(plantQuery).fetchAll()

        for (const plantNr in plants){
            const plant = plants[plantNr]
            console.log("DeviceModelID: ", plant.plantypeid)
            const modelQuery = {
                query : "SELECT * FROM c where c.latname = @id",
                parameters : [
                    {name: "@id", value: plant.plantypeid}
                ],
            }
            const {resources: models} = await plantTypeContainer.items.query(modelQuery).fetchAll()

            const model = models[0]



            result.push(
                {
                    plant,
                    model
                }
            );

        }

        return {
            status: 200,
            headers: { "Content-Type": "application/json" },
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