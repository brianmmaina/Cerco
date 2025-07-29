// src/screens/SettingsScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase/config';

export default function SettingsScreen({ navigation }) {
    const signOut = async () => {
        try {
        await auth.signOut();
        // After sign out, send user back to the login flow or calendar
        navigation.replace('Calendar');
        } catch (e) {
        Alert.alert('Error', 'Could not sign out.');
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.header}>Settings</Text>
        <Button
            title="Sign Out"
            onPress={signOut}
            color="red"
        />
        {/* You can add more settings options here */}
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: { flex:1, padding:16, justifyContent:'center' },
    header: { fontSize:20, fontWeight:'600', marginBottom:24 },
});
