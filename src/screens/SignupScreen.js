// src/screens/SignupScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { 
    createUserWithEmailAndPassword, 
    sendEmailVerification 
} from 'firebase/auth';
import { auth } from '../firebase/config';

export default function SignupScreen({ navigation }) {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');

    const signup = async () => {
        setError('');
        const trimmed = email.trim().toLowerCase();
        // Require @bu.edu email
        if (!trimmed.endsWith('@bu.edu')) {
        return setError('Please use your @bu.edu email address.');
        }

        try {
        // Create account
        const cred = await createUserWithEmailAndPassword(auth, trimmed, password);

        // Send verification email
        await sendEmailVerification(cred.user);

        // Move to verification screen
        navigation.replace('VerifyEmail');
        } catch (e) {
        // Simplify Firebase error codes
        const msg = e.message.includes('auth/') ? e.message.split('auth/')[1] : e.message;
        setError(msg.replace(/[-_]/g, ' '));
        }
    };

    return (
        <View style={styles.container}>
        <TextInput
            placeholder="Student Email (@bu.edu)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
        />
        <TextInput
            placeholder="Password (min 6 chars)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button title="Sign Up" onPress={signup} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        padding: 16,
    },
    input: {
        marginBottom: 12,
        borderBottomWidth: 1,
        padding: 8,
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center',
    },
});
