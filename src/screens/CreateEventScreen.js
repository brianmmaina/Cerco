// src/screens/CreateEventScreen.js

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { colors, spacing, typography } from '../theme';

export default function CreateEventScreen({ navigation }) {
    const [name, setName]               = useState('');
    const [date, setDate]               = useState('');
    const [time, setTime]               = useState('');
    const [location, setLocation]       = useState('');
    const [description, setDescription] = useState('');
    const [rules, setRules]             = useState('');
    const [capacity, setCapacity]       = useState('');
    const [loading, setLoading]         = useState(false);

    const handleCreate = async () => {
        if (!name || !date || !time) {
        Alert.alert('Missing fields', 'Please fill in name, date, and time.');
        return;
        }

        setLoading(true);
        try {
        await addDoc(collection(db, 'events'), {
            name,
            date,
            time,
            location,
            description,
            rules,
            capacity: Number(capacity) || 0,
            creatorId: auth.currentUser.uid,
            timestamp: serverTimestamp(),
            upvotes: 0,
            rsvps: 0,
        });
        Alert.alert('Event Created', 'Your event has been posted.');
        navigation.goBack();
        } catch (err) {
        console.warn(err);
        Alert.alert('Error', 'Could not create event.');
        } finally {
        setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.header}>Create Event</Text>

        <TextInput
            placeholder="Event Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
        />
        <TextInput
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            style={styles.input}
        />
        <TextInput
            placeholder="Time (HH:MM)"
            value={time}
            onChangeText={setTime}
            style={styles.input}
        />
        <TextInput
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
        />
        <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.textArea}
            multiline
        />
        <TextInput
            placeholder="Rules"
            value={rules}
            onChangeText={setRules}
            style={styles.textArea}
            multiline
        />
        <TextInput
            placeholder="Capacity"
            value={capacity}
            onChangeText={setCapacity}
            style={styles.input}
            keyboardType="numeric"
        />

        {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
        ) : (
            <Button title="Create" color={colors.primary} onPress={handleCreate} />
        )}
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.medium,
    },
    header: {
        ...typography.h2,
        marginBottom: spacing.medium,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: colors.muted,
        marginBottom: spacing.small,
        paddingVertical: spacing.small,
        color: colors.text,
    },
    textArea: {
        borderWidth: 1,
        borderColor: colors.muted,
        marginBottom: spacing.small,
        padding: spacing.small,
        height: 80,
        textAlignVertical: 'top',
        color: colors.text,
    },
});
