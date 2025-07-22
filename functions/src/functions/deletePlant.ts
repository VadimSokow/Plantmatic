import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {handleExtractUserEmail} from "../helper/auth";
import {getCosmosBundle} from "../helper/cosmos";
import {hasReadPermForPlant, PermissionState} from "../helper/permission";

/**
 * Deletes a plant by its ID.
 * The id is defined in the URL path as a parameter: '/plants/{id}'
 */
export async function deletePlant(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let email = handleExtractUserEmail(request)
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
        if (rmResult.statusCode === 204) {
            context.log(`Plant ${plantId} deleted successfully by user ${email}`);
            return {
                status: 200,
                body: "Plant deleted successfully"
            };
        } else if (rmResult.statusCode === 404) {
            context.warn(`Plant ${plantId} not found for user ${email}`);
            return {
                status: 404,
                body: "Plant not found"
            };
        } else {
            context.error(`Failed to delete plant ${plantId} for user ${email}:`, rmResult);
            return {
                status: rmResult.statusCode,
                body: "Failed to delete plant"
            };
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
