// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen       from './src/screens/LoginScreen';
import SignupScreen      from './src/screens/SignupScreen';
import VerifyEmailScreen from './src/screens/VerifyEmailScreen';
import HomeScreen        from './src/screens/HomeScreen';
import CalendarScreen    from './src/screens/CalendarScreen';
import FeedScreen        from './src/screens/FeedScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';
import CreateEventScreen from './src/screens/CreateEventScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        // 👇 change this to Home to skip login flow
        initialRouteName="Home"
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Log In' }}
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen 
          name="VerifyEmail" 
          component={VerifyEmailScreen} 
          options={{ title: 'Verify Email' }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Calendar" 
          component={CalendarScreen} 
          options={{ title: 'Calendar' }}
        />
        <Stack.Screen 
          name="Feed" 
          component={FeedScreen} 
          options={{ title: 'Feed' }}
        />
        <Stack.Screen 
        name="Details" 
        component={EventDetailsScreen} 
        options={{ title: 'Event Details' }}
        />
        <Stack.Screen 
        name="Create" 
        component={CreateEventScreen} 
        options={{ title: 'Create Event' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
