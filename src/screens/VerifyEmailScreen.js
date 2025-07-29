import React, { useEffect, useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { View, Text, Button, Alert } from 'react-native';
import { auth } from '../firebase/config';

export default function VerifyEmailScreen({ navigation }) {
    const [intervalId, setIntervalId] = useState(null);

    const checkVerified = async () => {
        try {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
            clearInterval(intervalId);
            navigation.replace('Home');
        }
        } catch (err) {
        console.warn('Error reloading user:', err);
        }
    };

    useEffect(() => {
        const id = setInterval(checkVerified, 3000);
        setIntervalId(id);
        return () => clearInterval(id);
    }, []);

    const resend = () => {
        if (!auth.currentUser) {
        Alert.alert('Not signed in', 'Please sign up or log in first.');
        return;
        }
        console.log('🔁 Attempting to resend to', auth.currentUser.email);
        sendEmailVerification(auth.currentUser)
        .then(() => {
            console.log('✅ Verification email resent');
            Alert.alert('Email Sent', 'Check your inbox (or spam folder).');
        })
        .catch(err => {
            console.warn('❌ Error resending email:', err);
            Alert.alert('Error Sending Email', err.message);
        });
    };

    return (
        <View style={{ flex:1, justifyContent:'center', alignItems:'center', padding:16 }}>
        <Text style={{ marginBottom: 12 }}>
            We’ve sent a verification link to your email.
        </Text>
        <Text style={{ marginBottom: 24 }}>
            Please click it and wait a moment…
        </Text>
        <Button title="Resend Email" onPress={resend} />
        </View>
    );
}
