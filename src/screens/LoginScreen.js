// src/screens/LoginScreen.js

import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Text,
    Alert,
    StyleSheet,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { colors, spacing, typography } from '../theme';

export default function LoginScreen({ navigation }) {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');

    const login = async () => {
        setError('');
        try {
        const cred = await signInWithEmailAndPassword(
            auth,
            email.trim(),
            password
        );
        // Auth flow now handled at root; just navigate
        navigation.replace('Main');
        } catch (e) {
        const msg = e.message.includes('auth/')
            ? e.message.split('auth/')[1]
            : e.message;
        setError(msg.replace(/[-_]/g, ' '));
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Cerco Login</Text>
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
        <View style={styles.button}>
            <Button title="Log In" onPress={login} color={colors.primary} />
        </View>
        <View style={styles.spacer} />
        <View style={styles.button}>
            <Button
            title="Sign Up"
            onPress={() => navigation.navigate('Signup')}
            color={colors.secondary}
            />
        </View>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.medium,
        backgroundColor: colors.background,
    },
    title: {
        ...typography.h2,
        textAlign: 'center',
        marginBottom: spacing.large,
        color: colors.text,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: colors.muted,
        marginBottom: spacing.medium,
        paddingVertical: spacing.small,
        color: colors.text,
    },
    errorText: {
        color: colors.error,
        marginBottom: spacing.medium,
        textAlign: 'center',
        ...typography.caption,
    },
    button: {
        marginBottom: spacing.small,
        width: '100%',
    },
    spacer: {
        height: spacing.small,
    },
});
