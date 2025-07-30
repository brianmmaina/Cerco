// src/screens/FeedScreen.js

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    runTransaction,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

export default function FeedScreen({ navigation }) {
    const uid = auth.currentUser.uid;
    const [events, setEvents]       = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [upvotes, setUpvotes]     = useState(new Set());
    const [rsvps, setRsvps]         = useState(new Set());
    const [loading, setLoading]     = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'events'), orderBy('timestamp', 'desc'));
        const unsub = onSnapshot(q, snap => {
        setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
        });
        return unsub;
    }, []);

    useEffect(() => {
        const favCol = collection(db, 'users', uid, 'favorites');
        return onSnapshot(favCol, snap => {
        setFavorites(new Set(snap.docs.map(d => d.id)));
        });
    }, []);

    useEffect(() => {
        const upvCol = collection(db, 'users', uid, 'upvotes');
        return onSnapshot(upvCol, snap => {
        setUpvotes(new Set(snap.docs.map(d => d.id)));
        });
    }, []);

    useEffect(() => {
        const rsvpCol = collection(db, 'users', uid, 'rsvps');
        return onSnapshot(rsvpCol, snap => {
        setRsvps(new Set(snap.docs.map(d => d.id)));
        });
    }, []);

    const toggleFavorite = async eventId => {
        const favRef = doc(db, 'users', uid, 'favorites', eventId);
        if (favorites.has(eventId)) {
        await favRef.delete();
        } else {
        await favRef.set({ at: Date.now() });
        }
    };

    const toggleUpvote = async eventId => {
        const eventRef = doc(db, 'events', eventId);
        const userUpv  = doc(db, 'users', uid, 'upvotes', eventId);
        await runTransaction(db, async tx => {
        const ev = await tx.get(eventRef);
        if (!ev.exists()) return;
        const count = ev.data().upvotes || 0;
        if (upvotes.has(eventId)) {
            tx.update(eventRef, { upvotes: count - 1 });
            tx.delete(userUpv);
        } else {
            tx.update(eventRef, { upvotes: count + 1 });
            tx.set(userUpv, { at: Date.now() });
        }
        });
    };

    const toggleRsvp = async eventId => {
        const eventRef = doc(db, 'events', eventId);
        const userRsvp = doc(db, 'users', uid, 'rsvps', eventId);
        await runTransaction(db, async tx => {
        const ev = await tx.get(eventRef);
        if (!ev.exists()) return;
        const count = ev.data().rsvps || 0;
        if (rsvps.has(eventId)) {
            tx.update(eventRef, { rsvps: count - 1 });
            tx.delete(userRsvp);
        } else {
            tx.update(eventRef, { rsvps: count + 1 });
            tx.set(userRsvp, { at: Date.now() });
        }
        });
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
        <TouchableOpacity
            onPress={() => navigation.navigate('Details', { id: item.id })}
        >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
            {item.date} @ {item.time || '—'}
            </Text>
        </TouchableOpacity>

        <View style={styles.actions}>
            <TouchableOpacity onPress={() => toggleUpvote(item.id)}>
            <Ionicons
                name={upvotes.has(item.id) ? 'heart' : 'heart-outline'}
                size={24}
                color={upvotes.has(item.id) ? colors.primary : colors.muted}
            />
            <Text style={styles.count}>{item.upvotes || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => toggleRsvp(item.id)}>
            <Ionicons
                name={
                rsvps.has(item.id)
                    ? 'checkmark-circle'
                    : 'checkmark-circle-outline'
                }
                size={24}
                color={rsvps.has(item.id) ? colors.secondary : colors.muted}
            />
            <Text style={styles.count}>{item.rsvps || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <Ionicons
                name={favorites.has(item.id) ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={favorites.has(item.id) ? colors.secondary : colors.muted}
            />
            </TouchableOpacity>
        </View>
        </View>
    );

    if (loading) {
        return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
        );
    }

    return (
        <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No events yet</Text>}
        />
    );
    }

    const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    list: {
        padding: spacing.medium,
        backgroundColor: colors.background,
    },
    card: {
        padding: spacing.medium,
        marginBottom: spacing.medium,
        backgroundColor: colors.surface,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    name: {
        ...typography.body,
        fontWeight: '500',
        color: colors.text,
    },
    meta: {
        ...typography.caption,
        marginTop: spacing.tiny,
        color: colors.muted,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.small,
    },
    count: {
        ...typography.caption,
        marginTop: spacing.tiny,
        color: colors.text,
    },
    empty: {
        ...typography.body,
        textAlign: 'center',
        marginTop: spacing.large,
        color: colors.muted,
    },
});
