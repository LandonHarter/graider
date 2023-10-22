'use client'

import { useAuthSession } from "@/context/UserContext";
import ArtBoard from "@/svg/artboard";
import HeroPic from "@/svg/heropic";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

export default function Home() {
  const { user } = useAuthSession();

  return (
    <div className="styles.hero">
      <div className="w-2/3 h-auto absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <ArtBoard className="w-full h-auto"></ArtBoard>
      </div>
      <div className="w-2/3 h-auto absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex flex-col justify-center items-center">
          <HeroPic className="w-2/5 h-auto mb-8"></HeroPic>
          <h1 className="full mb-[2vh] text-black text-center font-inter text-5xl font-bold">
            Get a second opinion on your essay
          </h1>
          <p className="w-1/2 text-gray-400 text-center font-inter text-2xl font-regular leading-8">
            No hassle, one click rapid grading of essays with rubric integration.
          </p>
          <div className="flex flex-row gap-0 justify-content items-center mt-[4vh]">
            <Link href={user ? '/grader' : '/signin'}>
              <Button className="font-semibold text-md p-[24px] rounded-full text-white" color='primary'>
                <p className="text-center font-inter leading-8 m-0 p-0">
                  Start Now
                </p>
              </Button>
            </Link>
            <Button className="font-semibold text-md p-[24px] rounded-full text-gray-400 leading-8 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}