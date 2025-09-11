import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export function AuthRedirectAfterMount({children}: {children: React.ReactNode}) {
const { user, isLoading } = useAuth();
const navState = useRootNavigationState();
const router = useRouter();
const [hasMounted, setHasMounted] = useState(false);
const segments = useSegments();


useEffect(() => {
  setHasMounted(true);
}, []);

useEffect(() => {
    const inAuthGroup = segments[0] === "auth"
  if (hasMounted && user && inAuthGroup) {
    router.replace("/auth");
  }
}, [hasMounted, user, segments]);

  return <>{children}</>;
}


export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <AuthProvider>
      <PaperProvider>
        <SafeAreaProvider>
          <AuthRedirectAfterMount>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
            </Stack>
          </AuthRedirectAfterMount>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
    </GestureHandlerRootView>
  );
}