"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

const useAuthState = (auth, options) => {
  const [userState, setUserState] = useState({ user: null, claims: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const listener = onAuthStateChanged(
      auth,
      async (user) => {
        setLoading(true);
        if (options?.onUserChanged) {
          try {
            await options.onUserChanged(user);
          } catch (e) {
            setError(e);
          }
        }
        if (user) {
          // Si el usuario está logueado, obtén los claims del usuario
          try {
            const token = await user.getIdTokenResult();
            setUserState({ user, claims: token.claims });
          } catch (error) {
            setError(error);
          }
        } else {
          // Si el usuario no está logueado, establece user y claims como null
          setUserState({ user: null, claims: null });
        }
        setLoading(false);
      },
      setError
    );

    return () => {
      listener();
    };
  }, [auth, options]);

  return [userState, loading, error];
};

export default useAuthState;
