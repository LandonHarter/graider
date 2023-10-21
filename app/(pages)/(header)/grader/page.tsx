import StageOne from "@/svg/stageone";
import Upload from "@/svg/upload";
import BWArtboard from "@/svg/bwartboard";

export default function GradePage() {
  return (
    <>
      <BWArtboard className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      <div className="w-full min-h-[80vh] flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold">Upload your Essay</h1>
        <StageOne className="mt-10" />
        <div className="rounded-3xl border border-grey-200 border-dashed border-black flex flex-col p-16 mt-7 space-y-4 items-center">
          <Upload />
          <div className="rounded-full bg-red-500 flex-col py-4 px-7">
            <b className="text-white">Upload a PNG</b>
          </div>
        </div>
      </div>
    </>
  );
}
