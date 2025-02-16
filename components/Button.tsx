import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "green" | "orange";
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "green",
}) => {
  return (
    <TouchableOpacity style={[styles.cont, styles[variant]]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  cont: {
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    width: "auto",
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
  green: {
    backgroundColor: "#7A9E7E",
  },
  orange: {
    backgroundColor: "#D89D6A",
  },
});
