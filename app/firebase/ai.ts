import { RubricRequirement } from "@/types/rubric";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./init";

export async function gradeEssay(prompt: string, essay: string, rubric: RubricRequirement[], gradeLevel: number) {
    let totalPoints = 0;
    rubric.forEach((requirement) => {
        totalPoints += requirement.points;
    });

    const rubricStr = rubric.map((requirement) => {
        return `${requirement.requirement}:${requirement.points}`;
    }).join(",");

    const requestRef = doc(collection(db, 'grade_requests'));
    await setDoc(requestRef, {
        prompt,
        essay,
        totalPoints: totalPoints.toString(),
        gradeLevel: gradeLevel.toString(),
        rubric: rubricStr
    });

    const res: any = await new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(requestRef, (doc) => {
            const data = doc.data();
            if (!data) return;
            const status = data.status;
            if (!status) return;
            const state = status.state;
            if (!state) return;

            if (state === 'COMPLETED') {
                unsubscribe();
                resolve(doc.data());
            } else if (state === 'ERROR') {
                unsubscribe();
                reject("No such document!");
            }
        });
    });

    return parseGrade(res.output);
}

export function parseGrade(response: string) {
    const gradeStr = response.split("|")[0];
    const grade: number = parseFloat(gradeStr.split("/")[0]);
    const maxGrade: number = parseFloat(gradeStr.split("/")[1]);
    const rubric = response.split("|")[1];
    const feedback = response.split("|")[2];
    return {
        grade,
        maxGrade,
        rubric,
        feedback
    };
}