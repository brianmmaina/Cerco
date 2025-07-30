// src/screens/HomeScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../firebase/config';
import { colors, spacing, typography } from '../theme';

export default function HomeScreen({ navigation }) {
    const signOut = async () => {
        await auth.signOut();
        // root auth listener will switch to Auth stack automatically
    };

    return (
        <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Cerco!</Text>

        <View style={styles.button}>
            <Button
            title="Create Event"
            onPress={() => navigation.navigate('Create')}
            color={colors.primary}
            />
        </View>

        <View style={styles.button}>
            <Button
            title="Go to Calendar"
            onPress={() => navigation.navigate('Calendar')}
            color={colors.primary}
            />
        </View>

        <View style={styles.button}>
            <Button
            title="Go to Feed"
            onPress={() => navigation.navigate('Feed')}
            color={colors.primary}
            />
        </View>

        <View style={styles.button}>
            <Button
            title="Sign Out"
            onPress={signOut}
            color={colors.error}
            />
        </View>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.medium,
        backgroundColor: colors.background,
    },
    welcome: {
        ...typography.h2,
        marginBottom: spacing.large,
        color: colors.text,
        textAlign: 'center',
    },
    button: {
        width: '80%',
        marginVertical: spacing.small,
    },
});
