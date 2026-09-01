import { Modal, Pressable, ScrollView, Text, View } from "react-native";

export function FormModal({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white dark:bg-slate-950 rounded-t-2xl max-h-[85%]">
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
            <Text className="text-lg font-bold text-slate-900 dark:text-white">{title}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text className="text-slate-400 text-2xl leading-none">×</Text>
            </Pressable>
          </View>
          <ScrollView className="px-5 pb-8" keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
