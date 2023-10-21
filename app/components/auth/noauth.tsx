'use client'

import { auth } from "@/firebase/init";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function NoAuth({ children, redirectUrl }: { children: React.ReactNode, redirectUrl: string }) {
    const router = useRouter();
    const [valid, setValid] = useState(false);

    useEffect(() => {
        router.prefetch(redirectUrl);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push(redirectUrl);
                return;
            }

            setValid(!user ? true : false);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    if (!valid) return;
    return children;
}