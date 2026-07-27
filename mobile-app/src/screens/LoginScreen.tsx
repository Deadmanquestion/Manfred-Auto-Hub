import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { Screen } from "../components/Screen";
import { demoUser } from "../data/mockData";
import { hasSupabaseEnv, supabase } from "../lib/supabase";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

export function LoginScreen({ navigate, setMockUser }: ScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (!hasSupabaseEnv) {
        setMockUser(demoUser);
        navigate("Home");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (error) throw error;
      if (!data.user) throw new Error("Unable to open your account.");

      setMockUser({
        email: data.user.email ?? email.trim(),
        fullName: String(data.user.user_metadata?.full_name ?? data.user.email?.split("@")[0] ?? "ManFix customer"),
        phone: data.user.phone ?? undefined
      });
      navigate("Home");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
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
        <AppButton title="Log in" loading={isSubmitting} onPress={handleLogin} />
        <AppButton title="Create an account" variant="secondary" onPress={() => navigate("Register")} />
      </View>

      <Text style={styles.note}>Use your ManFix account to keep bookings synchronized with the workshop.</Text>
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
