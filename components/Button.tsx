import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "green" | "orange" | "back";
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "green",
  icon,
}) => {
  return (
    <TouchableOpacity style={[styles.cont, styles[variant]]} onPress={onPress}>
      <View style={[styles.content, icon ? styles.contentWithIcon : null]}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  cont: {
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: "auto",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  contentWithIcon: {
    flexDirection: "column",
  },
  icon: {
    marginBottom: 6,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  green: {
    backgroundColor: "#7A9E7E",
  },
  orange: {
    backgroundColor: "#D89D6A",
  },
  back: {
    backgroundColor: "#5E5D5C",
  },
});
