// src/screens/CreateEventScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView, Text, StyleSheet } from 'react-native';

export default function CreateEventScreen({ navigation }) {
  // States hooks for each field
    const [name, setName]           = useState('');
    const [date, setDate]           = useState('');
    const [time, setTime]           = useState('');
    const [location, setLocation]   = useState('');
    const [description, setDescription] = useState('');
    const [rules, setRules]         = useState('');
    const [capacity, setCapacity]   = useState('');

    //Placeholder submit handler
    const submit = () => {
        // TODO: validate & write to Firestore + upload poster
        console.log({ name, date, time, location, description, rules, capacity });
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
            keyboardType="numeric"
            style={styles.input}
        />

        {/* TODO: Image picker & upload button here */}

        <Button title="Create Event" onPress={submit} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding:16 },
    input: {
        borderBottomWidth:1,
        marginBottom:12,
        paddingVertical:8,
        paddingHorizontal:4,
    },
    textArea: {
        borderWidth:1,
        marginBottom:12,
        padding:8,
        height:80,
        textAlignVertical:'top',
    },
});
