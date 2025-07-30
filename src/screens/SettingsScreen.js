// src/screens/SettingsScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase/config';
import { colors, spacing, typography } from '../theme';

export default function SettingsScreen() {
    const signOut = async () => {
        try {
        await auth.signOut();
        // Root auth listener will handle navigation back to login
        } catch (e) {
        Alert.alert('Error', 'Could not sign out.');
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.header}>Settings</Text>
        <View style={styles.button}>
            <Button
            title="Sign Out"
            onPress={signOut}
            color={colors.error}
            />
        </View>
        {/* Additional settings options can go here */}
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.medium,
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    header: {
        ...typography.h2,
        marginBottom: spacing.large,
        color: colors.text,
        textAlign: 'center',
    },
    button: {
        width: '80%',
        alignSelf: 'center',
        marginVertical: spacing.small,
    },
});
