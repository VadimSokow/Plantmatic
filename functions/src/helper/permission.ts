import {getCosmosBundle} from "./cosmos";

export async function hasReadPermForPlant(plantId: string, userId: string): Promise<boolean> {
    const cosmos = getCosmosBundle()
    if (!cosmos) {
        console.error("CosmosDB connection is not available.");
        return false;
    }

    // query the plant with id and check if userId matches
    const query = {
        query: 'SELECT c.id FROM c WHERE c.id = @id AND c.userId = @userId',
        parameters: [
            { name: "@id", value: plantId },
            { name: "@userId", value: userId }
        ]
    };
    const iterator = cosmos.query("plants", query);
    const { resources } = await iterator.fetchAll();
    return resources.length > 0;
}
