"use client";

import StageOne from "@/svg/stageone";
import Upload from "@/svg/upload";
import BWArtboard from "@/svg/bwartboard";
import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import StageTwo from "@/svg/stagetwo";
import Plus from "@/svg/plus";
import { RubricRequirement } from "@/types/rubric";
import { toast } from "sonner";
import ContinueArrowSVG from "@/svg/continue";
import styles from "./page.module.scss";
import StageThree from "@/svg/stagethree";
import { useRouter } from "next/navigation";
import { extractText } from "@/firebase/text";
import { gradeEssay } from "@/firebase/ai";
import Loading from "@/components/loading/loading";
import RequireAuth from "@/components/auth/requireauth";

export default function GradePage() {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [requirement, setRequirement] = useState<string>("");
  const [points, setPoints] = useState<number>(5);
  const [rubrics, setRubrics] = useState<RubricRequirement[]>([]);

  const [essayText, setEssayText] = useState<string>("");
  const [essayImage, setEssayImage] = useState<Blob | null>(null);
  const [essayPrompt, setEssayPrompt] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);

  const [typeEssay, setTypeEssay] = useState<boolean>(false);

  function getPage() {
    switch (page) {
      case 0:
        return upload();
      case 1:
        return prompt();
      case 2:
        return rubric();
      default:
        return <></>;
    }
  }

  function upload() {
    return (
      <>
        <h1 className="text-5xl font-bold">Upload your Essay</h1>
        <StageOne className="mt-10" />

        {typeEssay ?
          <>
            <Textarea
              type='text'
              placeholder="Essay Text"
              className="w-[700px] h-fit bg-grey-100 mt-8"
              minRows={20}
              maxRows={25}
              variant="faded"
              onChange={(e) => {
                setEssayText(e.target.value);
              }}
            />
            <Button
              className="rounded-full bg-red-500 flex-col py-7 px-7 mt-2"
              onPress={() => {
                if (essayText == "") {
                  toast.error("Please enter an essay.");
                  return;
                }
                setPage((lastPage) => lastPage + 1);
              }}
            >
              <div className="flex flex-row space-x-2">
                <b className="text-white">Continue</b>
                <ContinueArrowSVG className={styles.continue_arrow_white} />
              </div>
            </Button>
          </> :
          <label htmlFor='essay' className="rounded-3xl border border-grey-200 border-dashed border-black flex flex-col p-16 mt-7 space-y-4 items-center cursor-pointer">
            <input type='file' id='essay' className='hidden' onChange={(e) => {
              if (e.target.files) {
                setEssayImage(e.target.files[0]);
                setPage((lastPage) => lastPage + 1);
              }
            }} />

            <Upload />
            <Button
              className="rounded-full bg-red-500 flex-col py-7 px-7 relative z-1 pointer-events-none z-[-1]"
            >
              <b className="text-white">Upload a PNG</b>
            </Button>
          </label>
        }
        <p className='mt-2 font-medium text-lg text-gray-500'>or <u className='cursor-pointer' onClick={() => {
          setTypeEssay((lastType) => !lastType);
        }}>{typeEssay ? 'upload file' : 'paste essay'}</u></p>
      </>
    );
  }

  function prompt() {
    return (
      <>
        <h1 className="text-5xl font-bold">Add your prompt.</h1>
        <StageTwo className="mt-10 mb-10" />
        <div className="flex flex-col p-16 border border-gray-100 rounded-3xl items-center space-y-3 rounded-27 bg-white shadow-xl">
          <Textarea
            type='text'
            placeholder="Essay Prompt"
            className="w-[300px] min-h-[100px] bg-grey-100"
            variant="faded"
            onChange={(e) => {
              setEssayPrompt(e.target.value);
            }}
          />
          <Button
            onPress={() => {
              setPage((lastPage) => lastPage + 1);
            }}
            className="rounded-full bg-red-500 flex-col py-7 px-7 relative z-1"
          >
            <b className="text-white">Set Prompt</b>
          </Button>
        </div>
      </>
    );
  }

  function rubric() {
    return (
      <>
        <h1 className="text-5xl font-bold">Add your rubric below</h1>
        <StageThree className="mt-10" />
        <div className="w-[300px] flex flex-col items-center mt-16 mb-8">
          {rubrics.map((rubric, index) => {
            return (
              <div
                key={index}
                className="w-full flex flex-row px-9 py-5 mb-4 justify-between items-start space-x-10 rounded-full border border-gray-300 bg-white shadow-sm"
              >
                <b className="w-3/5 overflow-hidden whitespace-nowrap text-ellipsis">
                  {rubric.requirement}
                </b>
                <b>{rubric.points}</b>
              </div>
            );
          })}
          {rubrics.length == 0 && (
            <h1 className="w-[500px] text-center text-5xl font-semibold text-gray-300 mb-8">
              No requirements defined
            </h1>
          )}
        </div>
        <div className="flex items-center">
          <Button
            onPress={onOpen}
            className="rounded-full bg-red-500 flex-col py-7 px-7 mr-1"
          >
            <div className="flex flex-row space-x-2">
              <b className="text-white">Add New</b> <Plus className="w-4" />
            </div>
          </Button>
          <Button
            className="rounded-full bg-transparent flex-col py-7 px-7 ml-1"
            disabled={rubrics.length == 0}
            style={{
              opacity: rubrics.length == 0 ? 0.5 : 1,
              cursor: rubrics.length == 0 ? "not-allowed" : "pointer",
            }}
            onPress={async () => {
              if (rubrics.length == 0) {
                toast.error("Please add at least one rubric entry.");
                return;
              }
              if (essayPrompt == "") {
                toast.error("Please enter a prompt.");
                return;
              }
              if (essayText == "" && essayImage == null) {
                toast.error("Please upload an essay.");
                return;
              }

              setGenerating(true);
              let essay = essayText;
              if (essayImage) {
                essay = await extractText(essayImage) || '';
                if (essay == null || essay == '') {
                  toast.error("Failed to extract text from image.");
                  window.location.href = '/grader';
                  return;
                }
              }

              const { id } = await gradeEssay(essayPrompt, essay, rubrics);
              router.push(`/results/${id}`);
            }}
          >
            <div className="flex flex-row space-x-2 justify-center items-center">
              <b className="text-gray-600">Continue</b>
              <ContinueArrowSVG className={styles.continue_arrow} />
            </div>
          </Button>
        </div>
      </>
    );
  }

  if (generating) return <Loading />;
  return (
    <RequireAuth redirectUrl='/signin'>
      <BWArtboard className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[-1]" />
      <div className="w-full min-h-[80vh] flex flex-col items-center mt-[12.5vh]">
        {getPage()}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <ModalBody className="p-8">
              <div className="flex flex-col items-center mt-4">
                <div className="flex flex-col items-center mb-8">
                  <h1 className="text-3xl font-medium mb-8 px-10">
                    Add rubric entry
                  </h1>
                  <Input
                    placeholder="Rubric Requirement"
                    className="w-full text-xl mb-4"
                    onChange={(e) => {
                      setRequirement(e.target.value);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="1"
                    min={0}
                    endContent="points"
                    className="w-full mb-8"
                    onChange={(e) => {
                      setPoints(parseInt(e.target.value));
                    }}
                  />

                  <Button
                    className="bg-red-500 rounded-full py-6 px-6 "
                    onPress={() => {
                      if (requirement == "") {
                        toast.error("Please enter a requirement.");
                        return;
                      }

                      setRubrics([...rubrics, { requirement, points }]);
                      setRequirement("");
                      setPoints(5);
                      onClose();
                    }}
                  >
                    <b className="text-white">Add Entry</b>
                  </Button>
                </div>
              </div>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </RequireAuth>
  );
}
