import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos"

export async function getPlants(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const cosmosConnection = process.env.CosmosDBConnection

    if (!cosmosConnection) {
        return {
            status: 500,
            body: "Missing CosmosDBConnection string in environment variables."
        }
    }


    

    try {
        const client = new CosmosClient(cosmosConnection)
        const dbName = "Plantmatic12"
        const conName = "Plants"
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

app.http('getPlants', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getPlants
})