import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

// Define the auth context type
interface AuthContextType {
  session: any;
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, isPending } = authClient.useSession();
  
  const authValue: AuthContextType = {
    session,
    user: session?.user || null,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Export session hooks for direct use
export const useSession = () => authClient.useSession();
export { authClient };