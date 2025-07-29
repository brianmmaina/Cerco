// src/screens/ProfileScreen.js

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    Button,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
    doc,
    getDoc,
    setDoc,
    collection,
    onSnapshot,
    query,
    where,
    orderBy,
    getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';

export default function ProfileScreen({ navigation }) {
    const uid = auth.currentUser.uid;

    // Profile fields
    const [profile, setProfile] = useState({
        username: '',
        displayName: '',
        bio: '',
        pronouns: '',
        photoUrl: '',
    });
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [editing, setEditing] = useState(false);
    const [newPhotoUri, setNewPhotoUri] = useState(null);
    const [saving, setSaving] = useState(false);

    // Other lists: favorites, myEvents, myRsvps (omitted here but we will implement them later ofc :) )

    // Fetch profile
    useEffect(() => {
        const refDoc = doc(db, 'users', uid, 'profile', 'info');
        getDoc(refDoc)
        .then(snap => {
            if (snap.exists()) setProfile(snap.data());
        })
        .catch(err => console.warn('Error loading profile:', err))
        .finally(() => setLoadingProfile(false));
    }, []);

    // Pick a new profile photo
    const pickPhoto = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        });
        if (!res.cancelled) setNewPhotoUri(res.uri);
    };

    // Save profile changes
    const saveProfile = async () => {
        setSaving(true);
        try {
        let photoUrl = profile.photoUrl;
        if (newPhotoUri) {
            const blob = await (await fetch(newPhotoUri)).blob();
            const storageRef = ref(storage, `profiles/${uid}/${uuidv4()}`);
            await uploadBytes(storageRef, blob);
            photoUrl = await getDownloadURL(storageRef);
        }

        const profileRef = doc(db, 'users', uid, 'profile', 'info');
        await setDoc(profileRef, {
            username:    profile.username,
            displayName: profile.displayName,
            bio:         profile.bio,
            pronouns:    profile.pronouns,
            photoUrl,
        });

        setProfile(prev => ({ ...prev, photoUrl }));
        setEditing(false);
        setNewPhotoUri(null);
        Alert.alert('Profile saved!');
        } catch (e) {
        console.warn('Save profile error:', e);
        Alert.alert('Error', 'Could not save profile.');
        } finally {
        setSaving(false);
        }
    };

    if (loadingProfile) {
        return (
        <View style={styles.center}>
            <ActivityIndicator size="large" />
        </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Photo */}
        <TouchableOpacity onPress={editing ? pickPhoto : null}>
            <Image
            source={
                newPhotoUri
                ? { uri: newPhotoUri }
                : profile.photoUrl
                ? { uri: profile.photoUrl }
                : require('../../assets/default-avatar.png')
            }
            style={styles.avatar}
            />
            {editing && <Text style={styles.changePhoto}>Change Photo</Text>}
        </TouchableOpacity>

        {/* Display Name & Username */}
        {editing ? (
            <>
            <TextInput
                placeholder="Username"
                value={profile.username}
                onChangeText={t => setProfile(p => ({ ...p, username: t }))}
                style={styles.input}
            />
            <TextInput
                placeholder="Display Name"
                value={profile.displayName}
                onChangeText={t => setProfile(p => ({ ...p, displayName: t }))}
                style={styles.input}
            />
            </>
        ) : (
            <>
            <Text style={styles.name}>
                {profile.displayName || auth.currentUser.email}
            </Text>
            <Text style={styles.username}>
                @{profile.username || uid.substring(0, 6)}
            </Text>
            </>
        )}

        {/* Bio & Pronouns */}
        {editing ? (
            <>
            <TextInput
                placeholder="Bio"
                value={profile.bio}
                onChangeText={t => setProfile(p => ({ ...p, bio: t }))}
                style={styles.textArea}
                multiline
            />
            <TextInput
                placeholder="Pronouns"
                value={profile.pronouns}
                onChangeText={t => setProfile(p => ({ ...p, pronouns: t }))}
                style={styles.input}
            />
            </>
        ) : (
            <>
            {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
            {profile.pronouns ? (
                <Text style={styles.pronouns}>{profile.pronouns}</Text>
            ) : null}
            </>
        )}

        {/* Edit / Save Buttons */}
        {editing ? (
            <Button
            title={saving ? 'Saving…' : 'Save Profile'}
            onPress={saveProfile}
            disabled={saving}
            />
        ) : (
            <Button title="Edit Profile" onPress={() => setEditing(true)} />
        )}

        {/* Settings Button */}
        <View style={styles.settingsButton}>
            <Button
            title="Settings"
            onPress={() => navigation.navigate('Settings')}
            />
        </View>

        {/* Here you can render Favorites / My Events / My RSVPs lists below */}
        </ScrollView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ddd',
    },
    changePhoto: {
        color: '#007AFF',
        marginTop: 4,
        marginBottom: 12,
        textAlign: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 12,
    },
    username: {
        fontSize: 14,
        color: '#555',
        marginBottom: 12,
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        marginBottom: 12,
        paddingVertical: 8,
    },
    textArea: {
        width: '100%',
        borderWidth: 1,
        marginBottom: 12,
        padding: 8,
        height: 80,
        textAlignVertical: 'top',
    },
    bio: {
        fontSize: 16,
        fontStyle: 'italic',
        marginVertical: 8,
        textAlign: 'center',
    },
    pronouns: {
        fontSize: 14,
        marginBottom: 12,
        color: '#555',
    },
    settingsButton: {
        marginTop: 24,
        alignSelf: 'center',
        width: '60%',
    },
});
