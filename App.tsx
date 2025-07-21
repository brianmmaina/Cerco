import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { auth } from "./src/firebase/config";    // ← restore this import

export default function App() {
useEffect(() => {
    console.log("🔥 Firebase Auth initialized:", auth);
}, []);

    return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Firebase is hooked up! Check your Metro logs.</Text>
    </View>
);
}
