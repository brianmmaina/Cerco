// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function LoginScreen({ navigation }) {
const [email, setEmail]       = useState('');
const [password, setPassword] = useState('');
const [error, setError]       = useState('');

const login = async () => {
    try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (!cred.user.emailVerified) {
        navigation.replace('VerifyEmail');
        } else {
        navigation.replace('Home');
        }
    } catch (e) {
        setError(e.message);
    }
    };

    return (
    <View style={{ padding: 16, flex: 1, justifyContent: 'center' }}>
    <TextInput
        placeholder="Student Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ marginBottom: 12, borderBottomWidth: 1, padding: 8 }}
    />
    <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 12, borderBottomWidth: 1, padding: 8 }}
    />
    {error ? <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text> : null}
    <Button title="Log In" onPress={login} />
    <View style={{ height: 12 }} />
    <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
    </View>
    );
}
