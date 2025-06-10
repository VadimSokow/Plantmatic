import {Container, CosmosClient, JSONObject, OperationInput} from "@azure/cosmos";

export function cosmosHelper(
    connectionString: string,
    databaseName: string,
    containerName: string,
) {
    const client = new CosmosClient(connectionString);
    const database = client.database(databaseName);
    const container = database.container(containerName);

    // @ts-ignore
    const insert = async (documents: object[]) => {
        const operations: OperationInput[] = documents.map((doc) => ({
            operationType: "Create",
            resourceBody: doc as JSONObject
        }))

        return await container.items.bulk(operations)
    }

    const deleteAllItems = async (partKeys: string[], page: number): Promise<boolean> => {
        try {
            console.log("Starte das Löschen aller Items im Container...");

            const querySpec = {
                query: `SELECT * FROM c OFFSET ${page * 100} LIMIT 100`,
            };

            const { resources: itemsToDelete } = await container.items.query(querySpec).fetchAll();

            if (itemsToDelete.length === 0) {
                console.log("Keine Items zum Löschen gefunden.");
                return false;
            }

            const getPartKeys = (items: Record<string, any>): any => {
                if (partKeys.length == 0) { return null }
                if (partKeys.length == 1) {
                    const index = partKeys[0];
                    return items[index]
                }
                const keys = partKeys.map(key => items[key])
                return keys;
            }

            const operations: OperationInput[] = itemsToDelete.map(item => ({
                operationType: "Delete",
                id: item.id,
                // partitionKey: getPartKeys(item)
                partitionKey: getPartKeys(item)
            }));

            // slice die Operationen in kleinere Chunks, um die maximale Batch-Größe nicht zu überschreiten
            const chunkSize = 100; // Cosmos DB erlaubt bis zu 100 Operationen pro Batch
            const chunkedOperations: OperationInput[][] = [];
            for (let i = 0; i < operations.length; i += chunkSize) {
                chunkedOperations.push(operations.slice(i, i + chunkSize));
            }

            let deletedCount = 0;
            for (let chunkedOperation of chunkedOperations) {
                const result = await container.items.bulk(chunkedOperation);
                result.forEach(opResult => {
                    if (opResult.statusCode >= 200 && opResult.statusCode < 300) {
                        deletedCount++;
                    } else {
                        console.error(`Fehler beim Löschen eines Items: ${opResult.resourceBody?.id} - Status: ${opResult.statusCode} - Error: ${opResult.resourceBody?.message || 'Unbekannt'} (${partKeys.join(', ')})`);
                    }
                });
                // Warten Sie 1 Sekunde, um die Rate-Limits von Cosmos DB nicht zu überschreiten
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            console.log(`Erfolgreich ${deletedCount} von ${itemsToDelete.length} Items gelöscht.`);

        } catch (error: any) {
            console.error(`Fehler beim Löschen von Items: ${error.message} (${partKeys.join(', ')})`);
        }
        return true;
    }

    return {
        client,
        database,
        container,
        insert,
        deleteAllItems
    }
}

export async function replaceAllDataAt(conStr: string, dbName: string, container: string, partKeys: string[], data: object[]) {
    const cosmos = cosmosHelper(conStr, dbName, container);
    let counter = 0;
    while (await cosmos.deleteAllItems(partKeys, counter++)) {}
    return await cosmos.insert(data);
}
