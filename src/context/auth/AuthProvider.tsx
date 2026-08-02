import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";

import type { User } from "../../types/user";
import type { AuthForm } from "../../types/auth";
import { API } from "../../api/api";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const currentUserEmail = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );

    if (!currentUserEmail) return null;

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    return users[currentUserEmail] ?? null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const clearError = () => setError("");

  const login = async (data: AuthForm) => {
    try {
      setIsLoading(true);
      clearError();

      const response = await API.login(data);

      setUser({
        id: response.user._id,
        username: response.user.fullName,
        email: response.user.email,
        password: "",
      });

      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: AuthForm) => {
    try {
      setIsLoading(true);
      clearError();

      const response = await API.signup(data);

      const newUser = {
        id: response.user._id,
        username: response.user.fullName,
        email: response.user.email,
        password: "",
      };

      const users = JSON.parse(localStorage.getItem("users") || "{}");
      users[newUser.email] = newUser;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser.email));

      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Signup failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await API.logout();
      console.log("logout sucessfull");

      setUser(null);
      clearError();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        setIsLoading,
        login,
        signUp,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// const signUp = async (data: AuthForm) => {
//     try {
//       setIsLoading(true);
//       clearError();

//       const response = await API.signup(data);

//       setUser({
//         id: response.user._id,
//         username: response.user.fullName,
//         email: response.user.email,
//         password: "",
//       });

//       return true;
//     } catch (error) {
//       setError(error instanceof Error ? error.message : "Signup failed");
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };
