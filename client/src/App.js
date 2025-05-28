import "./App.css";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useState, useEffect } from "react";
import ListOfTodo from "./ListOfTodo";

// Initialize Firebase auth
// System Design: Firebase Authentication handles user identity and provides ID tokens for backend authorization.
const auth = getAuth();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Firebase Working: Sets up an observer on the Auth object, which is triggered on sign-in, sign-out, or token changes.
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          localStorage.setItem("testfirebasenodetoken", idToken);
          setToken(idToken);
          setUser(currentUser);
        } catch (error) {
          console.error("Failed to get ID token:", error);
          // Backend: If token acquisition fails, consider a re-authentication or user logout.
        }
      } else {
        localStorage.removeItem("testfirebasenodetoken");
        setToken(null);
        setUser(null);
      }
    });

    // Architecture: Checks for an existing token in local storage on component mount to maintain session across refreshes.
    const storedToken = localStorage.getItem("testfirebasenodetoken");
    if (storedToken) {
      setToken(storedToken);
      // Backend: If token is present, assume a user is potentially logged in. Real validation happens on API calls.
      setUser({ token: storedToken });
    }

    return () => unsubscribe();
  }, []); // Firebase Working: Dependencies are minimal as `auth` object reference is stable.

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      // Firebase Working: After successful sign-in, obtain the ID token.
      const idToken = await user.getIdToken();
      localStorage.setItem("testfirebasenodetoken", idToken);
      setToken(idToken);
      setUser(user);
    } catch (error) {
      console.error("Google login failed:", error.message);
      // Backend: Handle specific Firebase auth errors for better user feedback.
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("testfirebasenodetoken");
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error.message);
      // Backend: Log errors and notify the user if logout fails.
    }
  };

  return (
    <div className="App">
      {user ? (
        <>
          <h1>Todo</h1>
          {/* System Design: ListOfTodo component receives the authentication token for making authenticated API calls. */}
          <ListOfTodo token={token} />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
}

export default App;