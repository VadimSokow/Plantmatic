import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {Client} from "azure-iothub";
import {Message} from "azure-iothub/dist/common-core/message";

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
        const client = Client.fromConnectionString(iotHubConnectionString);
        await client.open();
        await client.send(body.deviceId, JSON.stringify(body.message));
        await client.close();
    } catch (e) {
        context.error("Error:", e);
        return { status: 500 }
    }

    return { status: 200 };
}

app.http('c2dTest', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: c2dTest
});