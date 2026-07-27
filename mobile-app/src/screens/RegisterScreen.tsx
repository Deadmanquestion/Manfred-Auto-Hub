import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { demoUser } from "../data/mockData";
import { hasSupabaseEnv, supabase } from "../lib/supabase";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

export function RegisterScreen({ navigate, goBack, setMockUser }: ScreenProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (!hasSupabaseEnv) {
        setMockUser(demoUser);
        navigate("Home");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            role: "customer"
          }
        }
      });
      if (error) throw error;

      if (!data.session || !data.user) {
        setErrorMessage("Account created. Confirm your email, then return to log in.");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").upsert({
        email: data.user.email,
        full_name: fullName.trim(),
        id: data.user.id,
        role: "customer",
        status: "Active"
      });
      if (profileError) throw profileError;

      setMockUser({ email: email.trim(), fullName: fullName.trim(), phone: phone.trim() });
      navigate("Home");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
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
        <AppButton title="Register" loading={isSubmitting} onPress={handleRegister} />
        <AppButton title="I already have an account" variant="ghost" onPress={() => navigate("Login")} />
      </View>

      <Text style={styles.note}>Your bookings and vehicles will be saved to your ManFix account.</Text>
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
