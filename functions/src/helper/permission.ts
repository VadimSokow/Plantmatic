import {getCosmosBundle} from "./cosmos";

export enum PermissionState {
    NotFound, Permission, NoPermission
}

export async function hasReadPermForPlant(plantId: string, userId: string): Promise<PermissionState> {
    const cosmos = getCosmosBundle()
    if (!cosmos) {
        console.error("CosmosDB connection is not available.");
        throw new Error("CosmosDB connection is not available.");
    }

    const plantItem = await cosmos.db.container("plants").item(plantId, plantId).read();
    if (plantItem.statusCode === 404) {
        return PermissionState.NotFound;
    }
    const plant = plantItem.resource;
    if (!plant) {
        return PermissionState.NotFound;
    }
    if (plant.userId === userId) {
        return PermissionState.Permission;
    }
    return PermissionState.NoPermission;
}
