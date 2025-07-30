// src/screens/MapScreen.js

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { colors } from '../theme';

export default function MapScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'events'));
        const unsub = onSnapshot(q, snap => {
        setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
        });
        return unsub;
    }, []);

    if (loading) {
        return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
        );
    }

    const initialRegion = {
        latitude:  events[0]?.latitude  ?? 42.3505,
        longitude: events[0]?.longitude ?? -71.1054,
        latitudeDelta:  0.05,
        longitudeDelta: 0.05,
    };

    return (
        <MapView style={styles.map} initialRegion={initialRegion}>
        {events.map(evt => {
            const popularity = (evt.upvotes || 0) + (evt.rsvps || 0);
            return (
            <Marker
                key={evt.id}
                coordinate={{
                latitude:  evt.latitude,
                longitude: evt.longitude,
                }}
                title={evt.name}
                description={evt.date}
                pinColor={popularity > 10 ? colors.secondary : colors.primary}
                onCalloutPress={() =>
                navigation.navigate('Details', { id: evt.id })
                }
            />
            );
        })}
        </MapView>
    );
    }

    const styles = StyleSheet.create({
    map: {
        width:  Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    center: {
        flex:           1,
        justifyContent: 'center',
        alignItems:     'center',
        backgroundColor: colors.background,
    },
});
