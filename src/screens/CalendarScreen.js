// src/screens/CalendarScreen.js

import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { colors, spacing, typography } from '../theme';

export default function CalendarScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(getToday());

    useEffect(() => {
        const q = query(collection(db, 'events'));
        const unsub = onSnapshot(q, snap => {
        setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, []);

    useEffect(() => {
        const now = new Date();
        const msUntilMidnight =
        new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
        const timeout = setTimeout(() => {
        setSelectedDate(getToday());
        }, msUntilMidnight);
        return () => clearTimeout(timeout);
    }, [selectedDate]);

    const baseMarked = {
        [selectedDate]: {
        selected: true,
        selectedColor: colors.primary,
        },
    };

    const markedDates = events.reduce((acc, evt) => {
        const date = evt.date;
        if (!acc[date]) {
        acc[date] = { marked: true, dotColor: colors.secondary };
        }
        return acc;
    }, baseMarked);

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

    function getToday() {
    return new Date().toISOString().split('T')[0];
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    heading: {
        ...typography.h2,
        marginHorizontal: spacing.medium,
        marginTop: spacing.large,
    },
    card: {
        marginHorizontal: spacing.medium,
        marginVertical: spacing.small,
        padding: spacing.medium,
        backgroundColor: colors.surface,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        ...typography.body,
        fontWeight: '500',
    },
    meta: {
        ...typography.caption,
        marginTop: spacing.tiny,
    },
    empty: {
        textAlign: 'center',
        marginTop: spacing.large,
        color: colors.muted,
    },
});
