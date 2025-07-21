// src/screens/VerifyEmailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { auth } from '../firebase/config';

export default function VerifyEmailScreen({ navigation }) {
const [intervalId, setIntervalId] = useState(null);

const checkVerified = async () => {
await auth.currentUser.reload();
if (auth.currentUser.emailVerified) {
    clearInterval(intervalId);
    navigation.replace('Home');
}
};

useEffect(() => {
const id = setInterval(checkVerified, 3000);
setIntervalId(id);
return () => clearInterval(id);
}, []);

const resend = () => {
auth.currentUser && auth.currentUser.sendEmailVerification();
};

return (
<View style={{ flex:1, justifyContent:'center', alignItems:'center', padding:16 }}>
    <Text style={{ marginBottom: 12 }}>We’ve sent a verification link to your email.</Text>
    <Text style={{ marginBottom: 24 }}>Please click it and wait a moment…</Text>
    <Button title="Resend Email" onPress={resend} />
</View>
);
}
