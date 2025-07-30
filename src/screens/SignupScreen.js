// src/screens/SignupScreen.js

import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Text,
    Alert,
    StyleSheet,
} from 'react-native';
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { colors, spacing, typography } from '../theme';

export default function SignupScreen({ navigation }) {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');

    const signup = async () => {
        setError('');
        const trimmed = email.trim().toLowerCase();
        if (!trimmed.endsWith('@bu.edu')) {
        return setError('Please use your @bu.edu email address.');
        }
        try {
        const cred = await createUserWithEmailAndPassword(
            auth,
            trimmed,
            password
        );
        await sendEmailVerification(cred.user);
        navigation.replace('VerifyEmail');
        } catch (e) {
        const msg = e.message.includes('auth/')
            ? e.message.split('auth/')[1]
            : e.message;
        setError(msg.replace(/[-_]/g, ' '));
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Create an Account</Text>

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
        <View style={styles.button}>
            <Button
            title="Sign Up"
            onPress={signup}
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
        padding:        spacing.medium,
        backgroundColor: colors.background,
    },
    title: {
        ...typography.h2,
        textAlign:    'center',
        marginBottom: spacing.large,
        color:        colors.text,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: colors.muted,
        marginBottom:      spacing.medium,
        paddingVertical:   spacing.small,
        color:             colors.text,
    },
    errorText: {
        ...typography.caption,
        color:        colors.error,
        marginBottom: spacing.medium,
        textAlign:    'center',
    },
    button: {
        marginTop: spacing.small,
    },
});
