import {
    CosmosClient,
    Database,
    FeedOptions,
    ItemResponse,
    PartitionKey,
    QueryIterator,
    SqlQuerySpec
} from "@azure/cosmos";

export interface CosmosBundle {
    client: CosmosClient
    db: Database
    query: (container: string, query: string | SqlQuerySpec, options?: FeedOptions) => QueryIterator<any>
    remove: (container: string, id: string, partitionKey: PartitionKey) => Promise<ItemResponse<any>>
}

let cosmosInstance: CosmosBundle | null = null

function connectToCosmos(
    endpoint: string,
    key: string,
    dbName: string,
): CosmosBundle {
    const client = new CosmosClient({
        endpoint,
        key,
    })
    const db = client.database(dbName)

    const query = (container: string, query: string | SqlQuerySpec, options?: FeedOptions) => {
        return db.container(container).items.query(query, options)
    }

    const remove = (container: string, id: string, partitionKey: PartitionKey) => {
        return db.container(container).item(id, partitionKey).delete();
    }

    return {
        client,
        db,
        query,
        remove
    } as CosmosBundle
}

/**
 * Get a singleton instance of the CosmosBundle.
 * If the instance does not exist, it will be created using the environment variables for endpoint and key.
 * @return {CosmosBundle} The CosmosBundle instance.
 * @throws {Error} If the environment variables for CosmosDBEndpoint or CosmosDBKey are not set.
 */
export function getCosmosBundle(): CosmosBundle | null {
    if (!cosmosInstance) {
        const cosmosEndpoint = process.env.CosmosDBEndpoint
        const cosmosKey = process.env.CosmosDBKey
        const dbName = 'Plantmatic'

        if (!cosmosEndpoint || !cosmosKey) {
            throw new Error("CosmosDBEndpoint or CosmosDBKey is not set in environment variables.")
        }

        try {
            cosmosInstance = connectToCosmos(cosmosEndpoint, cosmosKey, dbName)
        } catch (error) {
            console.error("Failed to connect to CosmosDB:", error)
            return null
        }
    }
    return cosmosInstance
}
