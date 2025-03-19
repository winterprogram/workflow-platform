import * as admin from 'firebase-admin';

export class FirestoreClient {
  private db: admin.firestore.Firestore;
  
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
    }
    
    this.db = admin.firestore();
  }
  
  getCollection(name: string): admin.firestore.CollectionReference {
    return this.db.collection(name);
  }
}