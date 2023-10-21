import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./init";
import { generateId } from "@/util/id";
import { collection, doc, onSnapshot } from "firebase/firestore";

export async function extractText(image: Blob) {
    const storageRef = ref(storage, 'images/' + generateId());
    await uploadBytes(storageRef, image);

    return await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(null);
        }, 10000);

        const unsubscribe = onSnapshot(doc(collection(db, 'image_to_text'), storageRef.name), (doc) => {
            const data = doc.data();
            if (!data) return;

            clearTimeout(timer);
            resolve(doc.data()?.text);
            unsubscribe();
        });
    });
}