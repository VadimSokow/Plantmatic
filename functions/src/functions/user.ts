
import jwt, {JwtPayload} from "jsonwebtoken";


export function getUser(authHeader: string): string | null {


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("AuthHeader fehlerhaft oder nciht da")
    return null
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.decode(token) as JwtPayload | null

    if (!decoded){
        console.log("AuthHeader fehlerhaft oder nciht da")
        return null
    }

    return decoded.email 
  } catch (error){
    console.log("Dekodierung fehlgeschlagen: ", error)
  }


}