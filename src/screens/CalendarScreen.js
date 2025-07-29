// src/screens/CalendarScreen.js
import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function CalendarScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(getToday());

    // Real-time listener for all events
    useEffect(() => {
        const q = query(collection(db, 'events'));
        const unsub = onSnapshot(q, snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setEvents(docs);
        });
        return unsub;
    }, []);

    // Auto-reset selectedDate at midnight
    useEffect(() => {
        const now = new Date();
        const msUntilMidnight =
        new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
        const timeout = setTimeout(() => {
        setSelectedDate(getToday());
        }, msUntilMidnight);
        return () => clearTimeout(timeout);
    }, [selectedDate]);

    // Build markedDates object
    const baseMarked = {
        [selectedDate]: {
        selected: true,
        selectedColor: '#007AFF',
        },
    };
    const markedDates = events.reduce((acc, evt) => {
        const date = evt.date; // "YYYY-MM-DD"
        if (!acc[date]) {
        acc[date] = { marked: true, dotColor: '#2196F3' };
        }
        return acc;
    }, baseMarked);

    // Filter events for the selected day
    const dailyEvents = events.filter(evt => evt.date === selectedDate);

    return (
        <View style={styles.container}>
        <CalendarList
            horizontal
            pagingEnabled
            calendarWidth={Dimensions.get('window').width}
            pastScrollRange={0}
            futureScrollRange={4}
            firstDay={1}
            markedDates={markedDates}
            markingType="simple"
            onDayPress={day => setSelectedDate(day.dateString)}
        />

        <Text style={styles.heading}>Events on {selectedDate}</Text>

        <FlatList
            data={dailyEvents}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Details', { id: item.id })}
            >
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.meta}>{item.time || '—'}</Text>
            </TouchableOpacity>
            )}
            ListEmptyComponent={
            <Text style={styles.empty}>No events today</Text>
            }
        />
        </View>
    );
    }

    // Helper to format today as YYYY-MM-DD
    function getToday() {
    return new Date().toISOString().split('T')[0];
    }

    const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    heading: {
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 16,
        marginTop: 16,
    },
    card: {
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: { fontSize: 16, fontWeight: '500' },
    meta: { color: '#555', marginTop: 4 },
    empty: { textAlign: 'center', marginTop: 32, color: '#888' },
    });
