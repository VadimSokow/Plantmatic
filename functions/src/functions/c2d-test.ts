import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {Client} from "azure-iothub";

const iotHubConnectionString = process.env.IoTHub_Service_ConnectionString;

type RequestBody = {
    deviceId: string,
    message: {
        name: string,
        value: number
    }
}

export async function c2dTest(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http Trigger to send C2D Messages."`);

    try {
        const body: RequestBody = await request.json() as RequestBody;
        context.log(body);

        return {
            body: JSON.stringify({
                deviceId: body.deviceId,
                value: body.message.value
            })
        };
        // const registry = Client.fromConnectionString(iotHubConnectionString);
        // await registry.send(body.deviceId, body.message);
    } catch (e) {
        context.error("Error:", e);
    }

    return {body: 'Error'};
}

app.http('c2dTest', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: c2dTest
});