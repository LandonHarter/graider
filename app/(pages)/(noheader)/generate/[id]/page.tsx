'use client'

import { db, functions, storage } from "@/firebase/init";
import { getDownloadURL, ref } from "firebase/storage";
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react";
import { httpsCallable } from 'firebase/functions';
import { collection, doc, getDoc } from "firebase/firestore";
import { parseGrade } from "@/firebase/ai";
import Loading from "@/components/loading/loading";

export default function GenerateResults() {
    const id = usePathname().split("/")[2];
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const resultRef = ref(storage, `results/${id}`);

            try {
                const url = await getDownloadURL(resultRef);
                router.push(url);
                return;
            } catch (e) { }

            const resultDoc = doc(collection(db, 'grade_requests'), id);
            const result = await getDoc(resultDoc);
            if (!result.exists()) {
                return;
            }
            const parsed = parseGrade(result.data().output);

            const realRubric = result.data().rubric.split(',').map((r: string) => {
                const text = r.split(':')[0];
                const pointsPossible = parseInt(r.split(':')[1]);
                return {
                    text,
                    pointsPossible
                };
            });
            const rubrics: {
                text: string;
                pointsEarned: number;
                pointsPossible: number;
            }[] = [];
            parsed.rubric.split(',').map((rubric, i) => {
                let text = rubric.split(':')[0];
                text = text.replaceAll('[', '');
                text = text.replaceAll(']', '');
                if (text.startsWith(' ')) {
                    text = text.substring(1);
                }
                const pointsEarned = parseInt(rubric.split(':')[1].split('/')[0]);

                rubrics.push({
                    text,
                    pointsEarned,
                    pointsPossible: realRubric[i].pointsPossible
                });
            });

            const generateResults = httpsCallable(functions, 'generateResults');
            const res = await generateResults({
                title: 'Graider Results',
                feedback: parsed.feedback,
                rubric: rubrics,
                pct: (parsed.grade / parsed.maxGrade * 100).toFixed(2),
                pointsEarned: parsed.grade,
                pointsPossible: parsed.maxGrade,
                id
            });
            const url = (res.data as any).fileUrl;
            router.push(url);
        })();
    }, []);

    return <Loading />;
}