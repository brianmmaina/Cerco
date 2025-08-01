const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { schedule } = require('firebase-functions/v2/scheduler');

// Initialize the Admin SDK
initializeApp();

// Scheduled weekly reset: runs every Monday at 08:00 in Africa/Nairobi
    exports.weeklyReset = schedule(
    {
        schedule: 'every monday 08:00',
        timeZone: 'Africa/Nairobi',
    },
    async () => {
        const db = getFirestore();
        const snaps = await db.collection('events').get();
        const batch = db.batch();

        snaps.forEach((docSnap) => {
        batch.update(docSnap.ref, { weeklyUpvotes: 0 });
        });

        await batch.commit();
        console.log('weeklyReset complete');
        return null;
    }
);
