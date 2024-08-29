import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <main className="tw-flex tw-h-dvh tw-w-full tw-items-center tw-justify-center">
      <h1>Hello World!</h1>
    </main>
  );
}
