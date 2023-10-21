import { GoogleAuthProvider, OAuthProvider, UserCredential, createUserWithEmailAndPassword, getAdditionalUserInfo, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db } from "./init";
import User from "../types/user";
import { Timestamp, collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

export async function signInWithEmail(email: string, password: string): Promise<User> {
    const uc = await signInWithEmailAndPassword(auth, email, password);
    const user = await getUser(uc.user.uid);
    if (!user) {
        throw new Error('User not found in database');
    }

    return user;
}

export async function signUpWithEmail(email: string, password: string, name: string): Promise<User> {
    const uc = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocument(uc, name);
    const user = await getUser(uc.user.uid);
    if (!user) {
        throw new Error('User not found in database');
    }

    return user;
}

export async function signInWithProvider(providerName: 'google' | 'microsoft'): Promise<User> {
    const provider = providerName === 'google' ? new GoogleAuthProvider() : new OAuthProvider('microsoft.com');
    if (providerName === 'microsoft') {
        provider.setCustomParameters({
            prompt: 'consent',
            tenant: 'f8cdef31-a31e-4b4a-93e4-5f571e91255a',
        })
    }

    const uc = await signInWithPopup(auth, provider);
    const additionalUserInfo = getAdditionalUserInfo(uc);

    if (additionalUserInfo?.isNewUser) {
        await createUserDocument(uc);
    }

    const user = await getUser(uc.user.uid);
    if (!user) {
        throw new Error('User not found in database');
    }

    return user;
}

const userCache: { [uid: string]: User } = {};
export async function getUser(uid: string, revalidate: boolean = false): Promise<User | null> {
    if (userCache[uid] && !revalidate) {
        return userCache[uid];
    }

    const userDoc = doc(collection(db, 'users'), uid);
    const userSnap = await getDoc(userDoc);

    if (userSnap.exists()) {
        const user = userSnap.data() as User;
        userCache[uid] = user;
        return user;
    }

    return null;
}

export async function updateUser(uid: string) {
    await getUser(uid, true);
}

async function createUserDocument(user: UserCredential, name?: string) {
    const userDoc = doc(collection(db, 'users'), user.user.uid);
    const userObj: User = {
        id: user.user.uid,
        name: name ?? (user.user.displayName ?? ''),
        email: user.user.email ?? '',
        picture: user.user.photoURL ?? '',
        createdAt: Timestamp.now(),
    };
    await setDoc(userDoc, userObj);
}

export async function deleteAccount() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        return;
    }

    const userDoc = doc(collection(db, 'users'), currentUser.uid);
    await deleteDoc(userDoc);
    await currentUser.delete();
    delete userCache[currentUser.uid];
}