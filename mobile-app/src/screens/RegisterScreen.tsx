import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

export function RegisterScreen({ navigate, goBack, setMockUser }: ScreenProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleRegister() {
    setErrorMessage("");

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage("Enter your name, email, and password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters.");
      return;
    }

    // Supabase auth will be re-enabled later. For now, registration creates a local mock user only.
    setMockUser({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim()
    });

    navigate("Home");
  }

  return (
    <Screen>
      <ScreenHeader
        title="Create account"
        subtitle="Tell Manfred Auto Hub who you are so the workshop can contact you about bookings."
        onBack={goBack}
      />

      <View style={styles.form}>
        <AppInput label="Full name" placeholder="Your full name" value={fullName} onChangeText={setFullName} />
        <AppInput
          label="Email"
          placeholder="maya@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <AppInput label="Phone" placeholder="+65 8123 4567" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <AppInput label="Password" placeholder="Create password" secureTextEntry value={password} onChangeText={setPassword} />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <AppButton title="Register" onPress={handleRegister} />
        <AppButton title="I already have an account" variant="ghost" onPress={() => navigate("Login")} />
      </View>

      <Text style={styles.note}>Mock mode: registration saves a temporary local user for this prototype session.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 14
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
