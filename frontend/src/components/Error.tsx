export const Error = () => {
  return (
    <div className="flex flex-col justify-center gap-10 h-screen bg-gradient-to-b from-40% from-white to-primary/50">
      <div className="text-center flex flex-col gap-8">
        <h1 className="font-bold text-8xl underline decoration-primary underline-offset-4 text-gray-850">
          404
        </h1>
        <p className="text-gray-600 text-xl font-medium">
          No page found... &nbsp;
          <a className="underline text-primary" href="/">
            Go to Home?
          </a>
        </p>
      </div>
    </div>
  );
};
