// src/screens/EventDetailsScreen.js

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Button,
} from 'react-native';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

export default function EventDetailsScreen({ route, navigation }) {
    const { id } = route.params;
    const uid = auth.currentUser.uid;

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorited, setFavorited] = useState(false);
    const [upvoted, setUpvoted] = useState(false);
    const [rsvped, setRsvped] = useState(false);

    useEffect(() => {
        // listen to event document
        const unsubEvent = onSnapshot(
        doc(db, 'events', id),
        docSnap => {
            setEvent({ id: docSnap.id, ...docSnap.data() });
            setLoading(false);
        },
        () => setLoading(false)
        );

        // listen to favorite
        const unsubFav = onSnapshot(
        doc(db, 'users', uid, 'favorites', id),
        favSnap => setFavorited(favSnap.exists())
        );

        // listen to upvote marker
        const unsubUpv = onSnapshot(
        doc(db, 'users', uid, 'upvotes', id),
        upvSnap => setUpvoted(upvSnap.exists())
        );

        // listen to rsvp marker
        const unsubRsvp = onSnapshot(
        doc(db, 'users', uid, 'rsvps', id),
        rsvpSnap => setRsvped(rsvpSnap.exists())
        );

        return () => {
        unsubEvent();
        unsubFav();
        unsubUpv();
        unsubRsvp();
        };
    }, [id, uid]);

    const toggleFavorite = async () => {
        const favRef = doc(db, 'users', uid, 'favorites', id);
        if (favorited) {
        await updateDoc(favRef, { _deleted: true }).catch(() => favRef.delete());
        } else {
        await updateDoc(favRef, { at: Date.now() }).catch(() =>
            favRef.set({ at: Date.now() })
        );
        }
    };

    const toggleUpvote = async () => {
        const evRef = doc(db, 'events', id);
        const userUpvRef = doc(db, 'users', uid, 'upvotes', id);
        if (upvoted) {
        await updateDoc(evRef, { upvotes: increment(-1) });
        await userUpvRef.delete();
        } else {
        await updateDoc(evRef, { upvotes: increment(1) });
        await userUpvRef.set({ at: Date.now() });
        }
    };

    const toggleRsvp = async () => {
        const evRef = doc(db, 'events', id);
        const userRsvpRef = doc(db, 'users', uid, 'rsvps', id);
        if (rsvped) {
        await updateDoc(evRef, { rsvps: increment(-1) });
        await userRsvpRef.delete();
        } else {
        await updateDoc(evRef, { rsvps: increment(1) });
        await userRsvpRef.set({ at: Date.now() });
        }
    };

    if (loading) {
        return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
        );
    }

    if (!event) {
        return (
        <View style={styles.center}>
            <Text style={styles.empty}>Event not found</Text>
        </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
        {event.posterUrl && (
            <Image source={{ uri: event.posterUrl }} style={styles.poster} />
        )}
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.meta}>
            {event.date} @ {event.time || '—'}
        </Text>
        <Text style={styles.meta}>{event.location}</Text>

        {event.description ? (
            <Text style={styles.section}>{event.description}</Text>
        ) : null}
        {event.rules ? (
            <Text style={styles.section}>Rules: {event.rules}</Text>
        ) : null}
        <Text style={styles.section}>
            Capacity: {event.capacity ?? 'Unlimited'}
        </Text>

        <View style={styles.actions}>
            <TouchableOpacity onPress={toggleUpvote} style={styles.actionBtn}>
            <Ionicons
                name={upvoted ? 'heart' : 'heart-outline'}
                size={28}
                color={upvoted ? colors.primary : colors.muted}
            />
            <Text style={styles.count}>{event.upvotes || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleRsvp} style={styles.actionBtn}>
            <Ionicons
                name={rsvped ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={28}
                color={rsvped ? colors.secondary : colors.muted}
            />
            <Text style={styles.count}>{event.rsvps || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFavorite} style={styles.actionBtn}>
            <Ionicons
                name={favorited ? 'bookmark' : 'bookmark-outline'}
                size={28}
                color={favorited ? colors.secondary : colors.muted}
            />
            </TouchableOpacity>
        </View>

        <View style={styles.footer}>
            <Button
            title="Back"
            onPress={() => navigation.goBack()}
            color={colors.primary}
            />
        </View>
        </ScrollView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        padding: spacing.medium,
        backgroundColor: colors.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    poster: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: spacing.medium,
    },
    title: {
        ...typography.h2,
        marginBottom: spacing.small,
    },
    meta: {
        ...typography.body,
        color: colors.muted,
        marginBottom: spacing.small,
    },
    section: {
        ...typography.body,
        marginBottom: spacing.small,
        color: colors.text,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: spacing.large,
    },
    actionBtn: {
        alignItems: 'center',
        width: 60,
    },
    count: {
        ...typography.caption,
        marginTop: spacing.tiny,
    },
    footer: {
        marginTop: spacing.large,
    },
    empty: {
        ...typography.body,
        color: colors.error,
    },
});
