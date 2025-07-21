# Cerco
Cerco is a student event app tailored for Boston area campuses. It helps students find, create, and engage with campus events through calendar, feed, and map views while everything updates in real time.

## Table of Contents
- [Core Features](#core-features)
- [User Flow](#user-flow)
- [Tech Stack](#tech-stack)
- [How We’re Building](#how-were-building)
- [Feedback & Issues](#feedback--issues)
- [Contact Us](#contact-us)

## Core Features
- **Email verified signup/login** (restricted to student email domains)  
- **Weekly calendar view** (auto resets every Sunday)  
- **Daily view** (auto resets at midnight)  
- **Real-time event feed** (live updates via Firestore)  
- **Favorite, bookmark & upvote** events  
- **RSVP** to events  
- **Event creation**  
  - Name  
  - Location (map pin)  
  - Poster image  
  - Description & details  
  - Rules for entry  
  - Capacity limit  
- **Map view** with geolocated pins; popular events (by upvotes/RSVPs) are visually highlighted  
- **Profile & settings** screen (manage account, view bookmarks/RSVPs, sign out)  

## User Flow
1. **App Launch to Auth Check**  
2. **Signup / Login** to Email verification  
3. **Home: Weekly Calendar View**  
4. **Daily View** (tap a day or “Today”)  
5. **Bottom Navigation**  
   - Calendar (weekly/daily)  
   - Feed (real-time list)  
   - Map (geolocated pins)  
   - Create (event form)  
   - Profile (settings, bookmarks, RSVPs)  
6. **Event Details** (RSVP, favorite, upvote)  
7. **Data Sync** (auto reset weekly/daily, real-time Firestore updates)  

## Tech Stack
- **Frontend:** React Native (with React Navigation)  
- **Backend & Data:** Firebase Auth, Firestore, Firebase Storage  
- **Maps:** react-native-maps (Google Maps API)  
- **State Management:** React Context + Hooks   
- **Deployment:** Expo (for OTA updates) & Firebase Hosting (web preview)  

## How We’re Building
- **Modular architecture:** separate packages for UI components, services (Auth, Data, Map), and hooks  
- **Continuous integration:** linting, type-checking (TypeScript), and unit tests run on every PR  
- **Feature branches:** each feature (auth, calendar, feed, map, create, profile) lives in its own branch  
- **Realtime updates:** Firestore listeners push event changes instantly to relevant views  
- **Scheduled resets:** cloud functions clear out old events or cache weekly/daily views at UTC midnight/Sunday  

## Feedback & Issues
Found a bug or have a suggestion? Please open an issue on GitHub:  
https://github.com/your-org/cerco/issues

## Contact Us
Brian Maina – github.com/brianmmaina – bmmaina@bu.edu  
Anthony Qin – github.com/anthonyq7 – a.j.qin@wustl.edu  

## License
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

