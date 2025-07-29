// src/screens/MapScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function MapScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    //Fetches events in real time
    useEffect(() => {
        const q = query(collection(db, 'events'));
        const unsub = onSnapshot(q, snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setEvents(docs);
        setLoading(false);
        });
        return unsub;
    }, []);

    if (loading) {
        return (
        <View style={styles.center}>
            <ActivityIndicator size="large" />
        </View>
        );
    }

    return (
        <MapView
        style={styles.map}
        initialRegion={{
            latitude: events[0]?.latitude || 42.3505,     
            // fallback to BU coordinates
            longitude: events[0]?.longitude || -71.1054,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        }}
        >
        {events.map(evt => (
            <Marker
            key={evt.id}
            coordinate={{
                latitude: evt.latitude,
                longitude: evt.longitude,
            }}
            title={evt.name}
            description={evt.date}
            pinColor={
                (evt.upvotes || 0) + (evt.rsvps || 0) > 10 
                ? 'gold'    
                // popular events in gold
                : 'red'
                //default to red
            }
            onCalloutPress={() => navigation.navigate('Details', { id: evt.id })}
            />
        ))}
        </MapView>
    );
    }

    const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

