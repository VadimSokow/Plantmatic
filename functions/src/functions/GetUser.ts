// src/getUser.ts
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function getUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const principalHeader = request.headers.get("x-ms-client-principal");

  if (!principalHeader) {
    return { status: 401, body: "Nicht authentifiziert" };
  }

  const decoded = Buffer.from(principalHeader, "base64").toString("utf8");
  const principal = JSON.parse(decoded);

  return {
    status: 200,
    jsonBody: {
      id: principal.userId,
      email: principal.userDetails,
      roles: principal.userRoles,
    },
  };
}

app.http("getUser", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getUser,
});
