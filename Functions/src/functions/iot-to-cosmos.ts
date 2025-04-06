import {app, EventGridEvent, InvocationContext} from "@azure/functions";

export async function deviceTelemetry(event: EventGridEvent, context: InvocationContext): Promise<void> {
    context.log('Processing device telemetry event:', event);
}

app.eventGrid('deviceTelemetry', {
    handler: deviceTelemetry,
});
