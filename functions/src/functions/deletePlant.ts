import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {handleExtractUserEmail} from "../helper/auth";
import {getCosmosBundle} from "../helper/cosmos";
import {hasReadPermForPlant, PermissionState} from "../helper/permission";
import {PatchOperation, PatchOperationType} from "@azure/cosmos";

/**
 * Deletes a plant by its ID.
 * The id is defined in the URL path as a parameter: '/plants/{id}'
 */
export async function deletePlant(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // let email = handleExtractUserEmail(request)
    const email = "u38079@hs-harz.de"
    if (typeof email !== 'string') {
        return email;
    }

    const plantId = request.params.id;
    if (!plantId) {
        return {
            status: 400,
            body: "Missing or invalid 'id' query parameter"
        };
    }

    try {
        const cosmos = getCosmosBundle()
        if (!cosmos) {
            return {status: 500, body: "Database not available"}
        }

        const hasPermission = await hasReadPermForPlant(plantId, email)
        switch (hasPermission) {
            case PermissionState.NotFound:
                return { status: 404 }
            case PermissionState.NoPermission:
                context.warn(`User ${email} does not have permission to delete plant ${plantId}`);
                return {
                    status: 403,
                    body: "Forbidden: You do not have permission to delete this plant."
                };
            case PermissionState.Permission:
                break;
        }

        const rmResult = await cosmos.remove('plants', plantId, plantId)
        if (rmResult.statusCode === 404) {
            context.warn(`Plant ${plantId} not found for user ${email}`);
            return {
                status: 404,
                body: "Plant not found"
            };
        } else if (rmResult.statusCode < 200 || rmResult.statusCode >= 300) {
            context.error(`Failed to delete plant ${plantId} for user ${email}:`, rmResult);
            return {
                status: rmResult.statusCode,
                body: "Failed to delete plant"
            };
        }

        // update the plant list for the device
        // fetch device
        const deviceQuery = {
            query: "SELECT * FROM c WHERE ARRAY_CONTAINS(c.plantSlots, { \"plantId\": @plantId }, true)",
            parameters: [{ name: "@plantId", value: plantId }]
        }
        const { resources: devices } = await cosmos.query('devices', deviceQuery).fetchAll()
        if (!devices || devices.length === 0) {
            context.warn(`No device found with plant ${plantId} for user ${email}`);
            return {
                status: 404,
                body: "Device not found"
            };
        }
        const device = devices[0];
        const plantDeviceIndex = device.plantSlots.findIndex(slot => slot.plantId === plantId);
        // patch the slot
        const patchResult = await cosmos.patch('devices', device.id, device.id, [
            { op: 'replace', path: `/plantSlots/${plantDeviceIndex}/plantId`, value: null },
        ])
        if (patchResult.statusCode < 200 || patchResult.statusCode >= 300) {
            context.error(`Failed to update device ${device.id} for user ${email}:`, patchResult);
            return {
                status: patchResult.statusCode,
                body: "Failed to update device"
            };
        }
        context.log(`Plant ${plantId} deleted successfully for user ${email}`);
        return {
            status: 204, // No Content
            body: "Plant deleted successfully"
        }
    } catch (error) {
        context.log("Fehler beim Zugriff auf DB: ", error)
        return {
            status: 500
        }
    }
}

app.http('plantDelete', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'plant/{id}',
    handler: deletePlant,
})
