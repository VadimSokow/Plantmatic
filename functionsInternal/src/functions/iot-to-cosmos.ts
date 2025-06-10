import {app, EventGridEvent, InvocationContext} from "@azure/functions";
import {CosmosClient} from "@azure/cosmos";

//---Cosmos DB Config---
const cosmosEndpoint = process.env.CosmosDBEndpoint;
const cosmosKey = process.env.CosmosDBKey;
const cosmosDatabase = process.env.CosmosDBDatabaseId;
const cosmosContainer = process.env.CosmosDBContainerId;

const cosmosClient = new CosmosClient({
    endpoint: cosmosEndpoint,
    key: cosmosKey,
});

export async function deviceTelemetry(event: EventGridEvent, context: InvocationContext): Promise<void> {
    // log event
    context.warn('Processing device telemetry event:', event);
    // // check if data is present
    if (!event.data) {
        context.log("No data in EventGridEvent!");
        return;
    }

    try {
        const db = cosmosClient.database(cosmosDatabase);
        const container = db.container(cosmosContainer);

        const data = event.data;
        const body: Record<string, any> = data.body;
        const deviceId = data.systemProperties['iothub-connection-device-id'];

        const dbEntry = {
            deviceId: deviceId,
            timestamp: event.eventTime,
            temperature: body.temperature,
            humidity: body.humidity,
        };

        const { resource: createdItem } = await container.items.create(dbEntry);
        context.log("Successfully wrote item into Cosmos DB:", createdItem?.id);
    } catch (error) {
        context.error("Error writing to Cosmos DB:", error);
    }
}

app.eventGrid('deviceTelemetry', {
    handler: deviceTelemetry,
});
