"use client";

import StageOne from "@/svg/stageone";
import Upload from "@/svg/upload";
import BWArtboard from "@/svg/bwartboard";
import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import StageTwo from "@/svg/stagetwp";
import Plus from "@/svg/plus";

export default function GradePage() {
  const [page, setPage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState<string>("Enter Car Ride");
  const [points, setPoints] = useState<number>(5);
  const [rubrics, setRubrics] = useState({});

  function getPage() {
    if (page % 2 == 0) {
      return upload();
    } else {
      return rubric();
    }
  }

  function Adding() {
    if (adding) {
      console.log("True");
      return (
        <>
          <div className="absolute w-full h-full bg-black bg-opacity-30 z-10">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-14 py-10 rounded-2xl">
              <div className="flex flex-col items-center mt-4">
                <div className="flex flex-col items-center mb-8">
                  <h1 className="text-3xl font-medium mb-8 px-10">
                    Add rubric entry
                  </h1>
                  <Input
                    placeholder="Enter Car Ride"
                    className="w-full text-xl mb-4"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="5"
                    endContent="points"
                    className="w-full mb-8"
                    onChange={(e) => {
                      setPoints(parseInt(e.target.value));
                    }}
                  />

                  <Button
                    className="bg-red-500 rounded-full py-6 px-6 "
                    onPress={() => {
                      setAdding(false);
                      setRubrics({ ...rubrics, name: points });
                    }}
                  >
                    <b className="text-white">Add Entry</b>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
    return null;
  }

  function upload() {
    return (
      <>
        <h1 className="text-5xl font-bold">Upload your Essay</h1>
        <StageOne className="mt-10" />
        <div className="rounded-3xl border border-grey-200 border-dashed border-black flex flex-col p-16 mt-7 space-y-4 items-center">
          <Upload />
          <Button
            onPress={() => {
              setPage((lastPage) => lastPage + 1);
            }}
            className="rounded-full bg-red-500 flex-col py-7 px-7 relative z-1"
          >
            <b className="text-white">Upload a PNG</b>
          </Button>
        </div>
      </>
    );
  }

  function rubric() {
    return (
      <>
        <h1 className="text-5xl font-bold">Add your rubric below.</h1>
        <StageTwo className="mt-10" />
        <div className="flex flex-row space-x-2 mt-16 mb-8">
          <div className="flex flex-row px-9 py-5 items-start space-x-10 rounded-full border border-gray-300 bg-white shadow-sm">
            <b>Defensible Thesis</b>
            <b>5</b>
          </div>
        </div>
        <Button
          onPress={() => {
            setAdding(true);
          }}
          className="rounded-full bg-red-500 flex-col py-7 px-7"
        >
          <div className="flex flex-row space-x-2">
            <b className="text-white">Add Now.</b> <Plus className="w-4" />
          </div>
        </Button>
      </>
    );
  }

  return (
    <>
      {Adding()}
      <BWArtboard className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      <div className="w-full min-h-[80vh] flex flex-col items-center mt-[12.5vh]">
        {getPage()}
      </div>
    </>
  );
}
