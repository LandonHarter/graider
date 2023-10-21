"use client";

import StageOne from "@/svg/stageone";
import Upload from "@/svg/upload";
import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import StageLast from "@/svg/stagelast";
import { usePathname } from "next/navigation";
import Loading from "@/components/loading/loading";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/init";
import { parseGrade } from "@/firebase/ai";
import Link from "next/link";

export default function Results() {
  const id = usePathname().split("/")[2];
  const [results, setResults] = useState<{
    pct: number;
    feedback: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const resultRef = doc(collection(db, 'grade_requests'), id);
      const results = await getDoc(resultRef);
      if (!results.exists()) {
        return;
      }

      const parsed = parseGrade(results.data().output);
      setResults({
        pct: Math.round(parsed.grade / parsed.maxGrade * 100),
        feedback: parsed.feedback
      })
    })();
  }, []);

  if (!results) {
    return (
      <Loading />
    );
  }
  return (
    <>
      <Image
        src="/images/designs/noisebg.png"
        width={500}
        height={500}
        alt="Background"
        className="absolute w-full h-full"
      ></Image>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold">Your Graider Results.</h1>
        <StageLast className="mt-10" />
        <div className="bg-red-500 border-black flex flex-col p-16 mt-10 space-y-4 items-center" style={{ borderRadius: '4rem' }}>
          <p className="text-8xl text-white font-bold">{results.pct}%</p>
        </div>
        <p className="text-gray-500 text-xl mt-5">download full report <Link href='/' className='underline'>here</Link></p>
      </div>
    </>
  );
}
