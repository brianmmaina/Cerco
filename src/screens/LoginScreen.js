// src/screens/LoginScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function LoginScreen({ navigation }) {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');

    const login = async () => {
        setError('');
        try {
        // Attempt to sign in
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

        // Redirect based on verification status
        if (!cred.user.emailVerified) {
            navigation.replace('VerifyEmail');
        } else {
            navigation.replace('Home');
        }
        } catch (e) {
        // Show a user-friendly error
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
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button title="Log In" onPress={login} />
        <View style={styles.spacer} />
        <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
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
    spacer: {
        height: 12,
    },
});
