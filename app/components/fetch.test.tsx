// Example from: https://testing-library.com/docs/react-testing-library/example-intro
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/node";
import { setup, screen } from "@/test-utils";
import Fetch from "./fetch";

server.use(
  http.get("/greeting", () => {
    return HttpResponse.json({ greeting: "hello there" });
  }),
);

test("loads and displays greeting", async () => {
  const { user } = setup(<Fetch url="/greeting" />);

  await user.click(screen.getByText("Load Greeting"));

  await screen.findByRole("heading");

  expect(screen.getByRole("heading")).toHaveTextContent("hello there");
  expect(screen.getByRole("button")).toBeDisabled();
});

test("handles server error", async () => {
  server.use(
    http.get("/greeting", () => {
      return new HttpResponse(null, { status: 500 });
    }),
  );

  const { user } = setup(<Fetch url="/greeting" />);

  await user.click(screen.getByText("Load Greeting"));

  await screen.findByRole("alert");

  expect(screen.getByRole("alert")).toHaveTextContent("Oops, failed to fetch!");
  expect(screen.getByRole("button")).not.toBeDisabled();
});
