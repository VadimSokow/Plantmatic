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
        const body = await request.json();
        context.log(body);

        // const registry = Client.fromConnectionString(iotHubConnectionString);
        // await registry.send(body.deviceId, body.message);
    } catch (e) {
        context.error("Error:", e);
    }

    return {body: `Hello!`};
}

app.http('c2dTest', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: c2dTest
});