const { admin } = require("../config/firebaseConfig");

class AuthMiddleware {
  // Backend: Middleware to authenticate Firebase ID tokens from client requests.
  // Security: Verifies the integrity and authenticity of the ID token using Firebase Admin SDK.
  async authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Security: Missing or malformed Authorization header.
      return res.status(401).json({ message: "No authorization token provided or invalid format." });
    }

    const token = authHeader.split(" ")[1];
    console.log("authorization", authHeader); //Note: remove these console logs
    console.log("token", token);

    try {
      // Firebase Working: Verifies the ID token with Firebase. This ensures the token is valid and not expired.
      const decodedToken = await admin.auth().verifyIdToken(token);
      // Backend: Attaching the decoded user information to the request for subsequent route handlers.
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error("Firebase ID token verification failed:", error.message);
      // Security: Differentiate between various authentication errors for precise feedback.
      if (error.code === "auth/id-token-expired") {
        return res.status(401).json({ message: "Authentication token expired. Please re-authenticate." });
      }
      if (error.code === "auth/argument-error") {
        return res.status(401).json({ message: "Invalid authentication token." });
      }
      return res.status(403).json({ message: "Forbidden: Invalid or unauthorized token." });
    }
  }
}

module.exports = new AuthMiddleware();