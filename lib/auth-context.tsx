import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      const currentUser = await account.get();
    console.log("✅ Logged in user:", currentUser);
      setUser(currentUser);
    } catch (error) {
    console.log("❌ No session found or failed to get user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password);
      return await signIn(email, password);
    } catch (error: any) {
      return error.message || "An error occurred during sign-up.";
  }
};

  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      setUser(currentUser);

      return null;
    } catch (error:any) {
      return error.message || "An error occurred during sign-in.";
    }
  };

/*  useEffect(() => {
    account.deleteSession("current").then(() => {
      console.log("✅ Session cleared for testing");
    });
  }, []); */


  const signOut = async () => {
    try {
        await account.deleteSession("current");
        setUser(null);
    } catch(error) {
        console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}