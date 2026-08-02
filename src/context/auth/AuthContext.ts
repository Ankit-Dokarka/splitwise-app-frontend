import { createContext } from "react";
import type { User } from "../../types/user";
import type { Dispatch, SetStateAction } from "react";
import type { AuthForm } from "../../types/auth";

type AuthContextType = {
  user: User | null;
  login: (data: AuthForm) => Promise<boolean>;
  signUp: (user: AuthForm) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  error: string;
  clearError: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
