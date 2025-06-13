import { TouchableOpacity, Text } from "react-native";

export interface SecondaryButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}
export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
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
        borderRadius: 5,
        alignItems: "center",
        // marginVertical: 10,
      }}
    >
      <Text
        style={{
          marginVertical: 10,
          fontSize: 18,
          color: "gray",
          textAlign: "center",
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};
