import { useSignIn, useSignInWithApple, useSignUp, useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";

// Preloads the browser on Android to reduce OAuth load time. iOS uses
// ASWebAuthenticationSession instead, which doesn't need warming up.
function useWarmUpBrowser() {
  React.useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

WebBrowser.maybeCompleteAuthSession();

type Mode = "sign-in" | "sign-up" | "verify";

export default function SignInScreen() {
  useWarmUpBrowser();

  const { signIn, setActive: setActiveFromSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveFromSignUp, isLoaded: signUpLoaded } = useSignUp();
  const { startSSOFlow } = useSSO();
  const { startAppleAuthenticationFlow } = useSignInWithApple();

  const [mode, setMode] = React.useState<Mode>("sign-in");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmitPassword = async () => {
    if (!signInLoaded || !signUpLoaded) return;
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "sign-in") {
        const attempt = await signIn.create({ identifier: email, password });
        if (attempt.status === "complete") {
          await setActiveFromSignIn({ session: attempt.createdSessionId });
        } else {
          setError("Additional verification required — not yet supported in this app.");
        }
      } else {
        await signUp.create({ emailAddress: email, password });
        await signUp.prepareEmailAddressVerification();
        setMode("verify");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const onVerify = async () => {
    if (!signUpLoaded) return;
    setError(null);
    setSubmitting(true);
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });
      if (attempt.status === "complete") {
        await setActiveFromSignUp({ session: attempt.createdSessionId });
      } else {
        setError("Verification incomplete — double check the code.");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const onGooglePress = async () => {
    setError(null);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri({ scheme: "mobile", path: "sso-callback" }),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.message ?? "Google sign-in failed");
    }
  };

  const onApplePress = async () => {
    setError(null);
    try {
      const { createdSessionId, setActive } = await startAppleAuthenticationFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      setError(err?.message ?? "Apple sign-in failed");
    }
  };

  return (
    <ScrollView contentContainerClassName="flex-1 justify-center px-6 py-12 bg-white dark:bg-slate-950" keyboardShouldPersistTaps="handled">
      <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Money Manager</Text>
      <Text className="text-slate-500 dark:text-slate-400 mb-8">
        {mode === "verify" ? "Check your email for a verification code" : mode === "sign-up" ? "Create an account" : "Sign in to continue"}
      </Text>

      {mode !== "verify" ? (
        <>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 mb-3 text-slate-900 dark:text-white"
          />
          <TextInput
            autoCapitalize="none"
            secureTextEntry
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            className="border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 mb-4 text-slate-900 dark:text-white"
          />

          {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}

          <Pressable
            onPress={onSubmitPassword}
            disabled={submitting}
            className="bg-blue-600 rounded-lg py-3 items-center mb-4 disabled:opacity-60"
          >
            {submitting ? <ActivityIndicator color="white" /> : <Text className="text-white font-semibold">{mode === "sign-in" ? "Sign In" : "Sign Up"}</Text>}
          </Pressable>

          <Pressable onPress={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")} className="mb-8">
            <Text className="text-blue-600 text-center">
              {mode === "sign-in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </Text>
          </Pressable>

          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <Text className="mx-3 text-slate-400 text-xs uppercase">or continue with</Text>
            <View className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </View>

          <Pressable onPress={onGooglePress} className="border border-slate-300 dark:border-slate-700 rounded-lg py-3 items-center mb-3">
            <Text className="text-slate-900 dark:text-white font-medium">Continue with Google</Text>
          </Pressable>

          {Platform.OS === "ios" ? (
            <Pressable onPress={onApplePress} className="bg-black rounded-lg py-3 items-center">
              <Text className="text-white font-medium">Continue with Apple</Text>
            </Pressable>
          ) : null}
        </>
      ) : (
        <>
          <TextInput
            keyboardType="number-pad"
            placeholder="Verification code"
            value={code}
            onChangeText={setCode}
            className="border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 mb-4 text-slate-900 dark:text-white"
          />
          {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}
          <Pressable onPress={onVerify} disabled={submitting} className="bg-blue-600 rounded-lg py-3 items-center disabled:opacity-60">
            {submitting ? <ActivityIndicator color="white" /> : <Text className="text-white font-semibold">Verify</Text>}
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}
