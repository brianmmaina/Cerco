// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../firebase/config';

export default function HomeScreen({ navigation }) {
    const signOut = async () => {
        await auth.signOut();
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Cerco!</Text>

        <View style={styles.button}>
            <Button 
            title="Create Event" 
            onPress={() => navigation.navigate('Create')} 
            />
        </View>

        <View style={styles.button}>
            <Button 
            title="Go to Calendar" 
            onPress={() => navigation.navigate('Calendar')} 
            />
        </View>

        <View style={styles.button}>
            <Button 
            title="Go to Feed" 
            onPress={() => navigation.navigate('Feed')} 
            />
        </View>

        <View style={styles.button}>
            <Button 
            title="Sign Out" 
            onPress={signOut} 
            color="red"
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
        padding: 16,
    },
    welcome: {
        fontSize: 20, 
        marginBottom: 24,
    },
    button: {
        width: '80%',
        marginVertical: 8,
    },
});
