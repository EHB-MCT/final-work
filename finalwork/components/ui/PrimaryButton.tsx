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
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: "#FD9003",
        // dropshadow
        shadowColor: "#FD9003",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 2,
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
