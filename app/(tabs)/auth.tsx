import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from 'react-native-paper';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const router = useRouter();
  const { signIn, signUp, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
  if (user) {
    const timeout = setTimeout(() => {
      router.replace("/");
    }, 20);

    return () => clearTimeout(timeout);
  }
    }, [user]);



  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
    setError("Password must be at least 6 characters long.");
      return;
    }

    setError(null);

    const authError = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (authError) {
      setError(authError);
    } else {
      router.replace("/"); 
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>

        <TextInput
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@gmail.com"
          mode="outlined"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
        />


        <TextInput
          label="Password"
          autoCapitalize="none"
          placeholder="Your password..."
          mode="outlined"
          secureTextEntry={!showPassword}
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          right={
          <TextInput.Icon
          icon={showPassword ? "eye-off" : "eye"}
          onPress={() => setShowPassword(!showPassword)}
    />
  }
/>



        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

        <Button mode="contained" style={styles.button} onPress={handleAuth}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>

        <Button mode="text" style={styles.switchModeButton} onPress={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  switchModeButton: {
    marginTop: 16,
  },
});
