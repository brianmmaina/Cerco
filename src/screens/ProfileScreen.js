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
import { auth, db, storage } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { colors, spacing, typography } from '../theme';

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

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

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(u => {
        setUser(u);
        if (initializing) setInitializing(false);
        });
        return unsub;
    }, [initializing]);

    useEffect(() => {
        if (!user) return;
        const refDoc = doc(db, 'users', user.uid, 'profile', 'info');
        getDoc(refDoc)
        .then(snap => {
            if (snap.exists()) setProfile(snap.data());
        })
        .catch(console.warn)
        .finally(() => setLoadingProfile(false));
    }, [user]);

    const pickPhoto = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        });
        if (!res.cancelled) setNewPhotoUri(res.uri);
    };

    const saveProfile = async () => {
        setSaving(true);
        try {
        let photoUrl = profile.photoUrl;
        if (newPhotoUri) {
            const blob = await (await fetch(newPhotoUri)).blob();
            const storageRef = ref(storage, `profiles/${user.uid}/${uuidv4()}`);
            await uploadBytes(storageRef, blob);
            photoUrl = await getDownloadURL(storageRef);
        }
        const profileRef = doc(db, 'users', user.uid, 'profile', 'info');
        await setDoc(profileRef, {
            username:    profile.username,
            displayName: profile.displayName,
            bio:         profile.bio,
            pronouns:    profile.pronouns,
            photoUrl,
        });
        setProfile(p => ({ ...p, photoUrl }));
        setEditing(false);
        setNewPhotoUri(null);
        Alert.alert('Profile saved!');
        } catch (e) {
        console.warn(e);
        Alert.alert('Error', 'Could not save profile.');
        } finally {
        setSaving(false);
        }
    };

    if (initializing) {
        return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
        );
    }
    if (!user) {
        navigation.replace('Login');
        return null;
    }
    if (loadingProfile) {
        return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={editing ? pickPhoto : null}>
            {newPhotoUri || profile.photoUrl ? (
            <Image
                source={{ uri: newPhotoUri || profile.photoUrl }}
                style={styles.avatar}
            />
            ) : (
            <View style={[styles.avatar, { backgroundColor: colors.muted }]} />
            )}
            {editing && <Text style={styles.changePhoto}>Change Photo</Text>}
        </TouchableOpacity>

        {editing ? (
            <>
            <Text style={styles.label}>Username</Text>
            <TextInput
                placeholder="Username"
                value={profile.username}
                onChangeText={t => setProfile(p => ({ ...p, username: t }))}
                style={styles.input}
            />
            <Text style={styles.label}>Display Name</Text>
            <TextInput
                placeholder="Display Name"
                value={profile.displayName}
                onChangeText={t => setProfile(p => ({ ...p, displayName: t }))}
                style={styles.input}
            />
            <Text style={styles.label}>Bio</Text>
            <TextInput
                placeholder="Bio"
                value={profile.bio}
                onChangeText={t => setProfile(p => ({ ...p, bio: t }))}
                style={styles.textArea}
                multiline
            />
            <Text style={styles.label}>Pronouns</Text>
            <TextInput
                placeholder="Pronouns"
                value={profile.pronouns}
                onChangeText={t => setProfile(p => ({ ...p, pronouns: t }))}
                style={styles.input}
            />
            </>
        ) : (
            <>
            <Text style={styles.name}>
                {profile.displayName || user.email}
            </Text>
            <Text style={styles.username}>
                @{profile.username || user.uid.slice(0, 6)}
            </Text>
            {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
            {profile.pronouns && (
                <Text style={styles.pronouns}>{profile.pronouns}</Text>
            )}
            </>
        )}

        {editing ? (
            <View style={styles.button}>
            <Button
                title={saving ? 'Saving…' : 'Save Profile'}
                onPress={saveProfile}
                disabled={saving}
                color={colors.primary}
            />
            </View>
        ) : (
            <View style={styles.button}>
            <Button
                title="Edit Profile"
                onPress={() => setEditing(true)}
                color={colors.primary}
            />
            </View>
        )}

        <View style={styles.button}>
            <Button
            title="Settings"
            onPress={() => navigation.navigate('Settings')}
            color={colors.secondary}
            />
        </View>
        </ScrollView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        padding:    spacing.medium,
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    center: {
        flex:           1,
        justifyContent: 'center',
        alignItems:     'center',
        backgroundColor: colors.background,
    },
    avatar: {
        width:        120,
        height:       120,
        borderRadius: 60,
        backgroundColor: colors.muted,
    },
    changePhoto: {
        color:          colors.primary,
        marginTop:      spacing.small,
        marginBottom:   spacing.small,
    },
    label: {
        ...typography.body,
        alignSelf: 'flex-start',
        marginTop: spacing.medium,
        marginBottom: spacing.tiny,
        color: colors.text,
    },
    input: {
        width:             '100%',
        borderBottomWidth: 1,
        borderBottomColor: colors.muted,
        marginBottom:      spacing.medium,
        paddingVertical:   spacing.small,
        color:             colors.text,
    },
    textArea: {
        width:             '100%',
        borderWidth:       1,
        borderColor:       colors.muted,
        marginBottom:      spacing.medium,
        padding:           spacing.small,
        height:            80,
        textAlignVertical: 'top',
        color:             colors.text,
    },
    name: {
        ...typography.h2,
        marginTop:    spacing.medium,
        color:        colors.text,
    },
    username: {
        ...typography.body,
        color:      colors.muted,
        marginBottom: spacing.medium,
    },
    bio: {
        ...typography.body,
        fontStyle:  'italic',
        textAlign:  'center',
        marginBottom: spacing.small,
        color:      colors.text,
    },
    pronouns: {
        ...typography.body,
        marginBottom: spacing.medium,
        color:      colors.text,
    },
    button: {
        width:      '80%',
        marginVertical: spacing.small,
    },
});
