import { CreateEventForm } from "./event/CreateEvent/CreateEventForm";

export const Home = () => {
  return (
    <div className="flex flex-col gap-10 pt-20 h-screen bg-gradient-to-b from-40% from-white to-primary/75">
      <div className="text-center flex flex-col gap-4">
        <h1 className="font-bold text-4xl underline decoration-primary underline-offset-4 text-gray-850">
          Make sure everyone pulls up
        </h1>
        <p className="text-gray-600 text-lg font-medium">
          Inspired by{" "}
          <a className="hover:text-primary" href="https://www.when2meet.com/">
            When2Meet
          </a>
        </p>
      </div>
      <div className="flex justify-center items-center">
        <CreateEventForm />
      </div>
    </div>
  );
};
