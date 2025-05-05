// src/getUser.ts
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function getUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const principalHeader = request.headers.get("x-ms-client-principal");

  if (!principalHeader) {
    return { status: 401, body: "Nicht authentifiziert bitte zurück zur Anmeldung" };
  }

  const decoded = Buffer.from(principalHeader, "base64").toString("utf8");
  const principal = JSON.parse(decoded);

  return {
    status: 200,
    jsonBody: {
      username: principal.preferred_username,
      email: principal.email,
      roles: principal.userRoles,
    },
  };
}

app.http("getUser", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getUser,
});
