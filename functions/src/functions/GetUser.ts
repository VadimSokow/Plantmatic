import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import jwt from "jsonwebtoken";

export async function GetClaims(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      status: 401,
      body: "Authorization header missing or malformed",
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    // Nur dekodieren (nicht validieren!)
    const decoded: any = jwt.decode(token);

    if (!decoded) {
      return {
        status: 400,
        body: "Token could not be decoded.",
      };
    }

    const email = decoded.email;
    const preferredUsername = decoded.preferred_username;

    return {
      status: 200,
      jsonBody: {
        message: "Token successfully decoded!",
        email,
        preferredUsername,
        allClaims: decoded,
      },
    };
  } catch (err: any) {
    return {
      status: 400,
      body: `Token processing failed: ${err.message}`,
    };
  }
}

// Funktion registrieren (neue Syntax)
app.http("getUser", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: GetClaims,
});
