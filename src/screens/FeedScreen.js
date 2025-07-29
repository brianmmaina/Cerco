// src/screens/FeedScreen.js
import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    doc,
    updateDoc,
    increment
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export default function FeedScreen({ navigation }) {
    const [events, setEvents] = useState([]);

    // Real-time listener sorted by newest first
    useEffect(() => {
        const q = query(
        collection(db, 'events'),
        orderBy('timestamp', 'desc')
        );
        const unsub = onSnapshot(q, snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setEvents(docs);
        });
        return unsub;
    }, []);

    // Increment upvotes
    const upvote = async id => {
        const ref = doc(db, 'events', id);
        await updateDoc(ref, { upvotes: increment(1) });
    };

    // Increment RSVPs
    const rsvp = async id => {
        const ref = doc(db, 'events', id);
        await updateDoc(ref, { rsvps: increment(1) });
    };

    return (
        <View style={styles.container}>
        <FlatList
            data={events}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Details', { id: item.id })}
            >
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.meta}>
                {item.date} {item.time || ''}
                </Text>
                <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => upvote(item.id)}
                >
                    <Ionicons name="heart" size={24} color="red" />
                    <Text style={styles.count}>{item.upvotes || 0}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => rsvp(item.id)}
                >
                    <Ionicons name="checkmark-circle" size={24} color="#2196F3" />
                    <Text style={styles.count}>{item.rsvps || 0}</Text>
                </TouchableOpacity>
                </View>
            </TouchableOpacity>
            )}
            ListEmptyComponent={
            <Text style={styles.empty}>No upcoming events</Text>
            }
        />
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    card: {
        marginVertical: 8,
        padding: 12,
        backgroundColor: '#fafafa',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#eee',
    },
    title: { fontSize: 16, fontWeight: '500' },
    meta: { color: '#555', marginTop: 4 },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
    },
    actionBtn: { alignItems: 'center' },
    count: { marginTop: 4 },
    empty: { textAlign: 'center', marginTop: 32, color: '#888' },
    });
