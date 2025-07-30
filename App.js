// App.js
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator
} from '@react-navigation/native-stack';
import {
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebase/config';

// Auth screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import VerifyEmailScreen from './src/screens/VerifyEmailScreen';

// Main app screens
import CalendarScreen from './src/screens/CalendarScreen';
import FeedScreen from './src/screens/FeedScreen';
import MapScreen from './src/screens/MapScreen';
import CreateEventScreen from './src/screens/CreateEventScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';

// --- Auth Stack ---
const AuthStack = createNativeStackNavigator();
function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login"   component={LoginScreen} />
      <AuthStack.Screen name="Signup"  component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

// --- Verify Email Stack ---
const VerifyStack = createNativeStackNavigator();
function VerifyStackScreen() {
  return (
    <VerifyStack.Navigator screenOptions={{ headerShown: false }}>
      <VerifyStack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
      />
    </VerifyStack.Navigator>
  );
}

// --- Calendar Stack ---
const CalendarStack = createNativeStackNavigator();
function CalendarStackScreen() {
  return (
    <CalendarStack.Navigator>
      <CalendarStack.Screen
        name="CalendarMain"
        component={CalendarScreen}
        options={{ headerTitle: 'Calendar' }}
      />
      <CalendarStack.Screen
        name="Details"
        component={EventDetailsScreen}
        options={{ title: 'Event Details' }}
      />
    </CalendarStack.Navigator>
  );
}

// --- Feed Stack ---
const FeedStack = createNativeStackNavigator();
function FeedStackScreen() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen
        name="FeedMain"
        component={FeedScreen}
        options={{ headerTitle: 'Feed' }}
      />
      <FeedStack.Screen
        name="Details"
        component={EventDetailsScreen}
        options={{ title: 'Event Details' }}
      />
    </FeedStack.Navigator>
  );
}

// --- Create Stack ---
const CreateStack = createNativeStackNavigator();
function CreateStackScreen() {
  return (
    <CreateStack.Navigator>
      <CreateStack.Screen
        name="CreateMain"
        component={CreateEventScreen}
        options={{ headerTitle: 'Create Event' }}
      />
    </CreateStack.Navigator>
  );
}

// --- Profile Stack ---
const ProfileStack = createNativeStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerTitle: 'Profile' }}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerTitle: 'Settings' }}
      />
    </ProfileStack.Navigator>
  );
}

// --- Main Tab Navigator ---
const Tab = createBottomTabNavigator();
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon;
          switch (route.name) {
            case 'Calendar': icon = 'calendar'; break;
            case 'Feed':     icon = 'list';     break;
            case 'Map':      icon = 'map';      break;
            case 'Create':   icon = 'add-circle'; break;
            case 'Profile':  icon = 'person';   break;
            default:         icon = 'ellipse';  break;
          }
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen  name="Calendar" component={CalendarStackScreen} />
      <Tab.Screen  name="Feed"     component={FeedStackScreen}     />
      <Tab.Screen  name="Map"      component={MapScreen}            />
      <Tab.Screen  name="Create"   component={CreateStackScreen}    />
      <Tab.Screen  name="Profile"  component={ProfileStackScreen}   />
    </Tab.Navigator>
  );
}

// --- Root App ---
const RootStack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsub;
  }, []);

  if (initializing) {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user == null ? (
          <RootStack.Screen name="Auth" component={AuthStackScreen} />
        ) : (
          <RootStack.Screen name="Main" component={MainTabNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
