import admin from "firebase-admin";
import fs from 'fs';
import path from 'path';
import { configDotenv } from "dotenv";

configDotenv();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if(!admin.apps.length){
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  })
}

const auth = admin.auth();
const firestore = admin.firestore();
const storage = admin.storage().bucket();

export { admin, auth, firestore, storage };