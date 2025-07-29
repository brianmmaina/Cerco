// src/screens/CreateEventScreen.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';

export default function CreateEventScreen({ navigation }) {
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [rules, setRules] = useState('');
    const [capacity, setCapacity] = useState('');
    const [posterUri, setPosterUri] = useState(null);
    const [loading, setLoading] = useState(false);

    //Pick an image for ur eveent
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        });
        if (!result.cancelled) {
        setPosterUri(result.uri);
        }
    };

    //Handle date/time selection
    const onDateChange = (event, selected) => {
        setShowDatePicker(false);
        if (selected) setDate(selected);
    };
    const onTimeChange = (event, selected) => {
        setShowTimePicker(false);
        if (selected) setTime(selected);
    };

    //Submit handler
    const submit = async () => {
        if (!name || !location || !capacity || !posterUri) {
        return Alert.alert('Missing fields', 'Please fill all required fields and select a poster.');
        }
        setLoading(true);
        try {
        // Upload poster
        const response = await fetch(posterUri);
        const blob = await response.blob();
        const posterRef = ref(storage, `posters/${uuidv4()}`);
        await uploadBytes(posterRef, blob);
        const posterUrl = await getDownloadURL(posterRef);

        // Format date/time
        const dateString = date.toISOString().split('T')[0];
        const timeString = time.toTimeString().slice(0,5);

        // Add Firestore document
        await addDoc(collection(db, 'events'), {
            name,
            date: dateString,
            time: timeString,
            location,
            description,
            rules,
            capacity: parseInt(capacity, 10),
            posterUrl,
            timestamp: serverTimestamp(),
            upvotes: 0,
            rsvps: 0,
            creatorId: auth.currentUser?.uid || null,
        });

        Alert.alert('Event created!', 'Your event is now live.');
        navigation.goBack();
        } catch (e) {
        console.warn('Create event error:', e);
        Alert.alert('Error', 'Could not create event.');
        } finally {
        setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <TextInput
            placeholder="Event Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
        />

        {/* Date Picker */}
        <Button title={`Select Date: ${date.toISOString().split('T')[0]}`} onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
            <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            />
        )}

        {/* Time Picker */}
        <Button title={`Select Time: ${time.toTimeString().slice(0,5)}`} onPress={() => setShowTimePicker(true)} />
        {showTimePicker && (
            <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={onTimeChange}
            />
        )}

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

        {/* Poster Picker & Preview */}
        <Button title="Pick Poster Image" onPress={pickImage} />
        {posterUri && <Image source={{ uri: posterUri }} style={styles.preview} />}

        <View style={styles.submit}>
            <Button title={loading ? 'Creating...' : 'Create Event'} onPress={submit} disabled={loading} />
        </View>
        </ScrollView>
    );
    }

    const styles = StyleSheet.create({
    container: { padding: 16 },
    input: {
        borderBottomWidth: 1,
        marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    textArea: {
        borderWidth: 1,
        marginBottom: 12,
        padding: 8,
        height: 80,
        textAlignVertical: 'top',
    },
    preview: {
        width: '100%',
        height: 200,
        marginVertical: 12,
        borderRadius: 8,
    },
    submit: {
        marginTop: 16,
    },
});
