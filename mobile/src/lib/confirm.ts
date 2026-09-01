import { Alert } from "react-native";

// Mirrors the web app's AlertDialog "are you sure?" confirmation pattern.
export function confirm(title: string, message: string, onConfirm: () => void, confirmLabel = "Continue") {
  Alert.alert(title, message, [
    { text: "Cancel", style: "cancel" },
    { text: confirmLabel, style: "destructive", onPress: onConfirm },
  ]);
}
