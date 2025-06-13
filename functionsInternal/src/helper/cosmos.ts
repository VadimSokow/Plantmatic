import {
    CosmosClient,
    Database,
    FeedOptions,
    ItemResponse,
    QueryIterator,
    RequestOptions,
    SqlQuerySpec
} from "@azure/cosmos";

export type InsertResponse<T> = Array<ItemResponse<Array<T>>>

export interface CosmosBundle {
    client: CosmosClient
    db: Database
    query: (container: string, query: string | SqlQuerySpec, options?: FeedOptions) => QueryIterator<any>
    insert: <T>(container: string, items: Array<T>, options?: RequestOptions) => Promise<InsertResponse<T>>
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

    const insert = async <T>(container: string, items: Array<T>, options?: RequestOptions): Promise<InsertResponse<T>>  => {
        // split items into batches of 100
        const batchSize = 100;
        const batches: Array<Array<T>> = [];
        for (let i = 0; i < items.length; i += batchSize) {
            batches.push(items.slice(i, i + batchSize));
        }

        // insert each batch
        const responses: Array<ItemResponse<Array<T>>> = [];
        for (const batch of batches) {
            const response = await db.container(container).items.create(batch, options);
            responses.push(response);
        }

        return responses
    }

    return {
        client,
        db,
        query,
        insert,
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
