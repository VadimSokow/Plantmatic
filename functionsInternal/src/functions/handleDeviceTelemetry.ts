import {app, EventGridEvent, InvocationContext} from "@azure/functions";
import {CosmosClient} from "@azure/cosmos";
import {getCosmosBundle} from "../helper/cosmos";

type DBMeasurement = {
    plantId: string
    fieldName: string
    timestamp: number
    value: number
}

type TelemetryMessage = Record<string, any>

export async function handleDeviceTelemetry(
    event: EventGridEvent,
    context: InvocationContext,
): Promise<void> {
    context.log("Received telemetry event:", event);

    const eventData: Record<string, any> = event.data;
    const deviceId = eventData.systemProperties["iothub-connection-device-id"];

    // extract eventData.body or decode if it is a base64 string
    let body: Record<string, any> | null = null
    if (typeof eventData.body === 'string') {
        try {
            body = JSON.parse(Buffer.from(eventData.body, 'base64').toString('utf-8'));
        } catch (error) {
            context.error("Failed to decode base64 body:", error);
            return;
        }
    } else if (typeof eventData.body === 'object') {
        body = eventData.body;
    }
    if (!body) {
        context.error(`No body found in the event data. Type of eventData.body: ${typeof eventData.body} | Value: ${eventData.body}`);
        return;
    }

    // Extract the telemetry data from the event
    if (!body) {
        context.error("Invalid telemetry data received:", body);
        return;
    }

    const entries = Object.entries(body);
    if (entries.length === 0) {
        context.warn("No telemetry data found in the event.");
        return;
    }

    const cosmos = getCosmosBundle()
    if (!cosmos) {
        context.error("Failed to connect to CosmosDB");
        return;
    }

    for (let entry of entries) {
        const plantId = entry[0];
        const sensorData = entry[1];
        const data = sensorDataToObjects(deviceId, plantId, sensorData)
        if (data.length === 0) {
            context.warn(`No valid sensor data found for plant ${plantId}.`);
            continue;
        }

        try {
            const result = await cosmos.insert('measurements', data);
            context.log(`Inserted ${result.length} measurements for plant ${plantId}.`);
        } catch (error) {
            context.error(`Failed to insert measurements for plant ${plantId}:`, error);
        }
    }
}

function sensorDataToObjects(deviceId: string, plantId: string, sensorData: TelemetryMessage): DBMeasurement[] {
    return Object.entries(sensorData).map(([key, value]) => {
        // convert the value to a number, else error
        if (typeof value !== 'number') {
            throw new Error(`Invalid value for field '${key}': ${value}. Expected a number.`);
        }
        const valueNumber = Number(value)
        return {
            deviceId: deviceId,
            plantId: plantId,
            fieldName: key,
            timestamp: Date.now(),
            value: valueNumber,
        }
    })
}

app.eventGrid("handleDeviceTelemetry", {
    handler: handleDeviceTelemetry,
});
