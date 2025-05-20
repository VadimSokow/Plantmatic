import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos"

const cosmosEndpoint = process.env.CosmosDBEndpoint;
const cosmosKey = process.env.CosmosDBKey;

export async function getPlants(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const cosmosConnection = process.env.CosmosDBConnection

    if (!cosmosEndpoint || !cosmosKey) {
        context.error("CosmosDBEndpoint oder CosmosDBKey nicht gestzt")
        return {
            status: 500, //vielleicht was besseres finden?
            body: "Interner Fehler"
        }
    }


    try {
        const client = new CosmosClient({
            endpoint: cosmosEndpoint,
            key: cosmosKey,
        })
        const dbName = "Plantmatic"
        const conName = "plants"
        const database = client.database(dbName)      
        const container = database.container(conName)         

        const query = "SELECT * FROM c"
        const { resources: items } = await container.items.query(query).fetchAll()

        return {
            status: 200,
            headers: { "Content-Type": "application/json" },
            //body: items
            body: JSON.stringify(items)
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