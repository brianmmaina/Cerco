// src/screens/VerifyEmailScreen.js

import React, { useEffect, useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { auth } from '../firebase/config';
import { colors, spacing, typography } from '../theme';

export default function VerifyEmailScreen({ navigation }) {
    const [intervalId, setIntervalId] = useState(null);

    const checkVerified = async () => {
        try {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
            clearInterval(intervalId);
            navigation.replace('Main');
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
        sendEmailVerification(auth.currentUser)
        .then(() => {
            Alert.alert('Email Sent', 'Check your inbox (or spam folder).');
        })
        .catch(err => {
            console.warn('Error resending email:', err);
            Alert.alert('Error Sending Email', err.message);
        });
    };

    return (
        <View style={styles.container}>
        <Text style={styles.prompt}>
            We’ve sent a verification link to your email.
        </Text>
        <Text style={styles.prompt}>
            Please click it and wait a moment…
        </Text>
        <View style={styles.button}>
            <Button
            title="Resend Email"
            onPress={resend}
            color={colors.primary}
            />
        </View>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex:           1,
        justifyContent: 'center',
        alignItems:     'center',
        padding:        spacing.medium,
        backgroundColor: colors.background,
    },
    prompt: {
        ...typography.body,
        textAlign:   'center',
        marginBottom: spacing.medium,
        color:       colors.text,
    },
    button: {
        marginTop: spacing.small,
        width:     '60%',
    },
});
