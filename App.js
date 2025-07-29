// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import CalendarScreen     from './src/screens/CalendarScreen';
import FeedScreen         from './src/screens/FeedScreen';
import MapScreen          from './src/screens/MapScreen';         
import CreateEventScreen  from './src/screens/CreateEventScreen';
import ProfileScreen      from './src/screens/ProfileScreen';   
import SettingsScreen     from './src/screens/SettingsScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';

// Calendar stack
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

// Feed stack
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

// Create stack
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

// Profile stack
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

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Calendar') iconName = 'calendar';
            else if (route.name === 'Feed') iconName = 'list';
            else if (route.name === 'Map') iconName = 'map';
            else if (route.name === 'Create') iconName = 'add-circle';
            else if (route.name === 'Profile') iconName = 'person';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Calendar" component={CalendarStackScreen} />
        <Tab.Screen name="Feed"     component={FeedStackScreen}     />
        <Tab.Screen name="Map"      component={MapScreen}            />
        <Tab.Screen name="Create"   component={CreateStackScreen}    />
        <Tab.Screen name="Profile"  component={ProfileStackScreen}   />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
