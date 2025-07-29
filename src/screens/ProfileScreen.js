import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
    return (
        <View style={styles.center}>
        <Text>Profile & Settings coming soon…</Text>
        </View>
    );
    }

    const styles = StyleSheet.create({
    center: { flex:1, justifyContent:'center', alignItems:'center' },
});
