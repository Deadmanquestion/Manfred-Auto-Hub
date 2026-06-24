import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { Screen } from "../components/Screen";
import { getDisplayNameFromEmail } from "../lib/mockAuth";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

export function LoginScreen({ navigate, setMockUser }: ScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleLogin() {
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Enter your email and password.");
      return;
    }

    // Supabase auth will be re-enabled later. For now, any email and password logs into the prototype.
    setMockUser({
      fullName: getDisplayNameFromEmail(email),
      email: email.trim(),
    });

    navigate("Home");
  }

  return (
    <Screen>
      <View style={styles.brandPanel}>
        <Text style={styles.brand}>Manfred Auto Hub</Text>
        <Text style={styles.title}>Workshop access, made simple.</Text>
        <Text style={styles.subtitle}>Book service, rent a lift, or join the workshop team.</Text>
      </View>

      <View style={styles.form}>
        <AppInput
          label="Email"
          placeholder="maya@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <AppInput
          label="Password"
          placeholder="Enter password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <AppButton title="Log in" onPress={handleLogin} />
        <AppButton title="Create an account" variant="secondary" onPress={() => navigate("Register")} />
      </View>

      <Text style={styles.note}>Mock mode: any email and password will sign in.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandPanel: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.border,
    borderRadius: 26,
    borderWidth: 1,
    gap: 10,
    marginTop: 32,
    padding: 24
  },
  brand: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  title: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 39
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  form: {
    gap: 14,
    marginTop: 10
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center"
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  }
});
