import { TouchableOpacity, Text } from "react-native";

export interface PrimaryButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onPress,
  children,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        width: 300,
        padding: 10,
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 5,
        alignItems: "center",
        // marginVertical: 10,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: "#fff",
          textAlign: "center",
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};
