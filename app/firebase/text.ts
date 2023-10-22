import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./init";
import { generateId } from "@/util/id";
import { collection, doc, onSnapshot } from "firebase/firestore";

export async function extractText(image: Blob) {
    const storageRef = ref(storage, 'essays/' + generateId());
    await uploadBytes(storageRef, image);

    console.log('uploaded image to storage');

    const text = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(null);
            console.log('text extraction timed out');
        }, 10000);

        const unsubscribe = onSnapshot(collection(db, 'image_to_text'), (querySnapshot) => {
            const doc = querySnapshot.docs[0];
            console.log(querySnapshot);
            if (!doc.exists() || doc.data().text === null) return;

            const data = doc.data();
            if (!data) return;

            console.log('text extracted from image');

            clearTimeout(timer);
            resolve(doc.data()?.text);
            unsubscribe();
        });
    });
    return text as string | null;
}