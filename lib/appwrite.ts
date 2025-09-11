import { Account, Client, Databases } from 'react-native-appwrite';

const client = new Client();

console.log("🔧 Platform:", process.env.EXPO_PUBLIC_APPWRITE_PLATFORM);

client
.setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
.setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!);

const account = new Account(client)
const databases = new Databases(client)

export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!;
export const HABITS_COLLECTION_ID = process.env.EXPO_PUBLIC_HABITS_COLLECTION_ID!;

export const COMPLETION_COLLECTION_ID = process.env.EXPO_PUBLIC_COMPLETION_COLLECTION_ID!;

export { account, client, databases };

export interface RealtimeResponse {
    events: string[];
    payload: any;
}